import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import translations, { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./translations.js";

const STORAGE_KEY = "sahaayak.lang";

const LanguageContext = createContext(null);

function readStoredLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === stored);
  return isSupported ? stored : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readStoredLanguage);

  // Persist + reflect on <html lang> for accessibility / screen readers.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.setAttribute("lang", language);
    }
  }, [language]);

  const setLanguage = useCallback((code) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      setLanguageState(code);
    }
  }, []);

  // Translation function with optional {placeholder} interpolation.
  const t = useCallback(
    (key, vars) => {
      const dict = translations[language] || translations[DEFAULT_LANGUAGE];
      let value = dict[key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([name, replacement]) => {
          value = value.replace(new RegExp(`\\{${name}\\}`, "g"), String(replacement));
        });
      }
      return value;
    },
    [language]
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
