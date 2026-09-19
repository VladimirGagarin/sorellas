// pages/GardenPage.jsx — Sacred Flowers garden
import { useState, useEffect, useMemo } from "react";
import flowers from "../components/Flower";
import FlowerCard from "../components/FlowerCard.jsx";
import Header from "../components/Header.jsx";
import PrayerOverlay from "../components/PrayerOverlay.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { FaArrowUp, FaSearch } from "react-icons/fa";
import "./GardenPage.css";

export default function GardenPage() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filters
  const filters = [
    { id: "all", label: { en: "All Flowers", it: "Tutti i Fiori" } },
    { id: "morning", label: { en: "Morning", it: "Mattina" } },
    { id: "midday", label: { en: "Midday", it: "Mezzogiorno" } },
    { id: "evening", label: { en: "Evening", it: "Sera" } },
    { id: "gratitude", label: { en: "Gratitude", it: "Gratitudine" } },
    { id: "healing", label: { en: "Healing", it: "Guarigione" } },
    { id: "love", label: { en: "Love", it: "Amore" } },
  ];

  // Filter flowers
  const filteredFlowers = useMemo(
    () =>
      flowers.filter((flower) => {
        if (activeFilter === "all") return true;
        if (["morning", "midday", "evening"].includes(activeFilter)) {
          return flower.DayTime[language].toLowerCase() === activeFilter;
        }
        return flower.description[language]
          .toLowerCase()
          .includes(activeFilter);
      }),
    [activeFilter, language]
  );

  // Search filter
  const visibleFlowers = filteredFlowers.filter(
    (flower) =>
      flower.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      flower.description[language]
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const resetFilters = () => {
    setActiveFilter("all");
    setSearchTerm("");
  };

  const moments = new Set(flowers.map((f) => f.DayTime[language])).size;

  const t = {
    eyebrow: language === "en" ? "Sacred Flowers" : "Fiori Sacri",
    title:
      language === "en" ? "The Spiritual Garden" : "Il Giardino Spirituale",
    subtitle:
      language === "en"
        ? "Where every flower holds a prayer and every petal a blessing — wander, reflect, and offer your heart."
        : "Dove ogni fiore custodisce una preghiera e ogni petalo una benedizione — vagabonda, rifletti e offri il tuo cuore.",
    statFlowers: language === "en" ? "Flowers" : "Fiori",
    statMoments: language === "en" ? "Moments" : "Momenti",
    statBlessings: language === "en" ? "Blessings" : "Benedizioni",
    search:
      language === "en"
        ? "Search flowers or prayers..."
        : "Cerca fiori o preghiere...",
    gridEyebrow:
      language === "en" ? "Choose your flower" : "Scegli il tuo fiore",
    gridTitle:
      language === "en" ? "Sacred Flowers" : "Fiori Sacri",
    gridSubtitle:
      language === "en"
        ? "Each flower carries a unique prayer intention"
        : "Ogni fiore porta un'intenzione di preghiera unica",
    flowerCount: language === "en" ? "flowers" : "fiori",
    emptyTitle:
      language === "en" ? "No flowers found" : "Nessun fiore trovato",
    emptyHint:
      language === "en"
        ? "Try a different search or filter"
        : "Prova una ricerca o un filtro diverso",
    reset: language === "en" ? "Reset Filters" : "Azzera Filtri",
    scrollTop: language === "en" ? "Back to top" : "Torna su",
    footer:
      language === "en"
        ? "May your garden grow in grace."
        : "Che il tuo giardino cresca nella grazia.",
  };

  const ornament = (
    <div className="garden-ornament" aria-hidden="true">
      <span className="ornament-line" />
      <span className="ornament-fleur">❁</span>
      <span className="ornament-line" />
    </div>
  );

  return (
    <div className="garden-screen">
      <Header />

      {/* Prayer Overlay */}
      <PrayerOverlay flowers={flowers} language={language} />

      <main className="garden-main">
        {/* ===== Hero ===== */}
        <section className="garden-hero">
          <span className="garden-eyebrow">✦ {t.eyebrow} ✦</span>
          <h1 className="garden-title">{t.title}</h1>
          <p className="garden-subtitle">{t.subtitle}</p>

          <div className="garden-hero-stats">
            <div className="garden-stat">
              <span className="garden-stat-num">{flowers.length}+</span>
              <span className="garden-stat-label">{t.statFlowers}</span>
            </div>
            <div className="garden-stat">
              <span className="garden-stat-num">{moments}+</span>
              <span className="garden-stat-label">{t.statMoments}</span>
            </div>
            <div className="garden-stat">
              <span className="garden-stat-num">∞</span>
              <span className="garden-stat-label">{t.statBlessings}</span>
            </div>
          </div>
        </section>

        {/* ===== Search & Filter ===== */}
        <section className="garden-panel">
          {ornament}
          <div className="garden-search-wrap">
            <FaSearch className="garden-search-icon" />
            <input
              type="text"
              className="garden-search"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="garden-chips">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`garden-chip ${
                  activeFilter === filter.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setSearchTerm("");
                }}
              >
                {filter.label[language]}
              </button>
            ))}
          </div>
        </section>

        {/* ===== Flowers Grid ===== */}
        <section className="garden-grid-section">
          <div className="garden-grid-head">
            {ornament}
            <span className="garden-eyebrow-sm">{t.gridEyebrow}</span>
            <h2 className="garden-grid-title">{t.gridTitle}</h2>
            <p className="garden-grid-subtitle">{t.gridSubtitle}</p>
            <span className="garden-count-pill">
              {visibleFlowers.length} {t.flowerCount}
            </span>
          </div>

          {visibleFlowers.length > 0 ? (
            <div className="garden-grid">
              {visibleFlowers.map((flower) => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="garden-empty">
              <span className="garden-empty-icon">🌱</span>
              <h3>{t.emptyTitle}</h3>
              <p>{t.emptyHint}</p>
              <button className="garden-chip active" onClick={resetFilters}>
                {t.reset}
              </button>
            </div>
          )}
        </section>

        {/* ===== Footer flourish ===== */}
        <footer className="garden-footer">
          {ornament}
          <p>{t.footer}</p>
        </footer>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className="garden-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t.scrollTop}
          title={t.scrollTop}
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}