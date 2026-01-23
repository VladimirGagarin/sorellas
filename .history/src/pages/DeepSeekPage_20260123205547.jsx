import { deepSeekCategories } from "../components/Utils.js";
import { deepSeekQuestions } from "../components/Utils.js";
import React, { useState } from "react";
import QuestionCard from "../components/QuestionCard";
import Header from "../components/Header";
import "./DeepSeekPage.css";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme.jsx";
import {
  FaSearch,
  FaFilter,
  FaQuestionCircle,
  FaSeedling,
  FaHeart,
  FaBrain,
} from "react-icons/fa";

export default function DeepSeekPage() {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  const categories = deepSeekCategories();
  const allQuestions = deepSeekQuestions();

  // Filter questions based on selected category and search term
  const filteredQuestions = allQuestions.filter((q) => {
    // If category is selected, filter by category
    if (selectedCategory && q.topic[language] !== selectedCategory) {
      return false;
    }

    // If search term exists, filter by search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const questionText = q.questions.some((question) =>
        question[language].toLowerCase().includes(searchLower),
      );
      const topicText = q.topic[language].toLowerCase().includes(searchLower);
      return questionText || topicText;
    }

    return true;
  });

  // Toggle favorite question
  const toggleFavorite = (category, questionIndex) => {
    const key = `${category}-${questionIndex}`;
    const newFavorites = new Set(favorites);
    if (newFavorites.has(key)) {
      newFavorites.delete(key);
    } else {
      newFavorites.add(key);
    }
    setFavorites(newFavorites);
  };

  // Get favorite questions
  const favoriteQuestions = allQuestions.flatMap((category, categoryIndex) =>
    category.questions
      .map((question, questionIndex) => ({
        ...question,
        topic: category.topic,
        isFavorite: favorites.has(
          `${category.topic[language]}-${questionIndex}`,
        ),
        categoryIndex,
        questionIndex,
      }))
      .filter((q) => q.isFavorite),
  );

  // Clear filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
  };

  return (
    <div className={`deep-seek-page ${isDarkMode ? "dark" : "light"}`}>
      <Header />

      <div className="deep-seek-container">
        {/* Hero Section */}
        <div className="deep-seek-hero">
          <div className="hero-content">
            <div className="hero-icon">
              <FaBrain />
            </div>
            <h1 className="hero-title">
              {language === "en" ? "DeepSeek Questions" : "Domande DeepSeek"}
            </h1>
            <p className="hero-subtitle">
              {language === "en"
                ? "Explore profound questions about faith, life, and spirituality"
                : "Esplora domande profonde su fede, vita e spiritualità"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="deep-seek-content">
          {/* Sidebar - Categories & Filters */}
          <div className="deep-seek-sidebar">
            {/* Search Box */}
            <div className="search-section">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder={
                    language === "en"
                      ? "Search questions..."
                      : "Cerca domande..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="categories-section">
              <div className="section-header">
                <FaFilter />
                <h3>{language === "en" ? "Categories" : "Categorie"}</h3>
              </div>
              <div className="categories-list">
                <button
                  className={`category-item ${!selectedCategory ? "active" : ""}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  <FaSeedling />
                  <span>
                    {language === "en" ? "All Questions" : "Tutte le Domande"}
                  </span>
                </button>

                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`category-item ${selectedCategory === category[language] ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category[language])}
                  >
                    <FaQuestionCircle />
                    <span>{category[language]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="favorites-section">
              <div className="section-header">
                <FaHeart />
                <h3>{language === "en" ? "Favorites" : "Preferiti"}</h3>
              </div>
              <div className="favorites-count">
                <span className="count">{favoriteQuestions.length}</span>
                <span className="label">
                  {language === "en"
                    ? "favorite questions"
                    : "domande preferite"}
                </span>
              </div>
              {favoriteQuestions.length > 0 && (
                <button
                  className="view-favorites-btn"
                  onClick={() => {
                    // Logic to scroll to favorites or show only favorites
                  }}
                >
                  {language === "en" ? "View Favorites" : "Vedi Preferiti"}
                </button>
              )}
            </div>

            {/* Filter Status */}
            {(selectedCategory || searchTerm) && (
              <div className="active-filters">
                <div className="section-header">
                  <FaFilter />
                  <h3>
                    {language === "en" ? "Active Filters" : "Filtri Attivi"}
                  </h3>
                </div>
                <div className="filters-list">
                  {selectedCategory && (
                    <div className="filter-tag">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {searchTerm && (
                    <div className="filter-tag">
                      <span>"{searchTerm}"</span>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="remove-filter"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  {language === "en" ? "Clear All Filters" : "Pulisci Filtri"}
                </button>
              </div>
            )}
          </div>

          {/* Main Content - Questions */}
          <div className="deep-seek-main">
            {/* Stats Header */}
            <div className="questions-header">
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-value">{filteredQuestions.length}</span>
                  <span className="stat-label">
                    {language === "en" ? "Questions" : "Domande"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{categories.length}</span>
                  <span className="stat-label">
                    {language === "en" ? "Categories" : "Categorie"}
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

            {/* Questions Grid */}
            <div className="questions-grid">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="category-group">
                    <h2 className="category-title">
                      {category.topic[language]}
                      <span className="question-count">
                        ({category.questions.length})
                      </span>
                    </h2>
                    <div className="questions-list">
                      {category.questions.map((question, questionIndex) => (
                        <QuestionCard
                          key={questionIndex}
                          question={question[language]}
                          category={category.topic[language]}
                          isFavorite={favorites.has(
                            `${category.topic[language]}-${questionIndex}`,
                          )}
                          onToggleFavorite={() =>
                            toggleFavorite(
                              category.topic[language],
                              questionIndex,
                            )
                          }
                          language={language}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <FaSearch className="no-results-icon" />
                  <h3>
                    {language === "en"
                      ? "No questions found"
                      : "Nessuna domanda trovata"}
                  </h3>
                  <p>
                    {language === "en"
                      ? "Try adjusting your search or filter criteria"
                      : "Prova a modificare i criteri di ricerca o filtro"}
                  </p>
                  <button className="clear-all-btn" onClick={clearFilters}>
                    {language === "en" ? "Clear All Filters" : "Pulisci Filtri"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
