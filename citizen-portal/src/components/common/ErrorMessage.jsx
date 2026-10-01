import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function ErrorMessage({ message }) {
  const { t } = useLanguage();
  if (!message) return null;
  const defaultMessage = t("error.generic");
  const genericError = typeof message === "string" && /^(failed to load|request failed|unable to load|network error)/i.test(message);
  const displayMessage = genericError ? defaultMessage : message;
  return <div className="error" role="alert">⚠️ {displayMessage}</div>;
}
