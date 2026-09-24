import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getServiceById } from "../api/api.js";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import DocumentReadinessWizard from "../components/services/DocumentReadinessWizard.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, localize } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getServiceById(id)
      .then((data) => setService(data))
      .catch((err) => setError(err.message || "Failed to load service details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="details-container">
        <div className="card skeleton" style={{ height: "300px" }} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="details-container">
        <button onClick={() => navigate("/services")} className="back-btn">
          {t("details.backToServices")}
        </button>
        <ErrorMessage message={error || t("details.notFound")} />
      </div>
    );
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        {t("details.back")}
      </button>

      <article className="details-card">
        <div className="details-header">
          <h2>{localize(service, "name")}</h2>
          {service.category?.name && (
            <span className="badge large-badge">{t(`category.${service.category.name}`)}</span>
          )}
        </div>

        <p className="details-desc">{localize(service, "description")}</p>

        {localize(service, "eligibilitySummary") && (
          <section className="details-info-section">
            <h4>{t("details.eligibility")}</h4>
            <p>{localize(service, "eligibilitySummary")}</p>
          </section>
        )}

        {(localize(service, "requiredDocuments")?.length > 0 || localize(service, "commonUseCases")?.length > 0) && (
          <div className="details-info-grid">
            {localize(service, "requiredDocuments")?.length > 0 && (
              <section className="details-info-section">
                <h4>{t("details.commonlyRequired")}</h4>
                <ul>
                  {localize(service, "requiredDocuments").map((document) => <li key={document}>{document}</li>)}
                </ul>
              </section>
            )}
            {localize(service, "commonUseCases")?.length > 0 && (
              <section className="details-info-section">
                <h4>{t("details.useCases")}</h4>
                <ul>
                  {localize(service, "commonUseCases").map((useCase) => <li key={useCase}>{useCase}</li>)}
                </ul>
              </section>
            )}
          </div>
        )}

        <DocumentReadinessWizard
          serviceId={service._id || id}
          documents={localize(service, "requiredDocuments") || []}
          officialLink={service.officialLink}
        />

        <div className="details-actions">
          <a
            href={service.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-large"
          >
            {t("details.accessPortal")} ({service.officialLink}) ↗
          </a>
          <Link to={`/services?category=${service.category?._id || ""}`} className="related-link">
            {t("details.exploreMore")} {service.category?.name ? t(`category.${service.category.name}`) : "Category"} →
          </Link>
        </div>
      </article>
    </div>
  );
}
