// components/QuestionCard.jsx
import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaCopy,
  FaQuoteLeft,
  FaQuoteRight,
  FaBookmark,
  FaRegBookmark,
  FaLightbulb,
  FaBrain,
  FaPray,
} from "react-icons/fa";
import "./QuestionCard.css";


export default function QuestionCard({
  question,
  category,
  isFavorite,
  onToggleFavorite,
  language,
}) {
  const [copied, setCopied] = useState(false);
  

  const handleCopy = () => {
    navigator.clipboard.writeText(question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${category} - DeepSeek Question`,
          text: question,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  const getCategoryIcon = (cat) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes("life") || lowerCat.includes("vita"))
      return <FaLightbulb />;
    if (lowerCat.includes("growth") || lowerCat.includes("crescita"))
      return <FaBrain />;
    if (lowerCat.includes("prayer") || lowerCat.includes("preghiera"))
      return <FaPray />;
    if (lowerCat.includes("faith") || lowerCat.includes("fede"))
      return <FaQuoteLeft />;
    if (lowerCat.includes("joy") || lowerCat.includes("gioia"))
      return <FaHeart />;
    if (lowerCat.includes("purpose") || lowerCat.includes("scopo"))
      return <FaQuoteRight />;
    if (lowerCat.includes("forgiveness") || lowerCat.includes("perdono"))
      return <FaHeart />;
    if (lowerCat.includes("service") || lowerCat.includes("servizio"))
      return <FaPray />;
    if (lowerCat.includes("community") || lowerCat.includes("comunità"))
      return <FaBrain />;
    if (lowerCat.includes("morality") || lowerCat.includes("moralità"))
      return <FaLightbulb />;
    return <FaBrain />;
  };

  const getCategoryColor = (cat) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes("life") || lowerCat.includes("vita"))
      return "#4A5D36"; // Liturgical olive
    if (lowerCat.includes("growth") || lowerCat.includes("crescita"))
      return "#8C6D1F"; // Antique gold
    if (lowerCat.includes("prayer") || lowerCat.includes("preghiera"))
      return "#A84B2A"; // Rosewood
    if (lowerCat.includes("faith") || lowerCat.includes("fede"))
      return "#5D4037"; // Cathedral oak
    if (lowerCat.includes("joy") || lowerCat.includes("gioia"))
      return "#D4A94C"; // Candle gold
    if (lowerCat.includes("purpose") || lowerCat.includes("scopo"))
      return "#A85E1E"; // Ember amber
    if (lowerCat.includes("forgiveness") || lowerCat.includes("perdono"))
      return "#8C7355"; // Taupe
    if (lowerCat.includes("service") || lowerCat.includes("servizio"))
      return "#7A5C10"; // Deep bronze
    if (lowerCat.includes("community") || lowerCat.includes("comunità"))
      return "#C8A45C"; // Warm sand
    if (lowerCat.includes("morality") || lowerCat.includes("moralità"))
      return "#B98F35"; // Burnished gold
    return "#8C6D1F"; // Antique gold
  };

  const categoryColor = getCategoryColor(category);
  const CategoryIcon = getCategoryIcon(category);

  return (
    <div
      className="question-card"
      style={{ "--category-color": categoryColor }}
    >
      <div className="question-card-header">
        <div
          className="category-tag"
          style={{ backgroundColor: `${categoryColor}20` }}
        >
          <span className="category-icon" style={{ color: categoryColor }}>
            {CategoryIcon}
          </span>
          <span className="category-text" style={{ color: categoryColor }}>
            {category}
          </span>
        </div>

        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={
            isFavorite
              ? language === "en"
                ? "Remove from favorites"
                : "Rimuovi dai preferiti"
              : language === "en"
                ? "Add to favorites"
                : "Aggiungi ai preferiti"
          }
        >
          {isFavorite ? (
            <FaHeart className="heart-icon filled" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
        </button>
      </div>

      <div className="question-card-body">
        <div className="question-content">
          <div className="quote-mark left">
            <FaQuoteLeft />
          </div>
          <p className="question-text">{question}</p>
          <div className="quote-mark right">
            <FaQuoteRight />
          </div>
        </div>
      </div>

      <div className="question-card-footer">
        <div className="question-actions">
          <button
            className="action-btn copy-btn"
            onClick={handleCopy}
            aria-label={
              copied
                ? language === "en"
                  ? "Copied!"
                  : "Copiato!"
                : language === "en"
                  ? "Copy question"
                  : "Copia domanda"
            }
            title={language === "en" ? "Copy question" : "Copia domanda"}
          >
            <FaCopy />
            <span className="btn-label">
              {copied
                ? language === "en"
                  ? "Copied!"
                  : "Copiato!"
                : language === "en"
                  ? "Copy"
                  : "Copia"}
            </span>
          </button>

          <button
            className="action-btn share-btn"
            onClick={handleShare}
            aria-label={
              language === "en" ? "Share question" : "Condividi domanda"
            }
            title={language === "en" ? "Share question" : "Condividi domanda"}
          >
            <FaShareAlt />
            <span className="btn-label">
              {language === "en" ? "Share" : "Condividi"}
            </span>
          </button>

          <button
            className="action-btn bookmark-btn"
            onClick={() => {
              // Bookmark functionality can be added here
              alert(
                language === "en"
                  ? "Question bookmarked for reflection"
                  : "Domanda salvata per la riflessione",
              );
            }}
            aria-label={
              language === "en"
                ? "Bookmark for reflection"
                : "Salva per riflessione"
            }
            title={
              language === "en"
                ? "Bookmark for reflection"
                : "Salva per riflessione"
            }
          >
            <FaRegBookmark />
            <span className="btn-label">
              {language === "en" ? "Reflect" : "Rifletti"}
            </span>
          </button>
        </div>

        <div className="question-meta">
          <div className="meta-item">
            <span className="meta-label">
              {language === "en" ? "Category:" : "Categoria:"}
            </span>
            <span className="meta-value">{category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">
              {language === "en" ? "Words:" : "Parole:"}
            </span>
            <span className="meta-value">{question.split(" ").length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
