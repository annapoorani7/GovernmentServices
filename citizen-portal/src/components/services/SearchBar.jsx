import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useVoice } from "../../hooks/useVoice.js";

export default function SearchBar({ id = "service-search", value, onChange, onVoiceResult }) {
  const { t, language } = useLanguage();
  const { sttSupported, listening, startListening, stopListening } = useVoice(language);

  const toggleMic = () => {
    if (listening) {
      stopListening();
    } else {
      startListening((transcript) => {
        onChange(transcript);
        // Fire the optional callback so callers (e.g. the hero) can auto-search
        // as soon as speech completes, instead of requiring a manual submit.
        if (transcript && transcript.trim()) onVoiceResult?.(transcript.trim());
      });
    }
  };

  return (
    <div className="search" role="search">
      <span className="search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </span>
      <input
        id={id}
        type="text"
        aria-label={t("home.searchAria")}
        placeholder={t("home.searchPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="clear" onClick={() => onChange("")} aria-label={t("voice.clear")}>
          ✕
        </button>
      )}
      {sttSupported && (
        <button
          type="button"
          className={listening ? "mic-btn mic-btn--on" : "mic-btn"}
          onClick={toggleMic}
          aria-label={listening ? t("voice.stop") : t("voice.speak")}
          aria-pressed={listening}
          title={listening ? t("voice.listening") : t("voice.speak")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>
      )}
    </div>
  );
}
