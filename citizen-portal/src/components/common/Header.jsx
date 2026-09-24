import { NavLink } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function Header() {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <header className="header">
      <div className="header-inner">
        {/* ── Brand ── */}
        <div className="brand">
          <NavLink to="/" className="brand-logo" aria-label="Sahaayak AI — Go to homepage">
            <span className="flag" aria-hidden="true">🇮🇳</span>
          </NavLink>
          <div className="brand-text">
            <NavLink to="/" className="brand-title-link">
              <span className="brand-name">Sahaayak AI</span>
            </NavLink>
            <span className="brand-tagline">
              {t("brand.tagline")}
            </span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="nav-menu" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
            aria-current={undefined}
          >
            {({ isActive }) => (
              <>
                <span>{t("nav.home")}</span>
                {isActive && <span className="visually-hidden"> (current page)</span>}
              </>
            )}
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
          >
            {({ isActive }) => (
              <>
                <span>{t("nav.services")}</span>
                {isActive && <span className="visually-hidden"> (current page)</span>}
              </>
            )}
          </NavLink>
          <NavLink
            to="/eligibility"
            className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
          >
            {({ isActive }) => (
              <>
                <span>{t("nav.eligibility")}</span>
                {isActive && <span className="visually-hidden"> (current page)</span>}
              </>
            )}
          </NavLink>
          <NavLink
            to="/life-events"
            className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
          >
            {({ isActive }) => (
              <>
                <span>{t("nav.lifeEvents")}</span>
                {isActive && <span className="visually-hidden"> (current page)</span>}
              </>
            )}
          </NavLink>
          <NavLink
            to="/scam-shield"
            className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
          >
            {({ isActive }) => (
              <>
                <span>{t("nav.shield")}</span>
                {isActive && <span className="visually-hidden"> (current page)</span>}
              </>
            )}
          </NavLink>
          <NavLink
            to="/ai-assistant"
            className={({ isActive }) => (isActive ? "nav-link nav-link--active nav-link--ai" : "nav-link nav-link--ai")}
          >
            {({ isActive }) => (
              <>
                <span>{t("nav.ai")}</span>
                {isActive && <span className="visually-hidden"> (current page)</span>}
              </>
            )}
          </NavLink>
        </nav>

        <div className="language-switcher">
          <label htmlFor="language-select">{t("lang.label")}</label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label={t("lang.label")}
          >
            {languages.map((lng) => (
              <option key={lng.code} value={lng.code}>
                {lng.nativeLabel}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
