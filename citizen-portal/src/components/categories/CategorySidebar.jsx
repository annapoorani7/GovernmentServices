import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function CategorySidebar({ categories, selected, onSelect }) {
  const { t } = useLanguage();
  return (
    <aside className="sidebar">
      <h3>{t("services.categories")}</h3>
      <ul>
        <li>
          <button
            className={selected === null ? "active" : ""}
            onClick={() => onSelect(null)}
          >
            {t("services.allServices")}
          </button>
        </li>
        {categories.map((c) => (
          <li key={c._id}>
            <button
              className={selected === c._id ? "active" : ""}
              onClick={() => onSelect(c._id)}
            >
              {t(`category.${c.name}`)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
