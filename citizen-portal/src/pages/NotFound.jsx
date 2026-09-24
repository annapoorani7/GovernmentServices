import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="not-found-container">
      <h2>{t("notfound.title")}</h2>
      <p>{t("notfound.message")}</p>
      <Link to="/" className="home-btn">
        {t("notfound.home")}
      </Link>
    </div>
  );
}
