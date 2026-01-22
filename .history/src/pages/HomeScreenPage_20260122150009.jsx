import { useState, useEffect, useMemo } from "react";
import flowers from "../components/Flower";
import FlowerCard from "../components/FlowerCard.jsx";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { FaSeedling, FaFilter, FaRandom, FaArrowUp } from "react-icons/fa";
import "./HomeScreen.css";

export default function HomeScreenPage() {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [randomFlowerIndex, setRandomFlowerIndex] = useState(0);

  // Initialize random flower index on mount
  useEffect(() => {
    setRandomFlowerIndex(Math.floor(Math.random() * flowers.length));
  }, []);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoize the random flower
  const randomFlower = useMemo(() => {
    return flowers[randomFlowerIndex] || flowers[0];
  }, [randomFlowerIndex]);

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
  const filteredFlowers = flowers.filter((flower) => {
    if (activeFilter === "all") return true;
    if (["morning", "midday", "evening"].includes(activeFilter)) {
      return flower.DayTime[language].toLowerCase() === activeFilter;
    }
    return flower.description[language].toLowerCase().includes(activeFilter);
  });

  // Search filter
  const searchedFlowers = filteredFlowers.filter(
    (flower) =>
      flower.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
      flower.description[language]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Function to get a new random flower
  const getNewRandomFlower = () => {
    setRandomFlowerIndex(Math.floor(Math.random() * flowers.length));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-screen">
      <Header />

      {/* Parallax Background Layers */}
      <div className="background-layers">
        <div className="layer layer-1"></div>
        <div className="layer layer-2"></div>
        <div className="layer layer-3"></div>
      </div>

      <div className="home-content">
        {/* Hero Section with Glass Morphism */}
        <section className="hero-section">
          <div className="hero-glass">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  <span className="title-gradient">
                    {language === "en"
                      ? "Spiritual Garden"
                      : "Giardino Spirituale"}
                  </span>
                </h1>
                <p className="hero-subtitle">
                  {language === "en"
                    ? "Where prayers bloom like eternal flowers in the garden of the soul"
                    : "Dove le preghiere sbocciano come fiori eterni nel giardino dell'anima"}
                </p>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">{flowers.length}</span>
                    <span className="stat-label">
                      {language === "en" ? "Flowers" : "Fiori"}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">
                      {new Set(flowers.map((f) => f.DayTime[language])).size}
                    </span>
                    <span className="stat-label">
                      {language === "en" ? "Moments" : "Momenti"}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">∞</span>
                    <span className="stat-label">
                      {language === "en" ? "Blessings" : "Benedizioni"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hero-illustration">
                <div className="floating-flowers">
                  <div className="flower float-1">🌸</div>
                  <div className="flower float-2">🌹</div>
                  <div className="flower float-3">🌺</div>
                  <div className="flower float-4">🌼</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Flower Card */}
        <section className="featured-section">
          <div className="featured-glass">
            <div className="section-header">
              <div className="section-header-top">
                <FaSeedling className="section-icon" />
                <h2 className="section-title">
                  {language === "en"
                    ? "Flower of Inspiration"
                    : "Fiore dell'Ispirazione"}
                </h2>
              </div>
              <p className="section-subtitle">
                {language === "en"
                  ? "A randomly selected flower for your spiritual reflection"
                  : "Un fiore selezionato casualmente per la tua riflessione spirituale"}
              </p>
              <button
                className="refresh-random-btn"
                onClick={getNewRandomFlower}
                title={
                  language === "en"
                    ? "Get new random flower"
                    : "Ottieni un nuovo fiore casuale"
                }
              >
                <FaRandom /> {language === "en" ? "New Flower" : "Nuovo Fiore"}
              </button>
            </div>
            <div className="featured-flower-container">
              <FlowerCard
                flower={randomFlower}
                language={language}
                featured={true}
              />
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="filter-section">
          <div className="filter-glass">
            <div className="search-container">
              <input
                type="text"
                placeholder={
                  language === "en"
                    ? "Search flowers or prayers..."
                    : "Cerca fiori o preghiere..."
                }
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaFilter className="search-icon" />
            </div>
            <div className="filter-tabs">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-tab ${activeFilter === filter.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label[language]}
                </button>
              ))}
              <button
                className="filter-tab random-btn"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchTerm("");
                }}
              >
                <FaRandom /> {language === "en" ? "Reset" : "Reset"}
              </button>
            </div>
          </div>
        </section>

        {/* Flowers Grid with Glass Cards */}
        <section className="flowers-grid-section">
          <div className="grid-header">
            <h2 className="grid-title">
              {language === "en" ? "Sacred Flowers" : "Fiori Sacri"}
              <span className="flower-count">
                {searchedFlowers.length}{" "}
                {language === "en" ? "flowers" : "fiori"}
              </span>
            </h2>
            <p className="grid-subtitle">
              {language === "en"
                ? "Each flower carries a unique prayer intention"
                : "Ogni fiore porta un'intenzione di preghiera unica"}
            </p>
          </div>

          {/* Modern Glass Grid */}
          <div className="glass-grid">
            {searchedFlowers.length > 0 ? (
              searchedFlowers.map((flower, index) => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  language={language}
                  index={index}
                />
              ))
            ) : (
              <div className="empty-state-glass">
                <div className="empty-icon">🌱</div>
                <h3>
                  {language === "en"
                    ? "No flowers found"
                    : "Nessun fiore trovato"}
                </h3>
                <p>
                  {language === "en"
                    ? "Try a different search or filter"
                    : "Prova una ricerca o un filtro diverso"}
                </p>
              </div>
            )}
          </div>
        </section>

        
        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-glass">
            <h2>
              {language === "en"
                ? "Begin Your Prayer Journey Today"
                : "Inizia il Tuo Viaggio di Preghiera Oggi"}
            </h2>
            <p>
              {language === "en"
                ? "Select a flower, offer a prayer, and watch your spiritual garden bloom"
                : "Seleziona un fiore, offri una preghiera e guarda il tuo giardino spirituale fiorire"}
            </p>
            <button className="cta-button">
              {language === "en" ? "Start Praying" : "Inizia a Pregare"} 🙏
            </button>
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
