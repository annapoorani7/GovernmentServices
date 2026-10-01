import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translateCachedText } from "./translationClient.js";
import translations, { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./translations.js";

const STORAGE_KEY = "sahaayak.lang";
const TRANSLATION_CACHE_PREFIX = "sahaayak.translations.";
const MAX_CONCURRENT_TRANSLATIONS = 6;

const LanguageContext = createContext(null);

function readCachedTranslations(language) {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(`${TRANSLATION_CACHE_PREFIX}${language}`)) || {};
  } catch {
    return {};
  }
}

function readStoredLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === stored);
  return isSupported ? stored : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);
  const [translatedStrings, setTranslatedStrings] = useState(() => readCachedTranslations(readStoredLanguage()));

  // Persist + reflect on <html lang> for accessibility / screen readers.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.setAttribute("lang", language);
    }
  }, [language]);

  useEffect(() => {
    let isMounted = true;

    if (language === DEFAULT_LANGUAGE) {
      setTranslatedStrings({});
      return () => {
        isMounted = false;
      };
    }

    const cached = readCachedTranslations(language);
    setTranslatedStrings(cached);

    const dictionary = translations[language] || {};
    const missingEntries = Object.entries(translations[DEFAULT_LANGUAGE] || {}).filter(
      ([key]) => !dictionary[key] && !cached[key]
    );
    let nextIndex = 0;

    const worker = async () => {
      while (isMounted) {
        const entry = missingEntries[nextIndex++];
        if (!entry) return;

        const [key, englishText] = entry;
        try {
          const translatedText = await translateCachedText(englishText, DEFAULT_LANGUAGE, language);
          if (!isMounted || !translatedText) continue;

          cached[key] = translatedText;
          setTranslatedStrings((current) => ({ ...current, [key]: translatedText }));
          try {
            window.localStorage.setItem(
              `${TRANSLATION_CACHE_PREFIX}${language}`,
              JSON.stringify(cached)
            );
          } catch {
            // Translation remains available for this session if storage is unavailable.
          }
        } catch {
          // Missing translations safely continue to render in English.
        }
      }
    };

    for (let index = 0; index < Math.min(MAX_CONCURRENT_TRANSLATIONS, missingEntries.length); index += 1) {
      worker();
    }

    return () => {
      isMounted = false;
    };
  }, [language]);

  const setLanguage = useCallback((code) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      setTranslatedStrings(readCachedTranslations(code));
      setLanguageState(code);
    }
  }, []);

  // Translation function with optional {placeholder} interpolation.
  const t = useCallback(
    (key, vars) => {
      let value = translations[language]?.[key] ?? translatedStrings[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([name, replacement]) => {
          value = value.replace(new RegExp(`\\{${name}\\}`, "g"), String(replacement));
        });
      }
      return value;
    },
    [language, translatedStrings]
  );

  // Localize DB content: returns obj[`${field}_${language}`] when present,
  // otherwise falls back to the base English field. Works for strings and arrays.
  const localize = useCallback(
    (obj, field) => {
      if (!obj) return undefined;
      if (language !== DEFAULT_LANGUAGE) {
        const localized = obj[`${field}_${language}`];
        const hasValue = Array.isArray(localized) ? localized.length > 0 : Boolean(localized);
        if (hasValue) return localized;
      }
      return obj[field];
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, localize, languages: SUPPORTED_LANGUAGES }),
    [language, setLanguage, t, localize]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

// Convenience hook when you only need the translate function.
export function useT() {
  return useLanguage().t;
}
