import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function Pagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
  loading = false,
}) {
  const { t } = useLanguage();
  if (loading || totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={!hasPreviousPage || page <= 1 || loading}
      >
        {t("services.previous")}
      </button>
      <span className="pagination-info">
        {t("services.pageInfo", { page, total: totalPages })}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={!hasNextPage || page >= totalPages || loading}
      >
        {t("services.next")}
      </button>
    </div>
  );
}
