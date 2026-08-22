import { useState, useEffect } from "react";
import { getServices } from "../api/api";
import { expandQuery } from "../utils/searchSynonyms.js";

export function useServices({ initialCategory = null, initialSearch = "", limit = 10 } = {}) {
  const [services, setServices] = useState([]);
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectCat = (catId) => {
    setSelectedCat(catId);
    setPage(1);
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      getServices({ category: selectedCat, search: expandQuery(search), page, limit })
        .then((res) => {
          if (res && res.data) {
            setServices(res.data);
            if (res.pagination) {
              setPagination(res.pagination);
            }
          } else if (Array.isArray(res)) {
            setServices(res);
          }
        })
        .catch((err) => setError(err.message || "Failed to load services"))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCat, search, page, limit]);

  return {
    services,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch: handleSearchChange,
    selectedCat,
    setSelectedCat: handleSelectCat,
    pagination,
  };
}

export default useServices;
