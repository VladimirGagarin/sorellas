// components/LoadingOverlay.jsx — brief loading veil on every page change:
// cycles FIORI DI PREGHIERA → WELCOME/BENVENUTI → AETERNUM FLOREAMUS →
// DEO GRATIAS with a right-to-left wipe, over five blinking boxes.
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/useLanguage.js";
import "./LoadingOverlay.css";

const WORD_DURATION = 3000;
const TOTAL_WORDS = 4;
const TOTAL_MS = WORD_DURATION * TOTAL_WORDS + 600;

export default function LoadingOverlay() {
  const location = useLocation();
  const { language } = useLanguage();
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);
  const playingRef = useRef(false);
  const timerRef = useRef(null);

  const stop = () => {
    playingRef.current = false;
    setShow(false);
  };

  const play = () => {
    if (playingRef.current) return;
    playingRef.current = true;
    clearTimeout(timerRef.current);
    setPhase(0);
    setShow(true);
    timerRef.current = setTimeout(stop, TOTAL_MS);
  };

  useEffect(() => {
    play();
    return () => clearTimeout(timerRef.current);
  }, [location.key]);

  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => {
      setPhase((p) => (p + 1) % TOTAL_WORDS);
    }, WORD_DURATION);
    return () => clearInterval(id);
  }, [show]);

  if (!show) return null;

  const words = [
    "FIORI DI PREGHIERA",
    language === "en" ? "WELCOME" : "BENVENUTI",
    "AETERNUM FLOREAMUS",
    "DEO GRATIAS",
  ];

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <p className="loading-eyebrow">
        {language === "en" ? "The garden is opening…" : "Il giardino si apre…"}
      </p>
      <h1 className="loading-word" key={phase}>
        {words[phase]}
      </h1>
      <div className="loading-boxes" aria-hidden="true">
        <span className="loading-box" />
        <span className="loading-box" />
        <span className="loading-box" />
        <span className="loading-box" />
        <span className="loading-box" />
      </div>
    </div>
  );
}