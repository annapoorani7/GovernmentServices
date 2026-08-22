import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function Loading({ count = 6, message }) {
  const { t } = useLanguage();
  const label = message ?? t("services.loadingServices");
  return (
    <div className="loading-container" role="status" aria-busy="true" aria-live="polite">
      <div className="grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card skeleton" />
        ))}
      </div>
      {label && <p className="loading-text">{label}</p>}
    </div>
  );
}
