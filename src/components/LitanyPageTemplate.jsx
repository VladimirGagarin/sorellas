// components/LitanyPageTemplate.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaPray,
  FaChurch,
  FaHeart,
  FaList,
  FaArrowLeft,
  FaArrowRight,
  FaShareAlt,
  FaVolumeUp,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage";
import "./LitanyPageTemplate.css";

export default function LitanyPageTemplate({ title, litany, theme = "dark", className = "", icon, subtitle, footerText, responseText }) {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get current item ID from URL or default to first
  const itemIdFromUrl = searchParams.get("item");
  const initialIndex = itemIdFromUrl
    ? litany.findIndex((item) => item.id === itemIdFromUrl)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0,
  );

  const currentItem = litany[currentIndex];

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % litany.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + litany.length) % litany.length);
  };

  // Keyboard navigation: left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "ArrowRight") nextItem();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, litany.length]);

  // Update URL when index changes
  useEffect(() => {
    if (currentItem?.id) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("item", currentItem.id);
      setSearchParams(newParams, { replace: true });

      // Also update browser history for back button
      navigate(`?${newParams.toString()}`, { replace: true });
    }
  }, [currentIndex, currentItem?.id, setSearchParams, navigate, searchParams]);

  const goToItem = (index) => {
    setCurrentIndex(index);
    setIsMenuOpen(false);
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
      url: `${window.location.origin}${window.location.pathname}?item=${currentItem.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
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

  // Generate shareable links for each item
  const getShareableLink = (itemId) => {
    return `${window.location.origin}${window.location.pathname}?item=${itemId}`;
  };

  return (
    <div className={`litany-page ${theme} ${className}`}>
      {/* Header */}
      <div className="litany-header">
        <div className="header-content">
          {icon || <FaChurch className="header-icon" />}
          <div className="header-text">
            <h1 className="litany-title">{title}</h1>
            <p className="litany-subtitle">
              {subtitle ||
                (language === "en"
                  ? "A prayerful devotion to the Blessed Virgin Mary"
                  : "Una devozione orante alla Beata Vergine Maria")}
            </p>
            {itemIdFromUrl && (
              <div className="url-indicator">
                <small>
                  {language === "en" ? "Direct link: " : "Link diretto: "}
                  <a
                    href={getShareableLink(currentItem.id)}
                    className="direct-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(
                        getShareableLink(currentItem.id),
                      );
                      alert(
                        language === "en" ? "Link copied!" : "Link copiato!",
                      );
                    }}
                  >
                    {currentItem[`title_${language}`]}
                  </a>
                </small>
              </div>
            )}
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
          {/* Invocations menu (top-right) */}
          <div
            className="invocation-menu-wrap"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button
              className="invocation-menu-toggle"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={
                language === "en"
                  ? "Show all invocations"
                  : "Mostra tutte le invocazioni"
              }
              aria-expanded={isMenuOpen}
            >
              <FaList />
            </button>
            {isMenuOpen && (
              <div className="invocation-menu">
                <h3 className="invocation-menu-title">
                  {language === "en"
                    ? "All Invocations"
                    : "Tutte le Invocazioni"}
                </h3>
                <ul className="invocation-menu-list">
                  {litany.map((item, index) => (
                    <li key={item.id}>
                      <button
                        className={`invocation-menu-item ${index === currentIndex ? "active" : ""} ${favorites.has(index) ? "favorite" : ""}`}
                        onClick={() => goToItem(index)}
                      >
                        <span className="invocation-menu-index">{index + 1}</span>
                        <span className="invocation-menu-name">
                          {item[`title_${language}`]}
                        </span>
                        {favorites.has(index) && (
                          <FaHeart className="invocation-menu-heart" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
          </div>

          {/* Text Section */}
          <div className="litany-text-section">
            <div className="invocation-header">
              <h2 className="invocation-title">
                {currentItem[`title_${language}`]}
              </h2>
              <div className="header-buttons">
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
                <button
                  className="share-link-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      getShareableLink(currentItem.id),
                    );
                    alert(language === "en" ? "Link copied!" : "Link copiato!");
                  }}
                  title={
                    language === "en"
                      ? "Copy direct link"
                      : "Copia link diretto"
                  }
                  aria-label={
                    language === "en"
                      ? "Copy direct link"
                      : "Copia link diretto"
                  }
                >
                  🔗
                </button>
              </div>
            </div>

            <div className="response-section">
              <div className="response-label">
                {language === "en" ? "Response" : "Risposta"}
              </div>
              <div className="response-text">
                {currentItem[`response_${language}`] ||
                  responseText ||
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
          {/* Progress bar */}
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
        </div>
      </div>

      {/* Fixed side navigation: prev (left) / next (right), vertically centered */}
      <button
        className="nav-btn prev-btn nav-fixed nav-fixed-left"
        onClick={prevItem}
        aria-label={language === "en" ? "Previous" : "Precedente"}
        title={language === "en" ? "Previous (←)" : "Precedente (←)"}
      >
        <FaArrowLeft />
        <span className="nav-btn-label">
          {language === "en" ? "Previous" : "Precedente"}
        </span>
      </button>

      <button
        className="nav-btn next-btn nav-fixed nav-fixed-right"
        onClick={nextItem}
        aria-label={language === "en" ? "Next" : "Successivo"}
        title={language === "en" ? "Next (→)" : "Successivo (→)"}
      >
        <span className="nav-btn-label">
          {language === "en" ? "Next" : "Successivo"}
        </span>
        <FaArrowRight />
      </button>

      {/* Footer */}
      <div className="litany-footer">
        <div className="footer-content">
          <FaPray className="footer-icon" />
          <p className="footer-text">
            {footerText ||
              (language === "en"
                ? "May the Blessed Virgin Mary intercede for us"
                : "Che la Beata Vergine Maria interceda per noi")}
          </p>
        </div>
        <div className="share-instruction">
          <small>
            {language === "en"
              ? "Share this specific invocation by copying the URL"
              : "Condividi questa specifica invocazione copiando l'URL"}
          </small>
        </div>
      </div>
    </div>
  );
}
