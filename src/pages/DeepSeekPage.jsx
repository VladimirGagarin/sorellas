import { deepSeekCategories } from "../components/Utils.js";
import { deepSeekQuestions } from "../components/Utils.js";
import React, { useMemo, useState } from "react";
import QuestionCard from "../components/QuestionCard.jsx";
import Header from "../components/Header.jsx";
import "./DeepSeekPage.css";
import { useLanguage } from "../contexts/useLanguage.js";
import { useTheme } from "../contexts/theme.jsx";
import {
  FaSearch,
  FaTimes,
  FaFilter,
  FaQuestionCircle,
  FaSeedling,
  FaHeart,
  FaBrain,
} from "react-icons/fa";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DeepSeekPage() {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(() => new Set());
  const [showFavorites, setShowFavorites] = useState(false);

  const categories = useMemo(() => deepSeekCategories(), []);
  const allQuestions = useMemo(() => deepSeekQuestions(), []);

  // Fresh random order for the "All Questions" view on every visit.
  const [shuffledGroups] = useState(() =>
    shuffleArray(
      allQuestions.map((g) => ({ ...g, questions: shuffleArray(g.questions) }))
    )
  );

  const categoryCounts = useMemo(() => {
    const counts = {};
    allQuestions.forEach((q) => {
      const key = q.topic[language];
      counts[key] = (counts[key] || 0) + q.questions.length;
    });
    return categories.map((c) => ({
      label: c[language],
      count: counts[c[language]] || 0,
    }));
  }, [allQuestions, categories, language]);

  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedCategory && q.topic[language] !== selectedCategory) {
      return false;
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const questionText = q.questions.some((question) =>
        question[language].toLowerCase().includes(searchLower)
      );
      const topicText = q.topic[language].toLowerCase().includes(searchLower);
      return questionText || topicText;
    }
    return true;
  });

  const toggleFavorite = (category, questionIndex) => {
    const key = `${category}-${questionIndex}`;
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const favoriteQuestions = allQuestions.flatMap((category, categoryIndex) =>
    category.questions
      .map((question, questionIndex) => ({
        ...question,
        topic: category.topic,
        categoryIndex,
        questionIndex,
      }))
      .filter((q) => favorites.has(`${q.topic[language]}-${q.questionIndex}`))
  );

  const favoriteGroups = useMemo(() => {
    const groups = [];
    const map = {};
    favoriteQuestions.forEach((q) => {
      const key = q.topic[language];
      if (!map[key]) {
        map[key] = { topic: q.topic, questions: [] };
        groups.push(map[key]);
      }
      map[key].questions.push(q);
    });
    return groups;
  }, [favoriteQuestions, language]);

  const displayedGroups = showFavorites
    ? favoriteGroups
    : !selectedCategory && !searchTerm
      ? shuffledGroups
      : filteredQuestions;
  const displayedCount = displayedGroups.reduce(
    (sum, g) => sum + g.questions.length,
    0
  );

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
    setShowFavorites(false);
  };

  const selectCategory = (value) => {
    setShowFavorites(false);
    setSelectedCategory(value);
  };

  const changeSearch = (value) => {
    setShowFavorites(false);
    setSearchTerm(value);
  };

  const en = {
    title: "DeepSeek Questions",
    subtitle:
      "Explore profound questions about faith, life, and spirituality",
    all: "All Questions",
    searchPlaceholder: "Search questions...",
    favoriteLabel: "Favorites",
    statsQuestions: "Questions",
    statsCategories: "Categories",
    statsFavorites: "Favorites",
    noResultsTitle: "No questions found",
    noResultsText: "Try adjusting your search or filter criteria",
    clearFilters: "Clear All Filters",
    noFavoritesTitle: "No favorites yet",
    noFavoritesText:
      "Tap the heart on a question to keep it here for later.",
    activeFilters: "Active filters",
  };
  const it = {
    title: "Domande DeepSeek",
    subtitle: "Esplora domande profonde su fede, vita e spiritualità",
    all: "Tutte le Domande",
    searchPlaceholder: "Cerca domande...",
    favoriteLabel: "Preferiti",
    statsQuestions: "Domande",
    statsCategories: "Categorie",
    statsFavorites: "Preferiti",
    noResultsTitle: "Nessuna domanda trovata",
    noResultsText: "Prova a modificare i criteri di ricerca o filtro",
    clearFilters: "Pulisci Filtri",
    noFavoritesTitle: "Nessun preferito",
    noFavoritesText:
      "Tocca il cuore su una domanda per conservarla qui per dopo.",
    activeFilters: "Filtri attivi",
  };
  const t = language === "en" ? en : it;

  return (
    <div className={`deep-seek-page ${isDarkMode ? "dark" : "light"}`}>
      <Header />

      <div className="deep-seek-container">
        {/* Hero */}
        <section className="ds-hero">
          <span className="ds-hero-blob blob-a" aria-hidden="true" />
          <span className="ds-hero-blob blob-b" aria-hidden="true" />
          <div className="ds-hero-icon">
            <FaBrain />
          </div>
          <h1 className="ds-hero-title">{t.title}</h1>
          <p className="ds-hero-subtitle">{t.subtitle}</p>
          <div className="ds-hero-scribbles" aria-hidden="true" />
        </section>

        {/* Toolbar */}
        <section className="ds-toolbar">
          <div className="ds-search-box">
            <FaSearch className="ds-search-icon" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => changeSearch(e.target.value)}
              className="ds-search-input"
              aria-label={t.searchPlaceholder}
            />
            {searchTerm && (
              <button
                className="ds-search-clear"
                onClick={() => changeSearch("")}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="ds-chips">
            <button
              className={`ds-chip ${!selectedCategory && !searchTerm && !showFavorites ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(null);
                setSearchTerm("");
                setShowFavorites(false);
              }}
            >
              <FaSeedling />
              <span>{t.all}</span>
            </button>

            {categoryCounts.map((cat) => (
              <button
                key={cat.label}
                className={`ds-chip ${selectedCategory === cat.label ? "active" : ""}`}
                onClick={() => selectCategory(cat.label)}
              >
                <FaQuestionCircle />
                <span>{cat.label}</span>
                <span className="ds-chip-count">{cat.count}</span>
              </button>
            ))}

            <button
              className={`ds-chip ds-chip-fav ${showFavorites ? "active" : ""}`}
              onClick={() => setShowFavorites((v) => !v)}
            >
              <FaHeart />
              <span>{t.favoriteLabel}</span>
              <span className="ds-chip-count">{favoriteQuestions.length}</span>
            </button>
          </div>

          {/* Active filters */}
          {(selectedCategory || searchTerm) && (
            <div className="ds-active-filters">
              {selectedCategory && (
                <span className="ds-filter-tag">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    aria-label="Remove category"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="ds-filter-tag">
                  “{searchTerm}”
                  <button
                    onClick={() => changeSearch("")}
                    aria-label="Remove search"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              <button className="ds-clear-all" onClick={clearFilters}>
                <FaFilter /> {t.clearFilters}
              </button>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="ds-stats">
          <div className="ds-stat">
            <span className="ds-stat-value">{displayedCount}</span>
            <span className="ds-stat-label">{t.statsQuestions}</span>
          </div>
          <div className="ds-stat">
            <span className="ds-stat-value">{categories.length}</span>
            <span className="ds-stat-label">{t.statsCategories}</span>
          </div>
          <div className="ds-stat">
            <span className="ds-stat-value">{favorites.size}</span>
            <span className="ds-stat-label">{t.statsFavorites}</span>
          </div>
        </section>

        {/* Questions */}
        {showFavorites && favoriteQuestions.length === 0 ? (
          <div className="ds-empty">
            <FaHeart className="ds-empty-icon" />
            <h3>{t.noFavoritesTitle}</h3>
            <p>{t.noFavoritesText}</p>
          </div>
        ) : displayedGroups.length > 0 ? (
          <div className="ds-groups">
            {displayedGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="ds-group">
                <h2 className="ds-group-title">
                  {showFavorites ? <FaHeart /> : <FaQuestionCircle />}
                  <span>{group.topic[language]}</span>
                  <span className="ds-group-count">
                    {group.questions.length}
                  </span>
                </h2>
                <div className="ds-grid">
                  {group.questions.map((question, questionIndex) => (
                    <QuestionCard
                      key={`${group.topic[language]}-${questionIndex}`}
                      question={question[language]}
                      category={group.topic[language]}
                      isFavorite={favorites.has(
                        `${group.topic[language]}-${questionIndex}`
                      )}
                      onToggleFavorite={() =>
                        toggleFavorite(
                          group.topic[language],
                          questionIndex
                        )
                      }
                      language={language}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ds-empty">
            <FaSearch className="ds-empty-icon" />
            <h3>{t.noResultsTitle}</h3>
            <p>{t.noResultsText}</p>
            <button className="ds-clear-all big" onClick={clearFilters}>
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}