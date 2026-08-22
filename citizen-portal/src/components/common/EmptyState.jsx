import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function EmptyState({ title, message }) {
  const { t } = useLanguage();
  return (
    <div className="empty">
      <h3>{title || t("empty.title")}</h3>
      <p>{message || t("empty.message")}</p>
    </div>
  );
}
