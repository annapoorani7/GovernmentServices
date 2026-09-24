import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useServices from "../hooks/useServices.js";
import useCategories from "../hooks/useCategories.js";
import SearchBar from "../components/services/SearchBar.jsx";
import CategorySidebar from "../components/categories/CategorySidebar.jsx";
import ServiceList from "../components/services/ServiceList.jsx";
import Pagination from "../components/services/Pagination.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || null;
  const initialSearch = searchParams.get("search") || "";
  const { t } = useLanguage();

  const { categories } = useCategories();
  const {
    services,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    selectedCat,
    setSelectedCat,
    pagination,
  } = useServices({ initialCategory, initialSearch });

  // Sync URL search params when filters change
  useEffect(() => {
    const params = {};
    if (selectedCat) params.category = selectedCat;
    if (search) params.search = search;
    setSearchParams(params, { replace: true });
  }, [selectedCat, search, setSearchParams]);

  const selectedCatName = useMemo(() => {
    const cat = categories.find((c) => c._id === selectedCat);
    return cat ? t(`category.${cat.name}`) : t("services.allServices");
  }, [categories, selectedCat, t]);

  const total = pagination.total || services.length;

  return (
    <div className="services-page">
      <div className="services-header">
        <h2>{t("services.title")}</h2>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="layout">
        <CategorySidebar
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
        />

        <main className="content">
          <div className="content-head">
            <h2>{selectedCatName}</h2>
            <span className="count">
              {loading
                ? t("services.loading")
                : t(total === 1 ? "services.count" : "services.countPlural", { count: total })}
            </span>
          </div>

          <ErrorMessage message={error} />

          <ServiceList services={services} loading={loading} />

          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            hasPreviousPage={pagination.hasPreviousPage}
            hasNextPage={pagination.hasNextPage}
            onPageChange={setPage}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
}
