import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const STORAGE_PREFIX = "sahaayak.readiness.";

/**
 * DocumentReadinessWizard
 * Interactive checklist that turns a service's `requiredDocuments` into an
 * actionable "am I ready to apply?" flow. Progress is persisted per-service
 * in localStorage so citizens can return later without losing their place.
 */
export default function DocumentReadinessWizard({ serviceId, documents = [], officialLink }) {
  const { t } = useLanguage();
  const storageKey = `${STORAGE_PREFIX}${serviceId}`;

  const [checked, setChecked] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(window.localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  });

  // Persist whenever the checklist changes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    }
  }, [checked, storageKey]);

  const total = documents.length;
  const doneCount = useMemo(
    () => documents.filter((doc) => checked[doc]).length,
    [documents, checked]
  );
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const remaining = documents.filter((doc) => !checked[doc]);

  const toggle = (doc) =>
    setChecked((prev) => ({ ...prev, [doc]: !prev[doc] }));
  const reset = () => setChecked({});
  const markAll = () =>
    setChecked(Object.fromEntries(documents.map((doc) => [doc, true])));

  // No documents on record — graceful, honest fallback.
  if (total === 0) {
    return (
      <section className="wizard" aria-label={t("wizard.title")}>
        <h4 className="wizard-title">{t("wizard.title")}</h4>
        <p className="wizard-empty">{t("wizard.noDocs")}</p>
      </section>
    );
  }

  const status =
    doneCount === total ? "ready" : doneCount >= Math.ceil(total * 0.6) ? "almost" : "start";
  const statusCopy = {
    ready: ["wizard.statusReady.title", "wizard.statusReady.body"],
    almost: ["wizard.statusAlmost.title", "wizard.statusAlmost.body"],
    start: ["wizard.statusStart.title", "wizard.statusStart.body"],
  }[status];

  return (
    <section className="wizard" aria-label={t("wizard.title")}>
      <div className="wizard-head">
        <div>
          <h4 className="wizard-title">{t("wizard.title")}</h4>
          <p className="wizard-subtitle">{t("wizard.subtitle")}</p>
        </div>
        <span className={`wizard-badge wizard-badge--${status}`}>
          {t("wizard.progress", { done: doneCount, total })}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="wizard-progress"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("wizard.progress", { done: doneCount, total })}
      >
        <div className={`wizard-progress-fill wizard-progress-fill--${status}`} style={{ width: `${percent}%` }} />
      </div>

      {/* Status banner */}
      <div className={`wizard-status wizard-status--${status}`}>
        <strong>{t(statusCopy[0])}</strong>
        <span>{t(statusCopy[1])}</span>
      </div>

      {/* Checklist */}
      <ul className="wizard-list">
        {documents.map((doc) => (
          <li key={doc} className={checked[doc] ? "wizard-item wizard-item--done" : "wizard-item"}>
            <label className="wizard-check">
              <input
                type="checkbox"
                checked={!!checked[doc]}
                onChange={() => toggle(doc)}
                aria-label={doc}
              />
              <span className="wizard-checkbox" aria-hidden="true" />
              <span className="wizard-doc">{doc}</span>
            </label>
          </li>
        ))}
      </ul>

      {/* Remaining summary */}
      {remaining.length > 0 && (
        <div className="wizard-remaining">
          <span className="wizard-remaining-label">{t("wizard.stillNeed")}:</span>
          <span className="wizard-remaining-items">{remaining.join(", ")}</span>
        </div>
      )}

      {/* Actions */}
      <div className="wizard-actions">
        <button type="button" className="wizard-btn wizard-btn--ghost" onClick={reset}>
          {t("wizard.reset")}
        </button>
        {doneCount < total && (
          <button type="button" className="wizard-btn wizard-btn--ghost" onClick={markAll}>
            {t("wizard.markAll")}
          </button>
        )}
        {status === "ready" && officialLink && (
          <a
            href={officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="wizard-btn wizard-btn--primary"
          >
            {t("wizard.proceed")}
          </a>
        )}
      </div>

      <p className="wizard-saved-note">{t("wizard.savedNote")}</p>
    </section>
  );
}
