// pages/DisclaimerPage.jsx — one gentle note at a time
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookOpen,
  FaSeedling,
  FaHeart,
} from "react-icons/fa";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { SITE_IMAGE_URL, SITE_NAME, useSeo } from "../utils/seo.js";
import "./DisclaimerPage.css";

export const ACK_KEY = "disclaimer-ack";

export const POINTS = [
  {
    en: "This page is shared for inspiration and reflection — not for entertainment.",
    it: "Questa pagina è condivisa per ispirazione e riflessione — non per intrattenimento.",
  },
  {
    en: "The images of the sisters shown here are AI-generated and do not exactly represent any real person.",
    it: "Le immagini delle suore mostrate qui sono generate dall'IA e non rappresentano esattamente alcuna persona reale.",
  },
  {
    en: "The names of the sisters used here may be fictitious or not perfectly accurate.",
    it: "I nomi delle suore usati qui possono essere di fantasia o non del tutto accurati.",
  },
  {
    en: "We did not ask the sisters' names, and we hope this may not cause any trouble.",
    it: "Non abbiamo chiesto i nomi delle suore e speriamo che questo non possa causare alcun problema.",
  },
  {
    en: "Please consider this page as a small gesture of faith and devotion.",
    it: "Considera questa pagina come un piccolo gesto di fede e devozione.",
  },
  {
    en: "If any concern arises, please visit our help page — or know that we are building it now.",
    it: "Se sorgesse qualche dubbio, visita la nostra pagina di aiuto — o sappi che la stiamo costruendo ora.",
  },
  {
    en: "Thank you for your attention to this matter.",
    it: "Grazie per la tua attenzione su questo argomento.",
  },
];

export default function DisclaimerPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const total = POINTS.length;
  const isLast = index === total - 1;
  const point = POINTS[index];

  useSeo({
    title: `A Gentle Note ✦ ${SITE_NAME}`,
    description:
      "A gentle note to visitors of this garden of faith — read one by one before you enter.",
    url: window.location.href,
    image: SITE_IMAGE_URL,
  });

  const t = {
    eyebrow: language === "en" ? "A gentle word before you enter" : "Una parola gentile prima di entrare",
    back: language === "en" ? "Back" : "Indietro",
    understand: language === "en" ? "I understand" : "Ho capito",
    enter: language === "en" ? "Enter the Garden" : "Entra nel Giardino",
    footnote: language === "en" ? "Aeternum Floreamus" : "Aeternum Floreamus",
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
    navigate("/home");
  };

  const handlePrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return (
    <div className="disclaimer-page">
      <Header />
      <div className="disclaimer-stage">
        <div className="disclaimer-card">
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
            <button className="disclaimer-btn primary" onClick={handleNext}>
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

          <p className="disclaimer-footnote">{t.footnote}</p>
        </div>
      </div>
    </div>
  );
}