// FlowerCard.jsx - Glass Morphism Version
import React, { useState } from "react";
import { FaHeart, FaPray, FaBookmark, FaSeedling, FaClock } from "react-icons/fa";
import "./FlowerCard.css";

export default function FlowerCard({ 
  flower, 
  language, 
  featured = false,
  compact = false 
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get DayTime color
  const getDayTimeColor = (dayTime) => {
    const dayTimeLower = dayTime.toLowerCase();
    if (dayTimeLower.includes("morning") || dayTimeLower.includes("mattina")) {
      return "rgba(251, 191, 36, 0.3)";
    } else if (dayTimeLower.includes("midday") || dayTimeLower.includes("mezzogiorno")) {
      return "rgba(245, 158, 11, 0.3)";
    } else if (dayTimeLower.includes("evening") || dayTimeLower.includes("sera")) {
      return "rgba(139, 92, 246, 0.3)";
    }
    return "rgba(107, 114, 128, 0.3)";
  };

  // Get DayTime border color
  const getDayTimeBorder = (dayTime) => {
    const dayTimeLower = dayTime.toLowerCase();
    if (dayTimeLower.includes("morning") || dayTimeLower.includes("mattina")) {
      return "#FBBF24";
    } else if (dayTimeLower.includes("midday") || dayTimeLower.includes("mezzogiorno")) {
      return "#F59E0B";
    } else if (dayTimeLower.includes("evening") || dayTimeLower.includes("sera")) {
      return "#8B5CF6";
    }
    return "#6B7280";
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handlePray = () => {
    console.log(`Praying with ${flower.name[language]}`);
  };

  const cardClasses = `flower-card-glass ${featured ? "featured" : ""} ${compact ? "compact" : ""}`;

  if (compact) {
    return (
      <div className={cardClasses} style={{ 
        borderLeft: `4px solid ${getDayTimeBorder(flower.DayTime[language])}` 
      }}>
        {/* Favorite Button */}
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FaHeart />
        </button>

        {/* Flower Header */}
        <div className="flower-header-glass">
          <div className="flower-icon-small">🌸</div>
          <div>
            <h3 className="flower-name-glass">{flower.name[language]}</h3>
            <div className="daytime-badge" style={{ 
              background: getDayTimeColor(flower.DayTime[language]) 
            }}>
              <FaClock /> {flower.DayTime[language]}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="flower-desc-glass">{flower.description[language]}</p>

        {/* Prayer Preview */}
        <div className="prayer-preview-glass">
          <p>{flower.prayer[language].split(".")[0]}.</p>
        </div>

        {/* Action Button */}
        <button className="pray-btn-glass" onClick={handlePray}>
          <FaPray /> {language === "en" ? "Pray" : "Prega"}
        </button>
      </div>
    );
  }

  return (
    <div className={cardClasses} style={{ 
      borderTop: `4px solid ${getDayTimeBorder(flower.DayTime[language])}` 
    }}>
      {/* Favorite Button */}
      <button
        className={`favorite-btn-large ${isFavorite ? "active" : ""}`}
        onClick={handleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <FaHeart />
      </button>

      {/* Featured Badge */}
      {featured && (
        <div className="featured-badge">
          <FaSeedling /> {language === "en" ? "Featured" : "In Evidenza"}
        </div>
      )}

      {/* Flower Image */}
      <div className="flower-image-glass">
        <div className="image-placeholder-glass">
          <div className="placeholder-content">
            <FaSeedling className="placeholder-icon" />
            <span>{flower.name[language]}</span>
          </div>
        </div>
        <img
          src={flower.image}
          alt={flower.name[language]}
          className={`flower-image-real ${imageLoaded ? "loaded" : ""}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="image-overlay-glass"></div>
      </div>

      {/* Content */}
      <div className="flower-content-glass">
        <div className="flower-title-section">
          <h2 className="flower-title-glass">{flower.name[language]}</h2>
          <div className="daytime-tag" style={{ 
            background: getDayTimeColor(flower.DayTime[language]),
            color: getDayTimeBorder(flower.DayTime[language])
          }}>
            <FaClock /> {flower.DayTime[language]}
          </div>
        </div>

        <p className="flower-symbolism-glass">{flower.description[language]}</p>

        <div className="prayer-section-glass">
          <h4 className="prayer-title">{language === "en" ? "Prayer" : "Preghiera"}</h4>
          <p className="prayer-text-glass">
            {flower.prayer[language].substring(0, 150)}...
          </p>
        </div>

        <div className="flower-actions-glass">
          <button className="action-btn-glass primary" onClick={handlePray}>
            <FaPray /> {language === "en" ? "Pray Now" : "Prega Ora"}
          </button>
          <button className="action-btn-glass secondary">
            <FaBookmark /> {language === "en" ? "Save" : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}