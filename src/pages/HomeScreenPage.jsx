import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import QuoteCard from "../components/QuoteCard.jsx";
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
  FaChevronDown,
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
      className={`landing-reveal ${visible ? "in-view" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomeScreenPage() {
  const { language } = useLanguage();

  const quotes = useMemo(() => getQuotes(), []);
  const prayers = useMemo(() => getAllPrayers(), []);

  // random prayer of the day
  const [prayerOfDay] = useState(() => {
    const idx = Math.floor(Math.random() * prayers.length);
    return prayers[idx];
  });

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
    eyebrow: language === "en" ? "Fiori Di Preghiera" : "Fiori Di Preghiera",
    welcome:
      language === "en"
        ? "Welcome to Your Spiritual Garden"
        : "Benvenuto nel Tuo Giardino Spirituale",
    subtitle:
      language === "en"
        ? "Where prayers bloom like eternal flowers and wisdom grows in the garden of the soul."
        : "Dove le preghiere sbocciano come fiori eterni e la saggezza cresce nel giardino dell'anima.",
    beginJourney:
      language === "en" ? "Begin Your Journey" : "Inizia il Tuo Viaggio",
    visitGarden:
      language === "en"
        ? "Visit the Flower Garden"
        : "Visita il Giardino dei Fiori",
    scrollDown:
      language === "en" ? "Scroll to wander" : "Scorri per esplorare",
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
    feastEyebrow:
      language === "en" ? "Celebrated Today" : "Celebrato Oggi",
    buonaFesta:
      language === "en" ? "Happy Feast Day!" : "Buona Festa!",
    feastHonours:
      language === "en"
        ? "The Church honours today:"
        : "La Chiesa onora oggi:",
    viewCalendar:
      language === "en" ? "View Feast Calendar" : "Vedi Calendario delle Feste",
    wikiInfo:
      language === "en" ? "Wikipedia" : "Wikipedia",
    newPrayer:
      language === "en" ? "Another Prayer" : "Un'Altra Preghiera",
    explorePrayers:
      language === "en"
        ? "Explore All Prayers"
        : "Esplora Tutte le Preghiere",
    explore: language === "en" ? "Explore" : "Esplora",
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

  const ctaCards = [
    {
      key: "garden",
      link: "/garden",
      icon: <FaSeedling />,
      title: t.cta.garden,
      desc: t.cta.gardenDesc,
    },
    {
      key: "prayers",
      link: "/prayers",
      icon: <FaBookOpen />,
      title: t.cta.prayers,
      desc: t.cta.prayersDesc,
    },
    {
      key: "quotes",
      link: "/quotes",
      icon: <FaQuoteRight />,
      title: t.cta.quotes,
      desc: t.cta.quotesDesc,
    },
    {
      key: "about",
      link: "/about",
      icon: <FaHeart />,
      title: t.cta.about,
      desc: t.cta.aboutDesc,
    },
  ];

  const ornament = (
    <div className="landing-ornament" aria-hidden="true">
      <span className="ornament-line" />
      <span className="ornament-fleur">❁</span>
      <span className="ornament-line" />
    </div>
  );

  return (
    <div className="home-screen">
      <Header />

      <div className="home-content landing">
        {/* Welcome hero */}
        <section className="hero-section landing-hero">
          <div className="hero-glass landing-hero-glass">
            <div className="hero-content landing-hero-content">
              <div className="hero-text">
                <Reveal>
                  <span className="landing-eyebrow">✦ {t.eyebrow} ✦</span>
                  <h1 className="title-gradient">{t.welcome}</h1>
                  <p className="hero-subtitle">{t.subtitle}</p>
                </Reveal>

                <Reveal delay={140}>
                  <div className="landing-hero-actions">
                    <Link
                      to="/quotes"
                      className="landing-cta-btn primary"
                    >
                      <FaQuoteRight /> {t.beginJourney}
                      <FaArrowRight />
                    </Link>
                    <Link
                      to="/garden"
                      className="landing-cta-btn ghost"
                    >
                      <FaSeedling /> {t.visitGarden}
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={280}>
                  <div className="hero-stats">
                    <div className="stat">
                      <span className="stat-number">{quotes.length}</span>
                      <span className="stat-label">
                        {language === "en" ? "Quotes" : "Citazioni"}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{prayers.length}</span>
                      <span className="stat-label">
                        {language === "en" ? "Prayers" : "Preghiere"}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">
                        {new Set(
                          quotes.map((q) =>
                            q.category === "Gratittude"
                              ? "Gratitude"
                              : q.category
                          )
                        ).size}
                      </span>
                      <span className="stat-label">
                        {language === "en" ? "Themes" : "Temi"}
                      </span>
                    </div>
                  </div>
                </Reveal>
              </div>
              <div className="hero-illustration landing-hero-illustration">
                <Reveal delay={200} className="landing-illustration">
                  <div className="landing-orb-glow" />
                  <div className="floating-flowers">
                    <div className="flower float-1">🌹</div>
                    <div className="flower float-2">🌼</div>
                    <div className="flower float-3">🌺</div>
                    <div className="flower float-4">🌸</div>
                  </div>
                  <span className="sparkle sparkle-1">✦</span>
                  <span className="sparkle sparkle-2">✦</span>
                  <span className="sparkle sparkle-3">✦</span>
                </Reveal>
              </div>
            </div>
            <div className="landing-scroll-wrap">
              <div className="landing-scroll-chip">
                <span>{t.scrollDown}</span>
                <FaChevronDown />
              </div>
            </div>
          </div>
        </section>

        {/* Feast of the day */}
        {feastsToday.length > 0 && (
          <section className="landing-section">
            <Reveal>
              <div className="feast-today-hero glass">
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

        {/* Quote of the day */}
        <section className="landing-section">
          <Reveal>
            <div className="landing-section-header">
              {ornament}
              <FaQuoteRight className="section-icon" />
              <h2 className="landing-section-title">{t.quoteOfDay}</h2>
              <p className="landing-section-hint">{t.quoteOfDayHint}</p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="landing-quote">
              <QuoteCard />
            </div>
            <div className="landing-section-cta">
              <Link to="/quotes" className="landing-link-btn">
                {t.explore} {t.cta.quotes} <FaArrowRight />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* Prayer of the day */}
        <section className="landing-section">
          <Reveal>
            <div className="landing-section-header">
              {ornament}
              <FaPrayingHands className="section-icon" />
              <h2 className="landing-section-title">{t.prayerOfDay}</h2>
              <p className="landing-section-hint">{t.prayerOfDayHint}</p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="landing-prayer glass" key={prayerOfDay.author}>
              <div className="landing-prayer-title">
                {language === "it" && prayerOfDay.italianAuthor
                  ? prayerOfDay.italianAuthor
                  : prayerOfDay.author}
              </div>
              <p className="landing-prayer-text">
                {language === "en" ? prayerOfDay.prayer : prayerOfDay.italianPrayer}
              </p>
              <div className="landing-prayer-foot">
                <span className="landing-prayer-origin">
                  {language === "en" ? prayerOfDay.quote : prayerOfDay.italianQuote}
                </span>
              </div>
              <Link
                to="/prayers"
                className="landing-link-btn landing-prayer-new"
              >
                <FaBookOpen /> {t.explorePrayers}
                <FaArrowRight />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* CTA cards */}
        <section className="landing-section">
          <Reveal>
            <div className="cta-cards">
              {ctaCards.map((card, idx) => (
                <Link
                  key={card.key}
                  to={card.link}
                  className="cta-card glass"
                >
                  <span className="cta-card-num">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="cta-card-icon">{card.icon}</span>
                  <span className="cta-card-title">{card.title}</span>
                  <span className="cta-card-desc">{card.desc}</span>
                  <span className="cta-card-arrow">
                    <FaArrowRight />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Footer flourish */}
        <footer className="landing-footer">
          {ornament}
          <p>{t.footerBlessing}</p>
        </footer>
      </div>
    </div>
  );
}