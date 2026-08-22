import { Link } from "react-router-dom";
import ServiceMetadata from "./ServiceMetadata.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export default function ServiceCard({ service }) {
  const { t, localize } = useLanguage();
  if (!service) return null;

  return (
    <article className="card" aria-labelledby={`service-title-${service._id}`}>
      <div className="card-head">
        <h3>
          <Link id={`service-title-${service._id}`} to={`/services/${service._id}`} className="service-title-link">
            {localize(service, "name")}
          </Link>
        </h3>
        {service.category?.name && (
          <span className="badge">{t(`category.${service.category.name}`)}</span>
        )}
      </div>
      <p className="desc">{localize(service, "description")}</p>
      <ServiceMetadata service={service} />
      <div className="card-actions">
        <Link to={`/services/${service._id}`} className="details-link">
          {t("services.details")}
        </Link>
        <a
          className="visit"
          href={service.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          title={t("shield.verifiedLink")}
        >
          {t("services.visitPortal")}
        </a>
      </div>
      <span className="verified-link-tag" title={t("shield.verifiedLink")}>
        <span aria-hidden="true">✓</span> {t("shield.verifiedLink")}
      </span>
    </article>
  );
}
