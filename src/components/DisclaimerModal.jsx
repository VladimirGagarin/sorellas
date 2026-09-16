// components/DisclaimerModal.jsx — first-visit note flow.
// - Landing on "/": show the disclaimer modal directly; acks are saved to
//   sessionStorage, so reloads navigate home instead of re-showing.
// - Landing on a deep link (e.g. a shared quote): show a confirmation overlay
//   first ("Would you like to read our note?"). Yes → disclaimer modal,
//   No → close the overlay and continue on the landed page.
// - The dedicated /disclaimer page (header link) never gets the overlays.
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaSeedling,
  FaHeart,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";
import { ACK_KEY, POINTS } from "../pages/DisclaimerPage.jsx";
import LoadingOverlay from "./LoadingOverlay.jsx";
import "./DisclaimerModal.css";

export default function DisclaimerModal() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(() => {
    let acked = false;
    try {
      acked = sessionStorage.getItem(ACK_KEY) === "true";
    } catch {
      /* storage unavailable — treat as new visitor */
    }
    if (acked) return "none";
    if (location.pathname === "/disclaimer") return "none";
    if (location.pathname === "/") return "note";
    return "confirm";
  });
  const [index, setIndex] = useState(0);

  const total = POINTS.length;
  const isLast = index === total - 1;
  const point = POINTS[index];

  const t = {
    eyebrow:
      language === "en"
        ? "A gentle word before you enter"
        : "Una parola gentile prima di entrare",
    confirmEyebrow:
      language === "en"
        ? "Before you continue"
        : "Prima di continuare",
    confirmText:
      language === "en"
        ? "Would you like to read our gentle note to visitors before you enter the garden?"
        : "Vuoi leggere la nostra breve nota ai visitatori prima di entrare nel giardino?",
    confirmYes: language === "en" ? "Yes, read it" : "Sì, leggila",
    confirmNo: language === "en" ? "No, continue" : "No, continua",
    back: language === "en" ? "Back" : "Indietro",
    understand: language === "en" ? "I understand" : "Ho capito",
    enter: language === "en" ? "Enter the Garden" : "Entra nel Giardino",
  };

  const handleNext = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    try {
      sessionStorage.setItem(ACK_KEY, "true");
    } catch {
      /* storage unavailable — just proceed */
    }
    setMode("none");
    navigate("/home");
  };

  const handlePrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  if (mode === "none" || location.pathname === "/disclaimer") {
    return (
      <>
        <Outlet />
        <LoadingOverlay />
      </>
    );
  }

  return (
    <>
      <Outlet />
      <LoadingOverlay />
      {mode === "confirm" ? (
        <div
          className="disclaimer-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.confirmEyebrow}
        >
          <div className="disclaimer-card disclaimer-confirm-card">
            <div className="disclaimer-seal">
              <FaSeedling />
            </div>

            <p className="disclaimer-eyebrow">{t.confirmEyebrow}</p>

            <p className="disclaimer-confirm-text">{t.confirmText}</p>

            <div className="disclaimer-actions">
              <button
                className="disclaimer-btn ghost"
                onClick={() => setMode("none")}
              >
                {t.confirmNo}
              </button>
              <button
                className="disclaimer-btn primary red"
                onClick={() => {
                  setIndex(0);
                  setMode("note");
                }}
              >
                <FaBookOpen />
                {t.confirmYes}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="disclaimer-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.eyebrow}
        >
          <div className="disclaimer-card disclaimer-modal-card">
            <div className="disclaimer-seal">
              <FaSeedling />
            </div>

            <p className="disclaimer-eyebrow">{t.eyebrow}</p>

            <span className="disclaimer-numeral">
              {String(index + 1).padStart(2, "0")}
            </span>

            <p className="disclaimer-text" key={index}>
              {language === "en" ? point.en : point.it}
            </p>

            <div className="disclaimer-dots" aria-hidden="true">
              {POINTS.map((_, i) => (
                <span
                  key={i}
                  className={`disclaimer-dot ${
                    i === index ? "active" : i < index ? "done" : ""
                  }`}
                />
              ))}
            </div>

            <div className="disclaimer-actions">
              {index > 0 && (
                <button
                  className="disclaimer-btn ghost"
                  onClick={handlePrev}
                  aria-label={t.back}
                >
                  <FaArrowLeft />
                  {t.back}
                </button>
              )}
              <button
                className="disclaimer-btn primary red"
                onClick={handleNext}
              >
                {isLast ? (
                  <>
                    <FaHeart />
                    {t.enter}
                  </>
                ) : (
                  <>
                    <FaBookOpen />
                    {t.understand}
                  </>
                )}
              </button>
            </div>

            <p className="disclaimer-count">
              {index + 1} / {total}
            </p>
          </div>
        </div>
      )}
    </>
  );
}