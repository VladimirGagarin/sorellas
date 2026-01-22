// components/PrayerOverlay.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaHeart,
  FaBookmark,
  FaShareAlt,
  FaVolumeUp,
  FaPrint,
  FaCopy,
  FaSeedling,
  FaClock,
} from "react-icons/fa";
import "./PrayerOverlay.css";

export default function PrayerOverlay({ flowers, language }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [prayerData, setPrayerData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  // Close the overlay
  const closeOverlay = useCallback(() => {
    // Remove pray parameter from URL
    const params = new URLSearchParams(location.search);
    params.delete("pray");

    // Get the base URL without search params
    const baseUrl = location.pathname;
    const newUrl = params.toString()
      ? `${baseUrl}?${params.toString()}`
      : baseUrl;

    navigate(newUrl, { replace: true });
  }, [location.search, location.pathname, navigate]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && prayerData) {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [prayerData, closeOverlay]);

  // Parse the pray query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prayParam = params.get("pray");

    // If pray param exists, set prayer data
    if (prayParam) {
      const [flowerId, lang] = prayParam.split("_");
      const flower = flowers.find((f) => f.id === flowerId);

      if (flower) {
        setPrayerData({
          flower,
          language: lang || language,
        });
        setIsClosing(false); // Reset closing state if opening new prayer
      }
      return;
    }

    // If pray param doesn't exist but prayerData does, start closing animation
    if (prayerData && !prayParam) {
      setIsClosing(true);
      // Delay clearing prayerData until after animation completes
      const timer = setTimeout(() => {
        setPrayerData(null);
      }, 300);
      return () => clearTimeout(timer);
    }

    // If neither pray param nor prayerData exist, ensure prayerData is null
    if (!prayerData) {
      setPrayerData(null);
    }
  }, [location.search, flowers, language, prayerData]);

  // Separate effect for handling closing state
  useEffect(() => {
    if (isClosing && prayerData) {
      const timer = setTimeout(() => {
        setPrayerData(null);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, prayerData]);

  // Early return if no prayerData and not closing
  if (!prayerData && !isClosing) return null;

  const { flower, language: overlayLanguage } = prayerData || {};
  const actualLanguage = overlayLanguage || language;

  const handleCopy = () => {
    if (flower) {
      navigator.clipboard.writeText(flower.prayer[actualLanguage]);
      alert("Prayer copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window && flower) {
      const utterance = new SpeechSynthesisUtterance(
        flower.prayer[actualLanguage],
      );
      utterance.lang = actualLanguage === "en" ? "en-US" : "it-IT";
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const handleShare = () => {
    if (navigator.share && flower) {
      navigator.share({
        title: `${flower.name[actualLanguage]} - Spiritual Garden`,
        text: `${flower.prayer[actualLanguage].substring(0, 100)}...`,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  // Render empty overlay during closing animation
  if (!prayerData && isClosing) {
    return (
      <div className={`prayer-overlay closing`}>
        <div className="prayer-overlay-backdrop" onClick={closeOverlay} />
      </div>
    );
  }

  return (
    <div className={`prayer-overlay ${isClosing ? "closing" : ""}`}>
      <div className="prayer-overlay-backdrop" onClick={closeOverlay} />

      <div className="prayer-modal">
        {/* Modal Header */}
        <div className="prayer-modal-header">
          <div className="prayer-header-left">
            <div className="flower-icon-header">
              <FaSeedling />
            </div>
            <div className="prayer-title-section">
              <h2 className="prayer-flower-name">
                {flower?.name[actualLanguage]}
              </h2>
              <div className="prayer-subtitle">
                <span className="flower-daytime">
                  <FaClock /> {flower?.DayTime[actualLanguage]}
                </span>
                <span className="flower-symbolism">
                  {flower?.description[actualLanguage]}
                </span>
              </div>
            </div>
          </div>
          <button
            className="close-prayer-btn"
            onClick={closeOverlay}
            aria-label="Close prayer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Content */}
        <div className="prayer-modal-content">
          <div className="prayer-text-container">
            <div className="prayer-text-header">
              <h3 className="prayer-text-title">
                {actualLanguage === "en" ? "Prayer" : "Preghiera"}
              </h3>
              <div className="prayer-actions">
                <button
                  className="prayer-action-btn"
                  onClick={handleSpeak}
                  title={
                    actualLanguage === "en"
                      ? "Listen to prayer"
                      : "Ascolta la preghiera"
                  }
                >
                  <FaVolumeUp />
                </button>
                <button
                  className="prayer-action-btn"
                  onClick={handleCopy}
                  title={
                    actualLanguage === "en"
                      ? "Copy prayer"
                      : "Copia la preghiera"
                  }
                >
                  <FaCopy />
                </button>
                <button
                  className="prayer-action-btn"
                  onClick={handlePrint}
                  title={
                    actualLanguage === "en"
                      ? "Print prayer"
                      : "Stampa la preghiera"
                  }
                >
                  <FaPrint />
                </button>
                <button
                  className="prayer-action-btn"
                  onClick={handleShare}
                  title={
                    actualLanguage === "en"
                      ? "Share prayer"
                      : "Condividi la preghiera"
                  }
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <div className="prayer-text-body">
              <p className="prayer-text">{flower?.prayer[actualLanguage]}</p>
            </div>
          </div>

          {/* Flower Image */}
          <div className="prayer-flower-image">
            <div className="image-container">
              <div className="flower-image-placeholder">
                <img 
                  className="placeholder-icon-large" 
                  src={flower?.image} 
                  alt={flower?.name[actualLanguage]} 
                  loading="lazy" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="prayer-modal-footer">
          <div className="prayer-stats">
            <div className="prayer-stat">
              <span className="stat-label">
                {actualLanguage === "en" ? "Words" : "Parole"}
              </span>
              <span className="stat-value">
                {flower?.prayer[actualLanguage]?.split(" ").length || 0}
              </span>
            </div>
            <div className="prayer-stat">
              <span className="stat-label">
                {actualLanguage === "en" ? "Language" : "Lingua"}
              </span>
              <span className="stat-value">
                {actualLanguage === "en" ? "English" : "Italiano"}
              </span>
            </div>
            <div className="prayer-stat">
              <span className="stat-label">
                {actualLanguage === "en" ? "Time" : "Tempo"}
              </span>
              <span className="stat-value">
                {Math.ceil(
                  (flower?.prayer[actualLanguage]?.split(" ").length || 0) / 150,
                )}{" "}
                min
              </span>
            </div>
          </div>

          <div className="prayer-footer-actions">
            <button
              className="btn-save-prayer"
              onClick={() => {
                alert(
                  actualLanguage === "en"
                    ? "Saved to favorites!"
                    : "Salvato nei preferiti!",
                );
              }}
            >
              <FaHeart />{" "}
              {actualLanguage === "en" ? "Save Prayer" : "Salva Preghiera"}
            </button>
            <button
              className="btn-bookmark-prayer"
              onClick={() => {
                alert(
                  actualLanguage === "en"
                    ? "Bookmarked!"
                    : "Aggiunto ai segnalibri!",
                );
              }}
            >
              <FaBookmark />{" "}
              {actualLanguage === "en" ? "Bookmark" : "Segnalibro"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}