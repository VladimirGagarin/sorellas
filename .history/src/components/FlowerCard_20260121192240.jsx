// FlowerCard.jsx - Masonry/Pinterest Style
import React, { useState, useEffect, useR } from "react";
import {
  FaHeart,
  FaPray,
  FaBookmark,
  FaShareAlt,
  FaSeedling,
} from "react-icons/fa";
import Logo from "../assets/logo.png";
import "./FlowerCard.css";


function useLazyLoad() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

export default function FlowerCard({
  flower,
  language,
  isDaily = false,
  compact = false,
  isFavorite: initialFavorite = false,
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  // Get color based on DayTime
  const getDayTimeColor = (dayTime) => {
    const dayTimeLower = dayTime.toLowerCase();
    if (dayTimeLower.includes("morning") || dayTimeLower.includes("mattina")) {
      return "#FBBF24"; // Golden
    } else if (
      dayTimeLower.includes("midday") ||
      dayTimeLower.includes("mezzogiorno")
    ) {
      return "#F59E0B"; // Orange
    } else if (
      dayTimeLower.includes("evening") ||
      dayTimeLower.includes("sera")
    ) {
      return "#8B5CF6"; // Purple
    } else if (
      dayTimeLower.includes("night") ||
      dayTimeLower.includes("notte")
    ) {
      return "#1E40AF"; // Dark Blue
    }
    return "#6B7280"; // Gray
  };

  // Get flower symbol based on name
  const getFlowerSymbol = (flowerName) => {
    const name = flowerName[language].toLowerCase();
    if (name.includes("rose") || name.includes("rosa")) return "🌹";
    if (name.includes("lily") || name.includes("giglio")) return "🌸";
    if (name.includes("sunflower") || name.includes("girasole")) return "🌻";
    if (name.includes("lotus") || name.includes("loto")) return "🪷";
    if (name.includes("tulip") || name.includes("tulipano")) return "🌷";
    if (name.includes("daisy") || name.includes("margherita")) return "🌼";
    return "🌺"; // Default flower
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handlePray = () => {
    // Navigate to prayer page or open modal
    console.log(`Praying with ${flower.name[language]}`);
  };

  const handleSave = () => {
    // Save to favorites/bookmarks
    console.log(`Saving ${flower.name[language]}`);
  };

  const handleShare = () => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: flower.name[language],
        text: flower.description[language],
        url: window.location.href,
      });
    }
  };

  if (compact) {
    return (
      <div className={`flower-card ${compact ? "compact" : ""}`}>
        {/* Favorite Heart */}
        <button
          className={`favorite-heart ${isFavorite ? "favorited" : ""}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart />
        </button>

        {/* Flower Badge */}
        <span
          className="flower-badge"
          style={{ backgroundColor: getDayTimeColor(flower.DayTime[language]) }}
        >
          {flower.DayTime[language]}
        </span>

        {/* Flower Image */}
        <div className="flower-image-container">
          <img
            src={flower.image || Logo}
            alt={flower.name[language]}
            className="flower-image"
           
          />
          <div className="image-overlay"></div>
        </div>

        {/* Flower Content */}
        <div className="flower-content">
          <div className="flower-header">
            <h3 className="flower-name">{flower.name[language]}</h3>
          </div>

          <p className="flower-description">{flower.description[language]}</p>

          {/* Prayer Preview (only show first sentence) */}
          <div className="prayer-preview">
            <p className="prayer-text">
              {flower.prayer[language].split(".")[0]}.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flower-actions">
            <button className="action-btn btn-pray" onClick={handlePray}>
              <FaPray /> {language === "en" ? "Pray" : "Prega"}
            </button>

            <button className="action-btn btn-save" onClick={handleSave}>
              <FaBookmark /> {language === "en" ? "Save" : "Salva"}
            </button>
          </div>
        </div>

        {/* Flower Symbol */}
        <div className="flower-symbol">{getFlowerSymbol(flower.name)}</div>
      </div>
    );
  }

  // Full version for daily flower
  return (
    <div className={`flower-card ${isDaily ? "daily" : ""}`}>
      {isDaily && (
        <div className="daily-badge">
          🌟 {language === "en" ? "Daily Flower" : "Fiore del Giorno"}
        </div>
      )}

      {/* Favorite Heart */}
      <button
        className={`favorite-heart ${isFavorite ? "favorited" : ""}`}
        onClick={handleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FaHeart />
      </button>

      {/* Flower Badge */}
      <span
        className="flower-badge"
        style={{ backgroundColor: getDayTimeColor(flower.DayTime[language]) }}
      >
        {flower.DayTime[language]}
      </span>

      {/* Flower Image */}
      <div className="flower-image-container">
        <img
          src={flower.image}
          alt={flower.name[language]}
          className="flower-image"
        />
        <div className="image-overlay"></div>
      </div>

      {/* Flower Content */}
      <div className="flower-content">
        <div className="flower-header">
          <h3 className="flower-name">{flower.name[language]}</h3>
          <span
            className="flower-time"
            style={{
              backgroundColor: getDayTimeColor(flower.DayTime[language]),
            }}
          >
            {flower.DayTime[language]}
          </span>
        </div>

        <p className="flower-description">{flower.description[language]}</p>

        {/* Full Prayer Preview */}
        <div className="prayer-preview">
          <h4>{language === "en" ? "Prayer" : "Preghiera"}</h4>
          <p className="prayer-text">
            {flower.prayer[language].substring(0, 200)}...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flower-actions">
          <button className="action-btn btn-pray" onClick={handlePray}>
            <FaPray /> {language === "en" ? "Pray Now" : "Prega Ora"}
          </button>

          <button className="action-btn btn-save" onClick={handleSave}>
            <FaBookmark /> {language === "en" ? "Save" : "Salva"}
          </button>

          <button className="action-btn btn-share" onClick={handleShare}>
            <FaShareAlt /> {language === "en" ? "Share" : "Condividi"}
          </button>
        </div>
      </div>

      {/* Flower Symbol */}
      <div className="flower-symbol">
        <FaSeedling />
      </div>
    </div>
  );
}

// Skeleton loader component
export function FlowerCardSkeleton() {
  return (
    <div className="flower-card skeleton">
      <div className="flower-image-container"></div>
      <div className="flower-content">
        <h3 className="flower-name">Loading...</h3>
        <p className="flower-description">Loading description...</p>
        <div className="prayer-preview">
          <p className="prayer-text">Loading prayer text...</p>
        </div>
        <div className="flower-actions">
          <button className="action-btn btn-pray" disabled>
            Loading...
          </button>
          <button className="action-btn btn-save" disabled>
            Loading...
          </button>
        </div>
      </div>
    </div>
  );
}
