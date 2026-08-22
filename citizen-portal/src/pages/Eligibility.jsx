import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUIZ, tagsToQuery } from "../data/eligibilityQuestions.js";
import { getServices } from "../api/api.js";
import ServiceCard from "../components/services/ServiceCard.jsx";
import Loading from "../components/common/Loading.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export default function Eligibility() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]); // array of selected option objects
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = QUIZ.length;
  const isResult = step >= total;
  const progress = Math.round((Math.min(step, total) / total) * 100);

  const pick = (option) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
    if (step + 1 >= total) {
      runMatch(next);
      setStep(total);
    } else {
      setStep(step + 1);
    }
  };

  const back = () => step > 0 && setStep(step - 1);

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setResults(null);
  };

  async function runMatch(selected) {
    setLoading(true);
    try {
      const query = tagsToQuery(selected);
      const res = await getServices({ search: query, limit: 8 });
      setResults(res?.data || (Array.isArray(res) ? res : []));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <h1>{t("quiz.title")}</h1>
        <p>{t("quiz.subtitle")}</p>
      </header>

      {!isResult && (
        <div className="quiz-card">
          <div className="quiz-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="quiz-step-count">{t("quiz.stepOf", { step: step + 1, total })}</span>

          <h2 className="quiz-question">{t(QUIZ[step].tKey)}</h2>

          <div className="quiz-options">
            {QUIZ[step].options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={answers[step]?.id === opt.id ? "quiz-option quiz-option--active" : "quiz-option"}
                onClick={() => pick(opt)}
              >
                {t(opt.tKey)}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button type="button" className="quiz-back" onClick={back}>
              {t("quiz.back")}
            </button>
          )}
        </div>
      )}

      {isResult && (
        <div className="quiz-results">
          <div className="quiz-results-head">
            <h2>{t("quiz.resultsTitle")}</h2>
            <p className="quiz-disclaimer">{t("quiz.disclaimer")}</p>
            <button type="button" className="quiz-restart" onClick={restart}>
              {t("quiz.restart")}
            </button>
          </div>

          {loading ? (
            <Loading count={4} />
          ) : results && results.length > 0 ? (
            <div className="grid">
              {results.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
          ) : (
            <div className="empty">
              <h3>{t("quiz.noResults")}</h3>
              <button type="button" className="quiz-restart" onClick={() => navigate("/services")}>
                {t("quiz.browseAll")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
