// components/LoadingOverlay.jsx — brief loading veil on every page change:
// cycles FIORI DI PREGHIERA → WELCOME/BENVENUTI → AETERNUM FLOREAMUS →
// DEO GRATIAS with a right-to-left wipe, over five blinking boxes.
import { useEffect, useState } from "react";
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

  // Every navigation (or first mount) plays the full cycle; any previous
  // cycle is cancelled so a single timer always hides the overlay.
  useEffect(() => {
    setPhase(0);
    setShow(true);
    const timer = setTimeout(() => setShow(false), TOTAL_MS);
    return () => clearTimeout(timer);
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