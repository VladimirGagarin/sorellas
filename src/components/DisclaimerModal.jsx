// components/DisclaimerModal.jsx — the first-visit note, kept out of the way.
// - Small screens: a drawer sliding up from the bottom, the lines scroll inside.
// - Large screens: a small card anchored to the bottom-right corner.
// - Closing it (X, handle, or the button) never navigates: the visitor stays
//   exactly where they landed. Dismissal lasts for the current session only.
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaSeedling, FaHeart, FaTimes } from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";
import { POINTS } from "../pages/DisclaimerPage.jsx";
import LoadingOverlay from "./LoadingOverlay.jsx";
import "./DisclaimerModal.css";

const SESSION_KEY = "disclaimer-seen";

export default function DisclaimerModal() {
  const { language } = useLanguage();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Reading the note as its own page counts as having seen it: remember the
  // navigation so a later visit to another page does not pop the panel again.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    if (location.pathname === "/disclaimer") setDismissed(true);
  }

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      /* storage unavailable — just hide for this view */
    }
  };

  const t = {
    eyebrow:
      language === "en"
        ? "A gentle word before you enter"
        : "Una parola gentile prima di entrare",
    close: language === "en" ? "Close" : "Chiudi",
    understand: language === "en" ? "I understand" : "Ho capito",
    footnote: "Aeternum Floreamus",
  };

  const hidden = dismissed || location.pathname === "/disclaimer";

  return (
    <>
      <Outlet />
      <LoadingOverlay />
      {!hidden && (
        <aside
          className="disclaimer-panel"
          role="complementary"
          aria-label={t.eyebrow}
        >
          <button
            type="button"
            className="disclaimer-panel-handle"
            onClick={dismiss}
            aria-label={t.close}
          />

          <div className="disclaimer-panel-header">
            <div className="disclaimer-panel-seal">
              <FaSeedling />
            </div>
            <p className="disclaimer-panel-eyebrow">{t.eyebrow}</p>
            <button
              type="button"
              className="disclaimer-panel-close"
              onClick={dismiss}
              aria-label={t.close}
            >
              <FaTimes />
            </button>
          </div>

          <div className="disclaimer-panel-body">
            <ol className="disclaimer-panel-list">
              {POINTS.map((point, i) => (
                <li className="disclaimer-panel-line" key={i}>
                  <span className="disclaimer-panel-numeral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="disclaimer-panel-text">
                    {language === "en" ? point.en : point.it}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="disclaimer-panel-footer">
            <button
              type="button"
              className="disclaimer-btn primary"
              onClick={dismiss}
            >
              <FaHeart />
              {t.understand}
            </button>
            <p className="disclaimer-panel-footnote">{t.footnote}</p>
          </div>
        </aside>
      )}
    </>
  );
}
