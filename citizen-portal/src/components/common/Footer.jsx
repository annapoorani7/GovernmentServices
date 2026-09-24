import { Link } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/ai-assistant", label: t("nav.ai") },
  ];

  const popular = [
    { to: "/services?search=aadhaar", label: "Aadhaar" },
    { to: "/services?search=passport", label: "Passport" },
    { to: "/services?search=pan", label: "PAN" },
    { to: "/services?search=epf", label: "EPFO" },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand column */}
        <div className="footer-brand">
          <div className="footer-brand-top">
            <span className="footer-flag" aria-hidden="true">🇮🇳</span>
            <span className="footer-name">Sahaayak AI</span>
          </div>
          <p className="footer-desc">{t("footer.about")}</p>
          <span className="footer-verified" aria-hidden="true">
            ✓ {t("footer.verifiedBadge")}
          </span>
        </div>

        {/* Quick links */}
        <nav className="footer-col" aria-label={t("footer.quickLinks")}>
          <h4>{t("footer.quickLinks")}</h4>
          <ul>
            {quickLinks.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        {/* Popular services */}
        <nav className="footer-col" aria-label={t("footer.popularServices")}>
          <h4>{t("footer.popularServices")}</h4>
          <ul>
            {popular.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        {/* Resources */}
        <nav className="footer-col" aria-label={t("footer.resources")}>
          <h4>{t("footer.resources")}</h4>
          <ul>
            <li><a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer">India.gov.in ↗</a></li>
            <li><a href="https://www.mygov.in/" target="_blank" rel="noopener noreferrer">MyGov ↗</a></li>
            <li><a href="https://digilocker.gov.in/" target="_blank" rel="noopener noreferrer">DigiLocker ↗</a></li>
          </ul>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {year} Sahaayak AI</span>
        <span className="footer-note">{t("footer.disclaimer")}</span>
      </div>
    </footer>
  );
}
