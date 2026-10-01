import { translateText as translateViaApi } from "../api/api.js";

const CACHE_KEY = "sahaayak.content-translations.v3";
const MAX_CONCURRENT_TRANSLATIONS = 6;
const PROTECTED_PARTS = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|\b(?:[a-z0-9-]+\.)+(?:gov\.in|nic\.in|org|com)\b|\b(?:e-Aadhaar|Aadhaar|UIDAI|DigiLocker|PAN|EPFO|UMANG|GST|TRACES|DILRMP|VAHAN|FASTag|e-Shram|PM-KISAN|NPS|UPI)\b|\b(?=[A-Za-z0-9_-]*\d)[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*\b|\b[A-Z][A-Z0-9_-]{1,}\b|\b\d+(?:[.,/-]\d+)*%?\b|\.(?:pdf|docx?|xlsx?|pptx?|jpe?g|png|gif|svg|xml|csv|json|zip)\b)/g;

let cache;
let activeRequests = 0;
const requestQueue = [];
const inFlight = new Map();

function readCache() {
  if (cache) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    cache = {};
  }
  return cache;
}

function cacheKey(text, sourceLanguage, targetLanguage) {
  return JSON.stringify([sourceLanguage, targetLanguage, text]);
}

export function getCachedTranslation(text, sourceLanguage, targetLanguage) {
  if (sourceLanguage === targetLanguage) return text;
  return readCache()[cacheKey(text, sourceLanguage, targetLanguage)];
}

function saveTranslation(text, sourceLanguage, targetLanguage, translatedText) {
  const translations = readCache();
  translations[cacheKey(text, sourceLanguage, targetLanguage)] = translatedText;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(translations));
  } catch {
    // Keep the in-memory cache usable when storage is unavailable or full.
  }
}

function pumpQueue() {
  while (activeRequests < MAX_CONCURRENT_TRANSLATIONS && requestQueue.length > 0) {
    const task = requestQueue.shift();
    activeRequests += 1;

    translateViaApi(task.text, task.sourceLanguage, task.targetLanguage)
      .then((response) => {
        const translatedText = response?.translatedText;
        if (typeof translatedText !== "string" || !translatedText.trim()) {
          throw new Error("Translation returned no text");
        }
        saveTranslation(task.text, task.sourceLanguage, task.targetLanguage, translatedText);
        task.resolve(translatedText);
      })
      .catch(task.reject)
      .finally(() => {
        inFlight.delete(task.key);
        activeRequests -= 1;
        pumpQueue();
      });
  }
}

export function translateCachedText(text, sourceLanguage, targetLanguage) {
  if (typeof text !== "string" || !text.trim() || sourceLanguage === targetLanguage) {
    return Promise.resolve(text);
  }

  const cached = getCachedTranslation(text, sourceLanguage, targetLanguage);
  if (cached) return Promise.resolve(cached);

  const key = cacheKey(text, sourceLanguage, targetLanguage);
  if (inFlight.has(key)) return inFlight.get(key);

  const request = new Promise((resolve, reject) => {
    requestQueue.push({ key, text, sourceLanguage, targetLanguage, resolve, reject });
  });
  inFlight.set(key, request);
  pumpQueue();
  return request;
}

async function translateAroundProtectedParts(text, sourceLanguage, targetLanguage) {
  const parts = text.split(PROTECTED_PARTS);
  const translatedParts = await Promise.all(
    parts.map(async (part) => {
      if (!part || new RegExp(PROTECTED_PARTS.source).test(part)) return part;
      const content = part.trim();
      if (!/[\p{L}]{2,}/u.test(content)) return part;
      const start = part.indexOf(content);
      const translated = await translateCachedText(content, sourceLanguage, targetLanguage);
      return `${part.slice(0, start)}${translated}${part.slice(start + content.length)}`;
    })
  );
  return translatedParts.join("");
}

export async function translateProtectedText(text, sourceLanguage, targetLanguage) {
  const cached = getCachedTranslation(text, sourceLanguage, targetLanguage);
  if (cached) return cached;

  const protectedValues = [];
  const maskedText = text.replace(PROTECTED_PARTS, (value) => {
    const marker = `ZXQPROTECTED${protectedValues.length}QXZ`;
    protectedValues.push({ marker, value });
    return marker;
  });
  const translatedMaskedText = await translateCachedText(maskedText, sourceLanguage, targetLanguage);
  const hasInvalidMarkers = protectedValues.some(
    ({ marker }) => translatedMaskedText.split(marker).length !== 2
  );
  if (hasInvalidMarkers) {
    const translatedText = await translateAroundProtectedParts(text, sourceLanguage, targetLanguage);
    if (translatedText !== text) saveTranslation(text, sourceLanguage, targetLanguage, translatedText);
    return translatedText;
  }

  const translatedText = protectedValues.reduce(
    (result, { marker, value }) => result.replace(marker, value),
    translatedMaskedText
  );
  saveTranslation(text, sourceLanguage, targetLanguage, translatedText);
  return translatedText;
}