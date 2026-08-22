import { useState } from "react";
import { Link } from "react-router-dom";
import { assistWithAI } from "../api/api.js";
import ServiceMetadata from "../components/services/ServiceMetadata.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useVoice } from "../hooks/useVoice.js";

const STARTER_PROMPT_KEYS = [
  "ai.prompt1",
  "ai.prompt2",
  "ai.prompt3",
  "ai.prompt4",
  "ai.prompt5",
  "ai.prompt6",
];

const createSessionId = () => {
  const stored = window.localStorage.getItem("sahaayak-session-id");
  if (stored) return stored;
  const sessionId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem("sahaayak-session-id", sessionId);
  return sessionId;
};

function RecommendedServices({ services }) {
  const { t } = useLanguage();
  if (!services?.length) return null;
  return (
    <div className="recommendation-block">
      <div className="recommendations-heading">
        <h3>{t("ai.recommendedTitle")}</h3>
        <span>{t("ai.recommendedSubtitle")}</span>
      </div>
      <div className="recommendation-list" aria-label={t("ai.recommendedTitle")}>
        {services.map((service) => (
          <article className="recommendation-card" key={service.id} aria-labelledby={`recommended-service-${service.id}`}>
            <div className="recommendation-card-head">
              <div>
                <span className="recommendation-category">{service.category}</span>
                <h4 id={`recommended-service-${service.id}`}>{service.name}</h4>
              </div>
              <span className="verified-mark">{t("ai.verified")}</span>
            </div>
            <p>{service.description}</p>
            <ServiceMetadata service={service} />
            <p className="recommendation-reason"><strong>{t("ai.whyFits")}</strong> {service.reason}</p>
            <div className="recommendation-actions">
              <Link to={`/services/${service.id}`} className="recommendation-details">{t("ai.viewDetails")}</Link>
              {service.officialLink && (
                <a href={service.officialLink} target="_blank" rel="noopener noreferrer" className="recommendation-official">
                  {t("ai.officialPortal")}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]} ↗</a>;
    }
    return <span key={index}>{part}</span>;
  });
}

function FormattedAnswer({ text }) {
  return (
    <div className="formatted-answer">
      {String(text || "").split("\n").map((line, index) => {
        const heading = line.match(/^#{1,3}\s+(.+)/);
        const numbered = line.match(/^\s*(\d+)\.\s+(.+)/);
        const bullet = line.match(/^\s*[-*]\s+(.+)/);
        if (heading) return <h4 key={index}>{renderInline(heading[1])}</h4>;
        if (numbered) return <div className="formatted-list-item" key={index}><b>{numbered[1]}.</b> {renderInline(numbered[2])}</div>;
        if (bullet) return <div className="formatted-list-item" key={index}><b aria-hidden="true">•</b> {renderInline(bullet[1])}</div>;
        return <p key={index}>{line ? renderInline(line) : "\u00a0"}</p>;
      })}
    </div>
  );
}

function AssistantMessage({ response, onSuggestion, onSpeak, speaking }) {
  const { t } = useLanguage();
  return (
    <div className="assistant-message-body">
      <div className="assistant-answer-row">
        <FormattedAnswer text={response.answer} />
        {onSpeak && (
          <button
            type="button"
            className={speaking ? "speak-btn speak-btn--on" : "speak-btn"}
            onClick={() => onSpeak(response.answer)}
            aria-label={speaking ? t("voice.stopReading") : t("voice.readAloud")}
            title={speaking ? t("voice.stopReading") : t("voice.readAloud")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
            </svg>
          </button>
        )}
      </div>
      {response.followUpSuggestions?.length > 0 && (
        <div className="follow-up-suggestions">
          {response.followUpSuggestions.map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => onSuggestion(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <RecommendedServices services={response.recommendedServices} />
    </div>
  );
}

export default function AIAssistant() {
  const { t, language } = useLanguage();
  const { sttSupported, ttsSupported, listening, speaking, startListening, stopListening, speak, stopSpeaking } = useVoice(language);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId] = useState(createSessionId);

  const toggleMic = () => {
    if (listening) stopListening();
    else startListening((transcript) => setMessage(transcript));
  };

  const handleSpeak = (text) => {
    if (speaking) stopSpeaking();
    else speak(text);
  };

  const sendMessage = async (event, prompt = message) => {
    event?.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await assistWithAI(trimmed, sessionId);
      setMessages((current) => [...current, { role: "assistant", response }]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || t("ai.unavailable"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <section className="ai-intro" aria-labelledby="ai-heading">
        <span className="ai-eyebrow">{t("ai.eyebrow")}</span>
        <h1 id="ai-heading">{t("ai.heading")}</h1>
        <p>{t("ai.subheading")}</p>
        <span className="ai-intro-note">{t("ai.introNote")}</span>
      </section>

      <section className="assistant-shell" aria-label="Sahaayak AI conversation">
        <div className="chat-toolbar">
          <div className="assistant-identity">
            <span className="assistant-avatar" aria-hidden="true">S</span>
            <span><strong>Sahaayak AI</strong><small>{t("ai.grounded")}</small></span>
          </div>
          <span className="grounded-pill">{t("ai.directoryGrounded")}</span>
        </div>

        <div className="chat-history" aria-live="polite" aria-atomic="false">
          {messages.length === 0 && (
            <div className="welcome-message">
              <span className="welcome-mark" aria-hidden="true">S</span>
              <div>
                <h2>{t("ai.welcomeTitle")}</h2>
                <p>{t("ai.welcomeBody")}</p>
                <div className="starter-prompts" aria-label="Suggested questions">
                  {STARTER_PROMPT_KEYS.map((key) => (
                    <button key={key} type="button" onClick={() => setMessage(t(key))} disabled={loading}>{t(key)}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((item, index) => (
            <div className={`chat-message chat-message-${item.role}`} key={`${item.role}-${index}`}>
              {item.role === "assistant" && <span className="message-avatar" aria-hidden="true">S</span>}
              <div className="message-content">
                <span className="message-label">{item.role === "user" ? t("ai.you") : "Sahaayak AI"}</span>
                {item.role === "user" ? <p>{item.content}</p> : <AssistantMessage response={item.response} onSuggestion={setMessage} onSpeak={ttsSupported ? handleSpeak : null} speaking={speaking} />}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message chat-message-assistant" role="status" aria-label={t("ai.thinking")}>
              <span className="message-avatar" aria-hidden="true">S</span>
              <div className="message-content">
                <span className="message-label">Sahaayak AI</span>
                <p className="thinking">{t("ai.thinking")} <span className="thinking-dots" aria-hidden="true"><i /> <i /> <i /></span></p>
              </div>
            </div>
          )}
        </div>

        {error && <div className="ai-error" role="alert" aria-live="assertive">{error}</div>}

        <form className="chat-input-area" onSubmit={sendMessage}>
          <label htmlFor="assistant-message" className="visually-hidden">{t("ai.inputPlaceholder")}</label>
          <textarea id="assistant-message" value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(event); } }} placeholder={t("ai.inputPlaceholder")} aria-label="Message for Sahaayak AI" rows="2" maxLength="1000" disabled={loading} />
          {sttSupported && (
            <button
              type="button"
              className={listening ? "chat-mic chat-mic--on" : "chat-mic"}
              onClick={toggleMic}
              aria-label={listening ? t("voice.stop") : t("voice.speak")}
              aria-pressed={listening}
              disabled={loading}
              title={listening ? t("voice.listening") : t("voice.speak")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </button>
          )}
          <button type="submit" className="assistant-send" aria-label={loading ? t("ai.thinking") : t("ai.send")} disabled={loading || !message.trim()}>{loading ? t("ai.thinkingBtn") : t("ai.send")}</button>
        </form>
      </section>
    </div>
  );
}
