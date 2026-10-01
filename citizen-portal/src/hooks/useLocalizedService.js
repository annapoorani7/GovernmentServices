import { useEffect, useState } from "react";
import { getCachedTranslation, translateProtectedText } from "../i18n/translationClient.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const SERVICE_CONTENT_FIELDS = [
  "name",
  "description",
  "eligibilitySummary",
  "requiredDocuments",
  "commonUseCases",
  "processingTime",
  "fees",
  "fee",
  "deliveryMode",
  "delivery",
];
const CARD_CONTENT_FIELDS = [
  "name",
  "description",
  "requiredDocuments",
  "processingTime",
  "fees",
  "fee",
  "deliveryMode",
  "delivery",
];

function hasLocalizedValue(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function getCachedValue(value, language) {
  if (Array.isArray(value)) {
    return value.map((item) => getCachedTranslation(item, "en", language) || item);
  }
  if (typeof value === "string") return getCachedTranslation(value, "en", language) || value;
  return value;
}

function getInitialValues(service, language, fields) {
  return Object.fromEntries(
    fields.flatMap((field) => {
      const localizedValue = service?.[`${field}_${language}`];
      if (language !== "en" && hasLocalizedValue(localizedValue)) return [[field, localizedValue]];
      if (language !== "en" && service?.[field] !== undefined) {
        return [[field, getCachedValue(service[field], language)]];
      }
      return [];
    })
  );
}

export default function useLocalizedService(service, fields = SERVICE_CONTENT_FIELDS) {
  const { language } = useLanguage();
  const serviceKey = service?._id || service?.name || "";
  const stateKey = `${serviceKey}:${language}`;
  const [translatedState, setTranslatedState] = useState({ key: "", values: {} });
  const initialValues = getInitialValues(service, language, fields);
  const activeValues = translatedState.key === stateKey ? translatedState.values : initialValues;

  useEffect(() => {
    if (!service || language === "en") return undefined;

    let isActive = true;
    const startingValues = getInitialValues(service, language, fields);
    setTranslatedState({ key: stateKey, values: startingValues });

    const updateField = (field, value, index) => {
      if (!isActive) return;
      setTranslatedState((current) => {
        const values = current.key === stateKey ? current.values : startingValues;
        if (index === undefined) return { key: stateKey, values: { ...values, [field]: value } };
        const translatedArray = [...(values[field] || service[field])];
        translatedArray[index] = value;
        return { key: stateKey, values: { ...values, [field]: translatedArray } };
      });
    };

    for (const field of fields) {
      const localizedValue = service[`${field}_${language}`];
      if (hasLocalizedValue(localizedValue)) continue;

      const sourceValue = service[field];
      if (Array.isArray(sourceValue)) {
        sourceValue.forEach((item, index) => {
          if (typeof item !== "string") return;
          translateProtectedText(item, "en", language)
            .then((value) => updateField(field, value, index))
            .catch(() => {});
        });
      } else if (typeof sourceValue === "string") {
        translateProtectedText(sourceValue, "en", language)
          .then((value) => updateField(field, value))
          .catch(() => {});
      }
    }

    return () => {
      isActive = false;
    };
  }, [service, language, stateKey, fields]);

  if (!service) return null;
  const localizedService = { ...service };
  for (const field of fields) {
    if (activeValues[field] !== undefined) localizedService[field] = activeValues[field];
  }
  return localizedService;
}

export { CARD_CONTENT_FIELDS };