// pages/GardenPage.jsx — Sacred Flowers garden
import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import flowers from "../components/Flower";
import FlowerCard from "../components/FlowerCard.jsx";
import Header from "../components/Header.jsx";
import PrayerOverlay from "../components/PrayerOverlay.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  getFamousPrayers,
  getAllPrayers,
  resolvePrayerPhoto,
} from "../components/Utils.js";
import {
  FaArrowUp,
  FaArrowRight,
  FaBookOpen,
  FaPrayingHands,
  FaQuoteLeft,
  FaSearch,
} from "react-icons/fa";
import "./GardenPage.css";

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function pickRandomSrPrayer() {
  const famous = getFamousPrayers();
  const sisters = famous.filter((p) =>
    /^sr[\s.]/i.test(String(p.author || ""))
  );
  const pick = sisters[Math.floor(Math.random() * sisters.length)] || null;
  if (!pick) return null;
  const all = getAllPrayers();
  const idx = all.findIndex(
    (p) => p.author === pick.author && p.prayer === pick.prayer
  );
  return { prayer: pick, idx: idx === -1 ? null : idx };
}

function SrAvatar({ author, photo }) {
  const [photoUrl, setPhotoUrl] = useState(undefined);

  useEffect(() => {
    let active = true;
    const loader = photo ? resolvePrayerPhoto(photo) : null;
    if (loader) {
      loader()
        .then((mod) => active && setPhotoUrl(mod.default || mod))
        .catch(() => active && setPhotoUrl(null));
    } else {
      Promise.resolve().then(() => active && setPhotoUrl(null));
    }
    return () => {
      active = false;
    };
  }, [photo]);

  if (photoUrl) {
    return <img className="gp-avatar" src={photoUrl} alt={author} />;
  }
  return (
    <span className="gp-avatar gp-avatar-mono" aria-hidden="true">
      {getInitials(author)}
    </span>
  );
}

function SrPrayerCard({ prayer, idx, t }) {
  const { language } = useLanguage();
  const tiltRef = useRef(null);
  const frameRef = useRef(null);

  const canTilt = useMemo(
    () =>
      typeof window !== "undefined" &&
      Boolean(
        window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches
      ) &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  const rotateCard = (e) => {
    if (!canTilt || !tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = tiltRef.current;
      if (!el) return;
      el.style.setProperty("--rx", `${((0.5 - py) * 8).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * 10).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    });
  };

  const flushTilt = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "35%");
  };

  const prayerText = language === "en" ? prayer.prayer : prayer.italianPrayer;
  const quote = language === "en" ? prayer.quote : prayer.italianQuote;
  const excerpt =
    prayerText.length > 340 ? `${prayerText.slice(0, 340).trimEnd()}…` : prayerText;

  return (
    <div className="gp-wrap">
      <div
        className="gp-tilt"
        ref={tiltRef}
        onMouseMove={rotateCard}
        onMouseLeave={flushTilt}
      >
        <span className="gp-glare" aria-hidden="true" />
        <article className="gp-card">
          <div className="gp-top">
            <SrAvatar author={prayer.author} photo={prayer.photo} />
            <div className="gp-meta">
              <span className="gp-eyebrow-sm">{t.prayerCardEyebrow}</span>
              <h3 className="gp-name">{prayer.author}</h3>
              <span className="gp-grace">
                <FaPrayingHands /> Aeternum Floreamus
              </span>
            </div>
          </div>

          {quote && (
            <blockquote className="gp-quote">
              <FaQuoteLeft className="gp-quote-mark" />
              <p>{quote}</p>
            </blockquote>
          )}

          <p className="gp-text">{excerpt}</p>

          <div className="gp-actions">
            <Link to={`/prayer/${idx}`} className="gp-btn gp-btn-primary">
              <FaBookOpen /> {t.prayThis}
              <FaArrowRight className="gp-btn-arrow" />
            </Link>
            <Link to="/prayers" className="gp-btn">
              {t.openGarden}
            </Link>
          </div>

          <span className="gp-mark" aria-hidden="true">
            Aeternum Floreamus
          </span>
        </article>
      </div>
    </div>
  );
}

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

  // A random Sister from the famous-prayers collection, whose prayer opens
  // straight into the PrayerPage. Picked once per visit.
  const srTeaser = useMemo(() => pickRandomSrPrayer(), []);

  const t = {
    eyebrow: language === "en" ? "Sacred Flowers" : "Fiori Sacri",
    title:
      language === "en" ? "The Spiritual Garden" : "Il Giardino Spirituale",
    subtitle:
      language === "en"
        ? "Where every flower holds a prayer and every petal a blessing — wander, reflect, and offer your heart."
        : "Dove ogni fiore custodisce una preghiera e ogni petalo una benedizione — vagabonda, rifletti e offri il tuo cuore.",
    intro:
      language === "en"
        ? `Welcome to Flowers of Prayer, a spiritual garden where each flower carries a prayer intention and symbolic meaning. Explore reflections on gratitude, healing, hope, faith, and love through ${flowers.length} sacred flowers inspired by Christian spirituality.`
        : `Benvenuti in Fiori di Preghiera, un giardino spirituale dove ogni fiore porta con sé un'intenzione di preghiera e un significato simbolico. Esplora riflessioni su gratitudine, guarigione, speranza, fede e amore attraverso ${flowers.length} fiori sacri ispirati alla spiritualità cristiana.`,
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
    prayerCardEyebrow:
      language === "en" ? "A Sister's Prayer" : "Preghiera di una Suora",
    prayerCardTitle:
      language === "en"
        ? "More Prayers from Our Sisters"
        : "Altre Preghiere delle Nostre Suore",
    prayerCardSubtitle:
      language === "en"
        ? "Every flower in this garden carries a prayer — and every sister carries one in her heart. Meet one of them, then wander the whole Garden of Prayers."
        : "Ogni fiore di questo giardino porta una preghiera — e ogni suora ne porta una nel cuore. Incontrane una, poi passeggia per tutto il Giardino delle Preghiere.",
    prayThis:
      language === "en" ? "Read this prayer" : "Leggi questa preghiera",
    openGarden:
      language === "en"
        ? "Open the Garden of Prayers"
        : "Apri il Giardino delle Preghiere",
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

        {/* ===== SEO intro ===== */}
        <section className="garden-intro" aria-label={t.eyebrow}>
          {ornament}
          <p className="garden-intro-text">{t.intro}</p>
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

        {/* ===== A sister's prayer ===== */}
        <section className="gp-section">
          <div className="garden-grid-head">
            {ornament}
            <span className="garden-eyebrow-sm">{t.prayerCardEyebrow}</span>
            <h2 className="garden-grid-title">{t.prayerCardTitle}</h2>
            <p className="garden-grid-subtitle">{t.prayerCardSubtitle}</p>
          </div>
          {srTeaser && srTeaser.idx !== null && (
            <SrPrayerCard prayer={srTeaser.prayer} idx={srTeaser.idx} t={t} />
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