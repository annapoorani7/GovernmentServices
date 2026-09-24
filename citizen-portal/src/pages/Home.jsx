import { Link, useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories.js";
import CategoryCard from "../components/categories/CategoryCard.jsx";
import SearchBar from "../components/services/SearchBar.jsx";
import AshokaChakra from "../components/common/AshokaChakra.jsx";
import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Home() {
  const { categories, loading, error } = useCategories();
  const [heroSearch, setHeroSearch] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/services?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/services");
    }
  };

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero-section" aria-labelledby="hero-heading">
        <AshokaChakra className="hero-chakra hero-chakra--right" />
        <AshokaChakra className="hero-chakra hero-chakra--left" />
        <div className="hero-content">
          <span className="hero-badge" aria-label={t("home.badge")}>
            🇮🇳 {t("home.badge")}
          </span>

          <h1 id="hero-heading" className="hero-heading">
            Sahaayak AI
          </h1>

          <p className="hero-description">
            {t("home.description")}
          </p>

          <form
            className="hero-search-form"
            onSubmit={handleHeroSearchSubmit}
            role="search"
            aria-label={t("home.searchAria")}
          >
            <label htmlFor="hero-search-input" className="visually-hidden">
              {t("home.searchAria")}
            </label>
            <SearchBar
              id="hero-search-input"
              value={heroSearch}
              onChange={setHeroSearch}
              onVoiceResult={(text) => navigate(`/services?search=${encodeURIComponent(text)}`)}
            />
            <button type="submit" className="hero-search-btn">
              {t("home.searchButton")}
            </button>
          </form>

          <Link to="/ai-assistant" className="home-ai-cta">
            {t("home.askAi")} <span aria-hidden="true">→</span>
          </Link>

          <div className="quick-tags" aria-label="Popular searches">
            <span className="quick-tags-label">{t("home.popular")}</span>
            <Link to="/services?search=aadhaar" className="quick-tag">Aadhaar</Link>
            <Link to="/services?search=pan" className="quick-tag">PAN</Link>
            <Link to="/services?search=passport" className="quick-tag">Passport</Link>
            <Link to="/services?search=epf" className="quick-tag">EPFO</Link>
            <Link to="/services?search=gst" className="quick-tag">GST</Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="categories-section" aria-labelledby="categories-heading">
        <div className="categories-container">
          <div className="section-head">
            <div className="section-head-text">
              <h2 id="categories-heading" className="section-title">
                {t("home.browseTitle")}
              </h2>
              <p className="section-subtitle">
                {t("home.browseSubtitle")}
              </p>
            </div>
            <Link to="/services" className="see-all-link">
              {t("home.viewAll")}
            </Link>
          </div>

          {error && (
            <div className="error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="category-grid" aria-busy="true" aria-label="Loading categories">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="category-card skeleton" aria-hidden="true" />
              ))}
            </div>
          ) : (
            <div className="category-grid">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat._id}
                  category={cat}
                  onClick={(catId) => navigate(`/services?category=${catId}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
