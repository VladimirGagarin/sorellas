import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import QuoteCard from "../components/QuoteCard.jsx";
import flowers from "../components/Flower";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  getQuotes,
  getAllPrayers,
  getFeastsOnDate,
  getWikipediaUrl,
} from "../components/Utils.js";
import confetti from "canvas-confetti";
import {
  FaSeedling,
  FaBookOpen,
  FaQuoteRight,
  FaHeart,
  FaArrowRight,
  FaPrayingHands,
  FaChurch,
  FaExternalLinkAlt,
  FaCalendarDay,
} from "react-icons/fa";
import "./HomeScreen.css";

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`home-reveal ${visible ? "in-view" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CountUp({ end, suffix = "", duration = 900 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(end * eased));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="home-stat-num">
      {value}
      {suffix}
    </span>
  );
}

export default function HomeScreenPage() {
  const { language } = useLanguage();

  const quotes = useMemo(() => getQuotes(), []);
  const prayers = useMemo(() => getAllPrayers(), []);

  const themeCount = new Set(
    quotes.map((q) => (q.category === "Gratittude" ? "Gratitude" : q.category))
  ).size;

  // random prayer of the day
  const [prayerOfDay] = useState(() => {
    const idx = Math.floor(Math.random() * prayers.length);
    return prayers[idx];
  });

  // random featured quote & flower for the CTA cards
  const [featQuote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  const [featFlower] = useState(
    () => flowers[Math.floor(Math.random() * flowers.length)]
  );

  // feasts celebrated today (MM-DD match across present year)
  const feastsToday = useMemo(() => getFeastsOnDate(new Date()), []);

  useEffect(() => {
    if (feastsToday.length === 0) return () => {};
    const colors = ["#3E7A43", "#3F7A55", "#4A7A44", "#A8E0A0", "#7FAE6E"];
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
    const end = Date.now() + 1800;
    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { x: Math.random(), y: 0.6 },
        colors,
      });
      if (Date.now() > end) {
        clearInterval(interval);
      }
    }, 260);
    return () => clearInterval(interval);
  }, [feastsToday.length]);

  const t = {
    eyebrow: "Fiori Di Preghiera",
    welcome:
      language === "en"
        ? "Welcome to Your Spiritual Garden"
        : "Benvenuto nel Tuo Giardino Spirituale",
    subtitle:
      language === "en"
        ? "Catholic Prayers, Marian Devotions, Inspirational Quotes, and Spiritual Reflections in English & Italian"
        : "Preghiere Cattoliche, Devozioni Mariane, Citazioni Ispirative e Riflessioni Spirituali in Inglese e in Italiano.",
    beginJourney:
      language === "en" ? "Begin Your Journey" : "Inizia il Tuo Viaggio",
    visitGarden:
      language === "en"
        ? "Visit the Flower Garden"
        : "Visita il Giardino dei Fiori",
    statQuotes: language === "en" ? "Quotes" : "Citazioni",
    statFlowers: language === "en" ? "Flowers" : "Fiori",
    statPrayers: language === "en" ? "Prayers" : "Preghiere",
    statThemes: language === "en" ? "Themes" : "Temi",
    quoteOfDay:
      language === "en" ? "Quote of the Day" : "Citazione del Giorno",
    quoteOfDayHint:
      language === "en"
        ? "A flower of wisdom picked for you"
        : "Un fiore di saggezza scelto per te",
    prayerOfDay:
      language === "en" ? "Prayer of the Day" : "Preghiera del Giorno",
    prayerOfDayHint:
      language === "en"
        ? "A sacred prayer for your reflection"
        : "Una preghiera sacra per la tua riflessione",
    explorePrayers:
      language === "en"
        ? "Explore All Prayers"
        : "Esplora Tutte le Preghiere",
    flowerOfToday:
      language === "en" ? "Flower for Today" : "Fiore per Oggi",
    flowerOfTodayHint:
      language === "en"
        ? "A flower chosen for your day"
        : "Un fiore scelto per la tua giornata",
    flowerMeaning: language === "en" ? "Symbolizes" : "Simbolo di",
    visitFlower:
      language === "en"
        ? "Visit the Garden"
        : "Visita il Giardino",
    feastEyebrow:
      language === "en" ? "Celebrated Today" : "Celebrato Oggi",
    buonaFesta:
      language === "en" ? "Happy Feast Day!" : "Buona Festa!",
    feastHonours:
      language === "en"
        ? "The Church honours today:"
        : "La Chiesa onora oggi:",
    viewCalendar:
      language === "en"
        ? "View Feast Calendar"
        : "Vedi Calendario delle Feste",
    wikiInfo: "Wikipedia",
    explore: language === "en" ? "Explore" : "Esplora",
    exploreTitle:
      language === "en"
        ? "Explore the Garden"
        : "Esplora il Giardino",
    exploreHint:
      language === "en"
        ? "Wander through every path of this spiritual garden"
        : "Vagabonda per ogni sentiero di questo giardino spirituale",
    footerBlessing:
      language === "en"
        ? "May your garden grow in grace."
        : "Che il tuo giardino cresca nella grazia.",
    cta: {
      garden: language === "en" ? "The Flower Garden" : "Il Giardino dei Fiori",
      gardenDesc:
        language === "en"
          ? "Browse sacred flowers and their prayers"
          : "Sfoglia i fiori sacri e le loro preghiere",
      prayers: language === "en" ? "Prayer Journal" : "Diario di Preghiera",
      prayersDesc:
        language === "en"
          ? "Collect your favourite prayers"
          : "Raccogli le tue preghiere preferite",
      quotes: language === "en" ? "Garden of Quotes" : "Giardino delle Citazioni",
      quotesDesc:
        language === "en"
          ? "Wander through 25 wisdom themes"
          : "Vagabonda tra 25 temi di saggezza",
      about: language === "en" ? "Why Here?" : "Perché Qui?",
      aboutDesc:
        language === "en"
          ? "The story behind this garden"
          : "La storia dietro questo giardino",
    },
  };

  const ornament = (
    <div className="home-ornament" aria-hidden="true">
      <span className="ornament-line" />
      <span className="ornament-fleur">❁</span>
      <span className="ornament-line" />
    </div>
  );

  const sectionHead = (eyebrow, title, hint) => (
    <div className="home-section-head">
      {ornament}
      <span className="home-section-eyebrow">{eyebrow}</span>
      {title && <h2 className="home-section-title">{title}</h2>}
      <p className="home-section-hint">{hint}</p>
    </div>
  );

  return (
    <div className="home-screen">
      <Header />

      <main className="home-main">
        {/* ===== Hero ===== */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <Reveal>
              <span className="home-eyebrow">✦ {t.eyebrow} ✦</span>
              <h1 className="home-title">{t.welcome}</h1>
              <p className="home-subtitle">{t.subtitle}</p>
            </Reveal>

            <Reveal delay={130}>
              <div className="home-hero-actions">
                <Link to="/prayers" className="home-btn primary">
                  <FaPrayingHands /> {t.beginJourney} <FaArrowRight />
                </Link>
                <Link to="/garden" className="home-btn ghost">
                  <FaSeedling /> {t.visitGarden}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="home-hero-stats">
                <div className="home-stat">
                  <CountUp end={quotes.length} suffix="+" />
                  <span className="home-stat-label">{t.statQuotes}</span>
                </div>
                <div className="home-stat">
                  <CountUp end={flowers.length} suffix="+" />
                  <span className="home-stat-label">{t.statFlowers}</span>
                </div>
                <div className="home-stat">
                  <CountUp end={prayers.length} suffix="+" />
                  <span className="home-stat-label">{t.statPrayers}</span>
                </div>
                <div className="home-stat">
                  <CountUp end={themeCount} suffix="+" />
                  <span className="home-stat-label">{t.statThemes}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== Feast of the day ===== */}
        {feastsToday.length > 0 && (
          <section className="home-section">
            <Reveal>
              <div className="feast-today-hero">
                <div className="feast-today-brand">
                  <FaChurch />
                </div>
                <div className="feast-today-body">
                  <span className="feast-today-eyebrow">
                    ✦ {t.feastEyebrow} ✦
                  </span>
                  <h2 className="feast-today-title">{t.buonaFesta}</h2>
                  <p className="feast-today-honours">{t.feastHonours}</p>
                  <div className="feast-today-names">
                    {feastsToday.map((feast, i) => (
                      <a
                        key={`${feast.en}-${i}`}
                        href={getWikipediaUrl(feast.en, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="feast-today-name"
                        title={t.wikiInfo}
                      >
                        {language === "en" ? feast.en : feast.it}
                        <FaExternalLinkAlt className="feast-today-name-icon" />
                      </a>
                    ))}
                  </div>
                  <div className="feast-today-actions">
                    <Link to="/feasts" className="feast-today-btn primary">
                      <FaCalendarDay /> {t.viewCalendar} <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* ===== Quote & Prayer of the day ===== */}
        <section className="home-section">
          <div className="home-grid-2">
            <Reveal className="home-col">
              <div className="home-section-head">
                {ornament}
                <span className="home-section-eyebrow">{t.quoteOfDay}</span>
                <p className="home-section-hint">{t.quoteOfDayHint}</p>
              </div>
              <QuoteCard />
            </Reveal>

            <Reveal delay={130} className="home-col">
              <div className="home-section-head">
                {ornament}
                <span className="home-section-eyebrow">{t.prayerOfDay}</span>
                <p className="home-section-hint">{t.prayerOfDayHint}</p>
              </div>
              <div className="home-prayer-card" key={prayerOfDay.author}>
                  <span className="home-prayer-title">
                    {language === "it" && prayerOfDay.italianAuthor
                      ? prayerOfDay.italianAuthor
                      : prayerOfDay.author}
                  </span>
                  <p className="home-prayer-text">
                    {language === "en"
                      ? prayerOfDay.prayer
                      : prayerOfDay.italianPrayer}
                  </p>
                  <span className="home-prayer-origin">
                    {language === "en"
                      ? prayerOfDay.quote
                      : prayerOfDay.italianQuote}
                  </span>
                  <Link to="/prayers" className="home-card-btn">
                    <FaBookOpen /> {t.explorePrayers} <FaArrowRight />
                  </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===== Flower of the day ===== */}
        <section className="home-section">
          <Reveal>
            {sectionHead(t.flowerOfToday, null, t.flowerOfTodayHint)}
          </Reveal>
          <Reveal delay={130}>
            <Link to="/garden" className="flower-feature">
              <img
                src={featFlower.image}
                alt={featFlower.name[language]}
                className="flower-feature-img"
              />
              <div className="flower-feature-body">
                <span className="flower-feature-tag">{t.flowerMeaning}</span>
                <span className="flower-feature-name">
                  {featFlower.name[language]}
                </span>
                <p className="flower-feature-desc">
                  {featFlower.description[language].replace(
                    /^(Symbol of|Symbolizes|Represents|Un fiore di|Simbolo di|Rappresenta)\s*/i,
                    ""
                  )}
                </p>
              </div>
              <span className="flower-feature-btn">
                {t.visitFlower} <FaArrowRight />
              </span>
            </Link>
          </Reveal>
        </section>

        {/* ===== Explore the garden ===== */}
        <section className="home-section">
          <Reveal>{sectionHead(t.exploreTitle, null, t.exploreHint)}</Reveal>
          <Reveal delay={120}>
            <div className="home-cards">
              <Link to="/garden" className="home-card">
                <span className="home-card-icon">
                  <FaSeedling />
                </span>
                <h3 className="home-card-title">{t.cta.garden}</h3>
                <p className="home-card-desc">{t.cta.gardenDesc}</p>
                <span className="home-card-note">
                  {featFlower.name[language]}
                </span>
                <span className="home-card-btn">
                  {t.explore} <FaArrowRight />
                </span>
              </Link>

              <Link to="/prayers" className="home-card">
                <span className="home-card-icon">
                  <FaPrayingHands />
                </span>
                <h3 className="home-card-title">{t.cta.prayers}</h3>
                <p className="home-card-desc">{t.cta.prayersDesc}</p>
                <span className="home-card-note">
                  {language === "en"
                    ? prayerOfDay.prayer
                    : prayerOfDay.italianPrayer}
                </span>
                <span className="home-card-btn">
                  {t.explore} <FaArrowRight />
                </span>
              </Link>

              <Link to="/quotes" className="home-card">
                <span className="home-card-icon">
                  <FaQuoteRight />
                </span>
                <h3 className="home-card-title">{t.cta.quotes}</h3>
                <p className="home-card-desc">{t.cta.quotesDesc}</p>
                <span className="home-card-note">
                  {language === "en"
                    ? featQuote.quote
                    : featQuote.italianQuote}
                </span>
                <span className="home-card-btn">
                  {t.explore} <FaArrowRight />
                </span>
              </Link>

              <Link to="/about" className="home-card">
                <span className="home-card-icon">
                  <FaHeart />
                </span>
                <h3 className="home-card-title">{t.cta.about}</h3>
                <p className="home-card-desc">{t.cta.aboutDesc}</p>
                <span className="home-card-btn">
                  {t.explore} <FaArrowRight />
                </span>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ===== Footer flourish ===== */}
        <footer className="home-footer">
          {ornament}
          <p>{t.footerBlessing}</p>
        </footer>
      </main>
    </div>
  );
}