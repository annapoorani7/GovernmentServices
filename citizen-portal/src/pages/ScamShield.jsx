import { useState } from "react";
import { checkLink, SAFETY_TIP_KEYS } from "../utils/scamShield.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";

const STATUS_META = {
  verified: { icon: "✓", cls: "shield-result--verified", tKey: "shield.verified" },
  gov: { icon: "✓", cls: "shield-result--gov", tKey: "shield.gov" },
  suspicious: { icon: "⚠", cls: "shield-result--suspicious", tKey: "shield.suspicious" },
  unknown: { icon: "?", cls: "shield-result--unknown", tKey: "shield.unknown" },
  invalid: { icon: "✕", cls: "shield-result--unknown", tKey: "shield.invalid" },
};

const REASON_KEYS = {
  knownOfficial: "shield.r.knownOfficial",
  govPattern: "shield.r.govPattern",
  shortener: "shield.r.shortener",
  impersonation: "shield.r.impersonation",
  ipAddress: "shield.r.ipAddress",
  manySubdomains: "shield.r.manySubdomains",
  baitWord: "shield.r.baitWord",
};

export default function ScamShield() {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const runCheck = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setResult(checkLink(input));
  };

  const meta = result ? STATUS_META[result.status] : null;

  return (
    <div className="shield-page">
      <header className="shield-header">
        <span className="shield-emblem" aria-hidden="true">🛡️</span>
        <h1>{t("shield.title")}</h1>
        <p>{t("shield.subtitle")}</p>
      </header>

      <form className="shield-form" onSubmit={runCheck} role="search">
        <label htmlFor="shield-input" className="visually-hidden">{t("shield.placeholder")}</label>
        <input
          id="shield-input"
          type="text"
          inputMode="url"
          placeholder={t("shield.placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="shield-check-btn">{t("shield.checkBtn")}</button>
      </form>

      {result && meta && (
        <div className={`shield-result ${meta.cls}`} role="status" aria-live="polite">
          <div className="shield-result-head">
            <span className="shield-result-icon" aria-hidden="true">{meta.icon}</span>
            <div>
              <strong>{t(meta.tKey)}</strong>
              {result.host && <span className="shield-host">{result.host}</span>}
            </div>
          </div>
          {result.reasons.length > 0 && (
            <ul className="shield-reasons">
              {result.reasons.map((r) => REASON_KEYS[r] && <li key={r}>{t(REASON_KEYS[r])}</li>)}
            </ul>
          )}
          <p className="shield-caveat">{t("shield.caveat")}</p>
        </div>
      )}

      <section className="shield-tips" aria-label={t("shield.tipsTitle")}>
        <h2>{t("shield.tipsTitle")}</h2>
        <ul>
          {SAFETY_TIP_KEYS.map((k) => (
            <li key={k}><span aria-hidden="true">🔒</span> {t(k)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
