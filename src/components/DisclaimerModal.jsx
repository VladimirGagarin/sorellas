// components/DisclaimerModal.jsx — a confirmation modal shown to first-time
// visitors; finishing it acks the disclaimer and returns them home.
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
import "./DisclaimerModal.css";

export default function DisclaimerModal() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(ACK_KEY) !== "true";
    } catch {
      return true;
    }
  });
  const [index, setIndex] = useState(0);

  if (!show || location.pathname === "/disclaimer") {
    return <Outlet />;
  }

  const total = POINTS.length;
  const isLast = index === total - 1;
  const point = POINTS[index];

  const t = {
    eyebrow:
      language === "en"
        ? "A gentle word before you enter"
        : "Una parola gentile prima di entrare",
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
    setShow(false);
    navigate("/home");
  };

  const handlePrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <>
      <Outlet />
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
            <button className="disclaimer-btn primary red" onClick={handleNext}>
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
    </>
  );
}