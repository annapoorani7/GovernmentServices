// bhashiniClient.js
// Thin wrapper around the Bhashini (ULCA) two-step translation API.
//
// Step 1 (config): POST to the ULCA pipeline-config endpoint with the
//   source/target language pair. It returns the serviceId to use plus a
//   dynamically-issued inference endpoint + auth header (callbackUrl).
// Step 2 (compute): POST the actual text[] to that inference endpoint.
//
// Docs: https://bhashini.gov.in  (ULCA "Pipeline" APIs)
//
// The config response is cached per language-pair so we only pay the
// handshake cost once per target language, not once per string.

import "dotenv/config";

const USER_ID = process.env.BHASHINI_USER_ID;
const API_KEY = process.env.BHASHINI_API_KEY;
const PIPELINE_ID = process.env.BHASHINI_PIPELINE_ID || "64392f96daac500b55c543cd";

const CONFIG_URL =
  "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";

const TRANSLATION_TASK = "translation";

if (!USER_ID || !API_KEY) {
  console.warn(
    "⚠️  BHASHINI_USER_ID / BHASHINI_API_KEY not set. " +
      "Copy scripts/i18n/.env.bhashini.example → .env and fill them in."
  );
}

// Cache: `${source}:${target}` -> { serviceId, endpoint, authKey, authValue }
const pipelineCache = new Map();

/**
 * Step 1 — resolve the translation pipeline for a language pair.
 * Returns the serviceId + the dynamically-issued inference endpoint/auth.
 */
async function resolvePipeline(sourceLang, targetLang) {
  const cacheKey = `${sourceLang}:${targetLang}`;
  if (pipelineCache.has(cacheKey)) return pipelineCache.get(cacheKey);

  const res = await fetch(CONFIG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userID: USER_ID,
      ulcaApiKey: API_KEY,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: TRANSLATION_TASK,
          config: { language: { sourceLanguage: sourceLang, targetLanguage: targetLang } },
        },
      ],
      pipelineRequestConfig: { pipelineId: PIPELINE_ID },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Bhashini config failed (${res.status}) for ${cacheKey}: ${body}`);
  }

  const data = await res.json();

  // serviceId for the translation task
  const taskConfig = data.pipelineResponseConfig?.find((t) => t.taskType === TRANSLATION_TASK);
  const serviceId = taskConfig?.config?.[0]?.serviceId;

  // dynamically-issued inference endpoint + auth header
  const inference = data.pipelineInferenceAPIEndPoint;
  const endpoint = inference?.callbackUrl;
  const authKey = inference?.inferenceApiKey?.name;
  const authValue = inference?.inferenceApiKey?.value;

  if (!serviceId || !endpoint) {
    throw new Error(`Bhashini config incomplete for ${cacheKey}: ${JSON.stringify(data)}`);
  }

  const resolved = { serviceId, endpoint, authKey, authValue };
  pipelineCache.set(cacheKey, resolved);
  return resolved;
}

/**
 * Step 2 — translate an array of strings.
 * Bhashini accepts a batch of {source} inputs and returns {target} outputs
 * in the same order. Empty/undefined inputs are passed through as "".
 *
 * @param {string[]} texts
 * @param {string} sourceLang  ISO code, e.g. "en"
 * @param {string} targetLang  ISO code, e.g. "ta", "bn", "te"
 * @returns {Promise<string[]>}
 */
export async function translateBatch(texts, sourceLang, targetLang) {
  if (!texts.length) return [];
  const { serviceId, endpoint, authKey, authValue } = await resolvePipeline(sourceLang, targetLang);

  const headers = { "Content-Type": "application/json" };
  if (authKey && authValue) headers[authKey] = authValue;

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: TRANSLATION_TASK,
          config: {
            language: { sourceLanguage: sourceLang, targetLanguage: targetLang },
            serviceId,
          },
        },
      ],
      inputData: { input: texts.map((t) => ({ source: t ?? "" })) },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Bhashini translate failed (${res.status}) ${sourceLang}->${targetLang}: ${body}`);
  }

  const data = await res.json();
  const output = data.pipelineResponse?.find((t) => t.taskType === TRANSLATION_TASK)?.output || [];
  // output is [{ source, target }] aligned to input order
  return texts.map((_, i) => output[i]?.target ?? "");
}

/**
 * Translate a single string (convenience).
 */
export async function translateText(text, sourceLang, targetLang) {
  const [out] = await translateBatch([text], sourceLang, targetLang);
  return out;
}
