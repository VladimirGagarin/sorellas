// components/LitanyPageTemplate.jsx
import React, { useState } from "react";
import {
  FaPray,
  FaChurch,
  FaHeart,
  FaArrowLeft,
  FaArrowRight,
  FaShareAlt,
  FaVolumeUp,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage";
import "./LitanyPageTemplate.css";

export default function LitanyPageTemplate({ title, litany, theme = "dark" }) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const currentItem = litany[currentIndex];

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % litany.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + litany.length) % litany.length);
  };

  const toggleFavorite = (index) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavorites(newFavorites);
  };

  const handleShare = () => {
    const shareData = {
      title: `${title} - ${currentItem[`title_${language}`]}`,
      text: currentItem[`title_${language}`],
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert("Copied to clipboard!");
    }
  };

  const handlePlayAudio = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        currentItem[`title_${language}`],
      );
      utterance.lang = language === "en" ? "en-US" : "it-IT";
      utterance.rate = 0.8;

      if (isPlaying) {
        speechSynthesis.cancel();
      } else {
        speechSynthesis.speak(utterance);
      }

      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`litany-page ${theme}`}>
      {/* Header */}
      <div className="litany-header">
        <div className="header-content">
          <FaChurch className="header-icon" />
          <div className="header-text">
            <h1 className="litany-title">{title}</h1>
            <p className="litany-subtitle">
              {language === "en"
                ? "A prayerful devotion to the Blessed Virgin Mary"
                : "Una devozione orante alla Beata Vergine Maria"}
            </p>
          </div>
        </div>

        <div className="litany-stats">
          <div className="stat-item">
            <span className="stat-value">{currentIndex + 1}</span>
            <span className="stat-label">
              {language === "en" ? "Current" : "Corrente"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{litany.length}</span>
            <span className="stat-label">
              {language === "en" ? "Total" : "Totale"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{favorites.size}</span>
            <span className="stat-label">
              {language === "en" ? "Favorites" : "Preferiti"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="litany-content">
        <div className="litany-card" key={currentItem.id}>
          {/* Image Section */}
          <div className="litany-image-section">
            <div className="image-container">
              <img
                src={currentItem.image}
                alt={currentItem[`title_${language}`] + currentItem.alt}
                className="litany-image"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(currentItem[`title_${language}`])}`;
                }}
              />
            </div>
            <div className="image-overlay">
              <div className="overlay-text">
                <FaPray className="pray-icon" />
                <span className="overlay-title">
                  {language === "en" ? "Invocation" : "Invocazione"}
                </span>
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="litany-text-section">
            <div className="invocation-header">
              <h2 className="invocation-title">
                {currentItem[`title_${language}`]}
              </h2>
              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(currentIndex)}
                aria-label={
                  favorites.has(currentIndex)
                    ? language === "en"
                      ? "Remove from favorites"
                      : "Rimuovi dai preferiti"
                    : language === "en"
                      ? "Add to favorites"
                      : "Aggiungi ai preferiti"
                }
              >
                {favorites.has(currentIndex) ? (
                  <FaHeart className="heart-icon filled" />
                ) : (
                  <FaRegBookmark className="heart-icon" />
                )}
              </button>
            </div>

            <div className="response-section">
              <div className="response-label">
                {language === "en" ? "Response" : "Risposta"}
              </div>
              <div className="response-text">
                {currentItem[`response_${language}`] ||
                  (language === "en" ? "Pray for us" : "Prega per noi")}
              </div>
            </div>

            <div className="litany-actions">
              <button
                className="action-btn audio-btn"
                onClick={handlePlayAudio}
                aria-label={language === "en" ? "Listen" : "Ascolta"}
              >
                <FaVolumeUp />
                <span>{language === "en" ? "Listen" : "Ascolta"}</span>
              </button>

              <button
                className="action-btn share-btn"
                onClick={handleShare}
                aria-label={language === "en" ? "Share" : "Condividi"}
              >
                <FaShareAlt />
                <span>{language === "en" ? "Share" : "Condividi"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="litany-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={prevItem}
            aria-label={language === "en" ? "Previous" : "Precedente"}
          >
            <FaArrowLeft />
            <span>{language === "en" ? "Previous" : "Precedente"}</span>
          </button>

          <div className="nav-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentIndex + 1) / litany.length) * 100}%`,
                }}
              />
            </div>
            <div className="progress-text">
              {currentIndex + 1} / {litany.length}
            </div>
          </div>

          <button
            className="nav-btn next-btn"
            onClick={nextItem}
            aria-label={language === "en" ? "Next" : "Successivo"}
          >
            <span>{language === "en" ? "Next" : "Successivo"}</span>
            <FaArrowRight />
          </button>
        </div>

        {/* Quick Navigation */}
        <div className="quick-nav">
          <h3 className="quick-nav-title">
            {language === "en" ? "Quick Navigation" : "Navigazione Rapida"}
          </h3>
          <div className="nav-dots">
            {litany.map((item, index) => (
              <button
                key={index}
                className={`nav-dot ${index === currentIndex ? "active" : ""} ${favorites.has(index) ? "favorite" : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to ${item[`title_${language}`]}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="litany-footer">
        <div className="footer-content">
          <FaPray className="footer-icon" />
          <p className="footer-text">
            {language === "en"
              ? "May the Blessed Virgin Mary intercede for us"
              : "Che la Beata Vergine Maria interceda per noi"}
          </p>
        </div>
      </div>
    </div>
  );
}
