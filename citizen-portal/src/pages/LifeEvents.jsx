import { useState } from "react";
import { LIFE_EVENTS } from "../data/lifeEvents.js";
import { getServices } from "../api/api.js";
import ServiceCard from "../components/services/ServiceCard.jsx";
import Loading from "../components/common/Loading.jsx";
import LifeEventIcon from "../components/common/LifeEventIcon.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function LifeEvents() {
  const { t } = useLanguage();
  const [active, setActive] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const openEvent = async (event) => {
    setActive(event.id);
    setLoading(true);
    try {
      const res = await getServices({ search: event.tags.join(" "), limit: 8 });
      setResults(res?.data || (Array.isArray(res) ? res : []));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const activeEvent = LIFE_EVENTS.find((e) => e.id === active);

  return (
    <div className="life-page">
      <header className="life-header">
        <h1>{t("life.title")}</h1>
        <p>{t("life.subtitle")}</p>
      </header>

      <div className="life-grid">
        {LIFE_EVENTS.map((event) => (
          <button
            key={event.id}
            type="button"
            className={active === event.id ? "life-card life-card--active" : "life-card"}
            onClick={() => openEvent(event)}
            aria-pressed={active === event.id}
          >
            <span className="life-icon" aria-hidden="true">
              <LifeEventIcon eventId={event.id} />
            </span>
            <span className="life-label">{t(event.tKey)}</span>
          </button>
        ))}
      </div>

      {active && (
        <section className="life-results" aria-live="polite">
          <div className="life-results-head">
            <h2>
              <span className="results-icon" aria-hidden="true">
                <LifeEventIcon eventId={activeEvent?.id} />
              </span>
              {t(activeEvent?.tKey)}
            </h2>
            <p className="quiz-disclaimer">{t("life.resultsNote")}</p>
          </div>
          {loading ? (
            <Loading count={4} />
          ) : results.length > 0 ? (
            <div className="grid">
              {results.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
          ) : (
            <div className="empty"><h3>{t("quiz.noResults")}</h3></div>
          )}
        </section>
      )}
    </div>
  );
}
