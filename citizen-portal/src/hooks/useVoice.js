// useVoice.js — Web Speech API hook (dependency-free).
// Provides speech-to-text (dictation) and text-to-speech (read aloud),
// language-aware so it follows the app's current language.
//
// Graceful: if the browser doesn't support the APIs, `supported` is false
// and callers can hide the mic/speaker buttons.

import { useCallback, useEffect, useRef, useState } from "react";

// Map our app language codes → BCP-47 locales the speech engine understands.
const LOCALE = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  bn: "bn-IN",
  te: "te-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "or-IN",
  ur: "ur-IN",
};

export function useVoice(language = "en") {
  const locale = LOCALE[language] || "en-IN";
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const synthSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const supported = Boolean(SpeechRecognition) || synthSupported;

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // ── Speech-to-text ──
  const startListening = useCallback(
    (onResult) => {
      if (!SpeechRecognition) return;
      const rec = new SpeechRecognition();
      rec.lang = locale;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript || "";
        onResult?.(transcript);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recognitionRef.current = rec;
      setListening(true);
      rec.start();
    },
    [SpeechRecognition, locale]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // ── Text-to-speech ──
  const speak = useCallback(
    (text) => {
      if (!synthSupported || !text) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = locale;
      // Prefer a voice matching the locale if one is installed.
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang === locale) ||
        voices.find((v) => v.lang?.startsWith(language));
      if (match) utter.voice = match;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [synthSupported, locale, language]
  );

  const stopSpeaking = useCallback(() => {
    if (synthSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [synthSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort?.();
      if (synthSupported) window.speechSynthesis.cancel();
    };
  }, [synthSupported]);

  return {
    supported,
    sttSupported: Boolean(SpeechRecognition),
    ttsSupported: synthSupported,
    listening,
    speaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}

export default useVoice;
