import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function CategoryIcon({ name }) {
  const c = name?.toLowerCase() || "";

  const iconPath =
    c.includes("identity")
      ? <><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="10" cy="10" r="2" /><path d="M7 16c.8-1.8 5.2-1.8 6 0M15 9h3M15 12h3M15 15h2" /></>
    : c.includes("travel")
      ? <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2 2.2 3 4.9 3 8s-1 5.8-3 8c-2-2.2-3-4.9-3-8s1-5.8 3-8Z" /><path d="m8 12 2-1 4 1-4 1-2-1Z" /></>
    : c.includes("transport")
      ? <><path d="M5 16h14l-1-6a2 2 0 0 0-2-1H8a2 2 0 0 0-2 1l-1 6Z" /><path d="M4 16v2h2v-2M18 16v2h2v-2M7 13h10" /><circle cx="8" cy="13" r="1" /><circle cx="16" cy="13" r="1" /></>
    : c.includes("finance")
      ? <><path d="M4 7h14a2 2 0 0 1 2 2v8H6a2 2 0 0 1-2-2V7Z" /><path d="M4 9V7a2 2 0 0 1 2-2h11v2" /><path d="M16 12h4v3h-4a1.5 1.5 0 0 1 0-3Z" /></>
    : c.includes("land") || c.includes("property")
      ? <><path d="m3 11 9-7 9 7" /><path d="M5 10v9h14v-9M9 19v-5h6v5" /></>
    : c.includes("employ")
      // briefcase
      ? <><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></>
    : c.includes("health")
      // heart + pulse
      ? <><path d="M12 20s-7-4.3-9.3-8.2C1 8.5 2.6 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.4 0 5 3.5 3.3 6.8C19 15.7 12 20 12 20Z" /><path d="M6 12h2.5l1.5-2.5 2 4L15 12h3" /></>
    : c.includes("education")
      // graduation cap
      ? <><path d="M12 4 2 9l10 5 10-5-10-5Z" /><path d="M6 11v4c0 1.3 2.7 2.5 6 2.5s6-1.2 6-2.5v-4M22 9v5" /></>
    : c.includes("ration") || c.includes("welfare")
      // hands holding / basket
      ? <><path d="M4 10h16l-1.5 8a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 10Z" /><path d="M8 10 10 4M16 10 14 4M4 10h16" /></>
    : c.includes("grievance")
      // speech bubble with exclamation
      ? <><path d="M20 4H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3v4l5-4h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z" /><path d="M12 8v3M12 13.5v.5" /></>
    // fallback: generic document
    : <><path d="M6 3h9l3 3v15H6z" /><path d="M15 3v4h4M9 12h6M9 16h6" /></>;

  return (
    <svg className="category-card-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPath}
    </svg>
  );
}

export default function CategoryCard({ category, onClick }) {
  const { t } = useLanguage();
  if (!category) return null;

  const localizedName = t(`category.${category.name}`);

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick(category._id);
    }
  };

  return (
    <div
      className="category-card"
      onClick={() => onClick && onClick(category._id)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={t("home.browseAria", { name: localizedName })}
    >
      <div className="category-card-icon" aria-hidden="true">
        {/* Replace folder emoji data with a domain-specific, scalable SVG anchor. */}
        <CategoryIcon name={category.name} />
      </div>
      <h3 className="category-card-title">{localizedName}</h3>
      <Link
        to={`/services?category=${category._id}`}
        className="category-card-link"
        tabIndex={-1}
        aria-hidden="true"
      >
        {t("home.exploreServices")}
      </Link>
    </div>
  );
}
