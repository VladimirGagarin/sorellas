// pages/QuotesPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { getQuotes, resolvePrayerPhoto } from "../components/Utils.js";
import {
  FaAnchor,
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaChurch,
  FaCompass,
  FaCross,
  FaDonate,
  FaDove,
  FaFeatherAlt,
  FaFire,
  FaGem,
  FaHandHoldingHeart,
  FaHandshake,
  FaHandsHelping,
  FaHeart,
  FaHeartbeat,
  FaHourglassHalf,
  FaLeaf,
  FaLink,
  FaList,
  FaMountain,
  FaPray,
  FaPrayingHands,
  FaQuoteLeft,
  FaQuoteRight,
  FaRandom,
  FaSeedling,
  FaSmile,
  FaSpa,
  FaStar,
  FaSun,
  FaTimes,
  FaUserAlt,
  FaVolumeUp,
} from "react-icons/fa";
import "./QuotesPage.css";

const CATEGORY_LABELS = {
  Love: { en: "Love", it: "Amore" },
  Joy: { en: "Joy", it: "Gioia" },
  Peace: { en: "Peace", it: "Pace" },
  Patience: { en: "Patience", it: "Pazienza" },
  Kindness: { en: "Kindness", it: "Gentilezza" },
  Goodness: { en: "Goodness", it: "Bontà" },
  Faithfulness: { en: "Faithfulness", it: "Fedeltà" },
  Gentleness: { en: "Gentleness", it: "Mitezza" },
  "Self-control": { en: "Self-control", it: "Controllo di sé" },
  Understanding: { en: "Understanding", it: "Intelletto" },
  "Counsel (Right Judgment)": { en: "Counsel", it: "Consiglio" },
  "Fortitude (Courage)": { en: "Fortitude", it: "Fortezza" },
  "Piety (Reverence)": { en: "Piety", it: "Pietà" },
  "Fear of the Lord (Wonder and Awe)": {
    en: "Fear of the Lord",
    it: "Timor di Dio",
  },
  Trust: { en: "Trust", it: "Fiducia" },
  "Prayer and Meditation": {
    en: "Prayer & Meditation",
    it: "Preghiera e Meditazione",
  },
  Compassion: { en: "Compassion", it: "Compassione" },
  "Hope and Perseverance": {
    en: "Hope & Perseverance",
    it: "Speranza e Perseveranza",
  },
  Charity: { en: "Charity", it: "Carità" },
  Forgiveness: { en: "Forgiveness", it: "Perdono" },
  Wisdom: { en: "Wisdom", it: "Saggezza" },
  "Spiritual Growth": { en: "Spiritual Growth", it: "Crescita Spirituale" },
  Humility: { en: "Humility", it: "Umiltà" },
  Gratitude: { en: "Gratitude", it: "Gratitudine" },
  Gratittude: { en: "Gratitude", it: "Gratitudine" },
  Latin: { en: "Latin", it: "Latino" },
};

// Normalize the mis-spelled "Gratittude" category into "Gratitude".
const normalizeCategory = (cat) => (cat === "Gratittude" ? "Gratitude" : cat);

const THEME_ICONS = {
  Love: FaHeart,
  Joy: FaSun,
  Peace: FaDove,
  Patience: FaHourglassHalf,
  Kindness: FaHandHoldingHeart,
  Goodness: FaStar,
  Faithfulness: FaAnchor,
  Gentleness: FaFeatherAlt,
  "Self-control": FaGem,
  Understanding: FaBookOpen,
  "Counsel (Right Judgment)": FaCompass,
  "Fortitude (Courage)": FaFire,
  "Piety (Reverence)": FaPrayingHands,
  "Fear of the Lord (Wonder and Awe)": FaCross,
  Trust: FaHandshake,
  "Prayer and Meditation": FaPray,
  Compassion: FaHandsHelping,
  "Hope and Perseverance": FaMountain,
  Charity: FaDonate,
  Forgiveness: FaHeartbeat,
  Wisdom: FaSeedling,
  "Spiritual Growth": FaSpa,
  Humility: FaLeaf,
  Gratitude: FaSmile,
  Gratittude: FaSmile,
  Latin: FaChurch,
};

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function QuotesPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(undefined);
  const activeItemRef = useRef(null);

  const quotes = useMemo(
    () => getQuotes().map((q, i) => ({ ...q, _id: i })),
    []
  );

  // Group quotes by normalized category, preserving first-seen order.
  const themes = useMemo(() => {
    const order = [];
    const groups = {};
    const labels = {};
    quotes.forEach((q) => {
      const key = normalizeCategory(q.category);
      if (!groups[key]) {
        groups[key] = [];
        order.push(key);
        labels[key] = CATEGORY_LABELS[q.category] || CATEGORY_LABELS[key] || {
          en: key,
          it: key,
        };
      }
      groups[key].push(q);
    });
    return order.map((key) => ({
      key,
      label: labels[key],
      count: groups[key].length,
      quotes: groups[key],
    }));
  }, [quotes]);

  const themeParam = searchParams.get("theme");
  const itemParam = searchParams.has("item") ? Number(searchParams.get("item")) : NaN;

  const activeTheme =
    themeParam && themeParam !== "0"
      ? themes.find((t) => t.key === themeParam)
      : null;
  const themeQuotes = activeTheme ? activeTheme.quotes : [];

  let currentIndex = -1;
  if (activeTheme && themeQuotes.length) {
    const idx = themeQuotes.findIndex((q) => q._id === itemParam);
    currentIndex = idx >= 0 ? idx : 0;
  }
  const currentQuote = activeTheme ? themeQuotes[currentIndex] : null;

  const t = {
    eyebrow: language === "en" ? "Sacred Words" : "Parole Sacre",
    title: language === "en" ? "Garden of Quotes" : "Giardino delle Citazioni",
    subtitle:
      language === "en"
        ? "Choose a theme, then wander its blossoms one by one."
        : "Scegli un tema, poi vagabonda tra i suoi fiori uno a uno.",
    themesTitle: language === "en" ? "Themes of the Garden" : "Temi del Giardino",
    themesHint: language === "en" ? "Choose a theme" : "Scegli un tema",
    backToThemes:
      language === "en" ? "All Themes" : "Tutti i Temi",
    allQuotes: language === "en" ? "Quotes in this theme" : "Citazioni in questo tema",
    current: language === "en" ? "Current" : "Corrente",
    total: language === "en" ? "Total" : "Totale",
    themesCount: language === "en" ? "themes" : "temi",
    copyLink: language === "en" ? "Copy Link" : "Copia Link",
    copied: language === "en" ? "Link Copied" : "Link Copiato",
    listen: language === "en" ? "Listen" : "Ascolta",
    surprise: language === "en" ? "Surprise Me" : "Sorpresa",
    quoteBy: language === "en" ? "From the garden of" : "Dal giardino di",
shareText:
      language === "en"
        ? "Share this quote by copying the link"
        : "Condividi questa citazione copiando il link",
  };

  // Legacy deep links: `?item=X` without theme → derive the theme.
  useEffect(() => {
    if (!themeParam && Number.isInteger(itemParam) && itemParam >= 0) {
      const q = quotes.find((quote) => quote._id === itemParam);
      if (q) {
        setSearchParams({ theme: normalizeCategory(q.category), item: String(itemParam) }, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeParam, itemParam]);

  // Keep URL shareable per quote within the theme.
  useEffect(() => {
    if (themeParam && currentQuote) {
      const next = new URLSearchParams(searchParams);
      next.set("theme", activeTheme.key);
      next.set("item", String(currentQuote._id));
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, themeParam, currentQuote?._id]);

  // Keyboard navigation (only in quote view).
  useEffect(() => {
    if (!activeTheme || !themeQuotes.length) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevQuote();
      if (e.key === "ArrowRight") nextQuote();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, themeParam]);

  // Load author photo.
  useEffect(() => {
    let active = true;
    setPhotoUrl(undefined);
    if (!currentQuote) return undefined;
    const loader = resolvePrayerPhoto(currentQuote.photo);
    if (loader) {
      loader()
        .then((mod) => {
          if (active) setPhotoUrl(mod.default || mod);
        })
        .catch(() => {
          if (active) setPhotoUrl(null);
        });
    } else {
      setPhotoUrl(null);
    }
    return () => {
      active = false;
    };
  }, [currentQuote]);

  useEffect(() => {
    const HandleClickOutside = () => setIsMenuOpen(false);

    document.addEventListener("cli")
  })

  // Scroll active row into view when the mini-menu opens.
  useEffect(() => {
    if (isMenuOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [isMenuOpen, currentIndex]);

  const goToTheme = (themeKey) => {
    const next = new URLSearchParams(searchParams);
    next.set("theme", themeKey);
    next.delete("item");
    setSearchParams(next);
    setCopied(false);
  };

  const backToThemes = () => {
    setSearchParams({ theme: "0" });
    setIsMenuOpen(false);
    setCopied(false);
  };

  const goToQuote = (idx) => {
    if (!themeQuotes[idx]) return;
    const next = new URLSearchParams(searchParams);
    next.set("theme", activeTheme.key);
    next.set("item", String(themeQuotes[idx]._id));
    setSearchParams(next);
    setIsMenuOpen(false);
  };

  const nextQuote = () => {
    if (!themeQuotes.length) return;
    const nextIdx = (currentIndex + 1 + themeQuotes.length) % themeQuotes.length;
    goToQuote(nextIdx);
  };

  const prevQuote = () => {
    if (!themeQuotes.length) return;
    const nextIdx = (currentIndex - 1 + themeQuotes.length) % themeQuotes.length;
    goToQuote(nextIdx);
  };

  const surprise = () => {
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const q = theme.quotes[Math.floor(Math.random() * theme.quotes.length)];
    setSearchParams({ theme: theme.key, item: String(q._id) });
    setCopied(false);
  };

  const shareUrl = () => {
    if (!currentQuote || !activeTheme) return "";
    return `${window.location.origin}${window.location.pathname}?theme=${encodeURIComponent(activeTheme.key)}&item=${currentQuote._id}`;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleListen = () => {
    if (!currentQuote || !("speechSynthesis" in window)) return;
    const text = language === "en" ? currentQuote.quote : currentQuote.italianQuote;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = language === "en" ? "en-US" : "it-IT";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  };

  /* ---------- Theme grid view ---------- */
  if (!activeTheme) {
    return (
      <div className="quotes-page">
        <Header />
        <div className="quotes-hero">
          <span className="quotes-eyebrow">{t.eyebrow}</span>
          <h1 className="quotes-title">{t.title}</h1>
          <p className="quotes-subtitle">{t.subtitle}</p>
          <div className="quotes-hero-meta">
            <span>
              <FaQuoteLeft /> {quotes.length} {t.total}
            </span>
            <span>
              <FaFeatherAlt /> {themes.length} {t.themesCount}
            </span>
          </div>
        </div>

        <div className="quotes-themes-container">
          <h2 className="quotes-themes-title">{t.themesTitle}</h2>
          <p className="quotes-themes-hint">{t.themesHint}</p>
          <div className="quotes-themes-grid">
            {themes.map((theme) => {
              const Icon = THEME_ICONS[theme.key] || FaFeatherAlt;
              return (
                <button
                  key={theme.key}
                  className="quotes-theme-card"
                  onClick={() => goToTheme(theme.key)}
                >
                  <span className="quotes-theme-icon">
                    <Icon />
                  </span>
                  <span className="quotes-theme-name">
                    {language === "en" ? theme.label.en : theme.label.it}
                  </span>
                  <span className="quotes-theme-count">
                    {theme.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Quote view (single theme) ---------- */
  const catLabel = activeTheme.label;
  const quoteText =
    language === "en" ? currentQuote.quote : currentQuote.italianQuote;
  const otherText =
    language === "en" ? currentQuote.italianQuote : currentQuote.quote;

  return (
    <div className="quotes-page">
      <Header />

      <div className="quotes-container">
        <div className="quotes-topbar">
          <button onClick={backToThemes} className="quotes-back-link">
            <FaList /> {t.backToThemes}
          </button>
          <div className="quotes-top-actions">
            {/* Mini menu — list of quotes within this theme */}
            <div
              className="quotes-menu-wrap"
              // onMouseEnter={() => setIsMenuOpen(true)}
              // onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button
                className="quotes-menu-toggle"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label={t.allQuotes}
                aria-expanded={isMenuOpen}
                title={t.allQuotes}
              >
                {isMenuOpen ? <FaTimes/> : <FaList />}
              </button>

              {isMenuOpen && (
                <div className="quotes-menu">
                  <h3 className="quotes-menu-title">{t.allQuotes}</h3>
                  <ul className="quotes-menu-list">
                    {themeQuotes.map((q, idx) => (
                      <li key={q._id}>
                        <button
                          ref={idx === currentIndex ? activeItemRef : null}
                          className={`quotes-menu-item ${idx === currentIndex ? "active" : ""}`}
                          onClick={() => goToQuote(idx)}
                        >
                          <span className="quotes-menu-index">{idx + 1}</span>
                          <span className="quotes-menu-text">“{q.quote}”</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              className="quotes-shuffle"
              onClick={surprise}
              aria-label={t.surprise}
            >
              <FaRandom /> <span>{t.surprise}</span>
            </button>
            <button
              className={`quotes-share ${copied ? "copied" : ""}`}
              onClick={handleShare}
              aria-label={t.copyLink}
            >
              {copied ? <FaTimes /> : <FaLink />}
              {copied ? t.copied : t.copyLink}
            </button>
          </div>
        </div>

        {/* Quote card */}
        <article className="quotes-card" key={currentQuote._id}>
          <div className="quotes-card-header">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={currentQuote.author}
                className="quotes-photo"
              />
            ) : (
              <div className="quotes-photo quotes-monogram">
                {getInitials(currentQuote.author)}
              </div>
            )}
            <div className="quotes-card-meta">
              <cite className="quotes-author">
                {currentQuote.author}
              </cite>
              <span className="quotes-category-badge">
                {catLabel.en} · {catLabel.it}
              </span>
            </div>
          </div>

          <div className="quotes-quote-body">
            <FaQuoteLeft className="quotes-open-mark" />
            <blockquote className="quotes-quote-text">{quoteText}</blockquote>
            <FaQuoteRight className="quotes-close-mark" />
          </div>

          {otherText && (
            <p className="quotes-other-lang">{otherText}</p>
          )}

          <div className="gold-rule" />

          <div className="quotes-actions">
            <button className="quotes-action listen" onClick={handleListen}>
              <FaVolumeUp />
              {t.listen}
            </button>
            <button className="quotes-action share" onClick={handleShare}>
              <FaLink /> {copied ? t.copied : t.copyLink}
            </button>
          </div>
        </article>

        {/* Progress + hint */}
        <div className="quotes-progress-row">
          <div className="quotes-progress-bar">
            <div
              className="quotes-progress-fill"
              style={{ width: `${((currentIndex + 1) / themeQuotes.length) * 100}%` }}
            />
          </div>
          <div className="quotes-progress-text">
            {currentIndex + 1} / {themeQuotes.length}
          </div>
          <p className="quotes-share-hint">{t.shareText}</p>
        </div>
      </div>

      {/* Fixed side navigation */}
      <button
        className="quotes-fixed-nav quotes-fixed-left"
        onClick={prevQuote}
        aria-label={language === "en" ? "Previous quote" : "Citazione precedente"}
        title={language === "en" ? "Previous (←)" : "Precedente (←)"}
      >
        <FaArrowLeft />
      </button>
      <button
        className="quotes-fixed-nav quotes-fixed-right"
        onClick={nextQuote}
        aria-label={language === "en" ? "Next quote" : "Citazione successiva"}
        title={language === "en" ? "Next (→)" : "Successivo (→)"}
      >
        <FaArrowRight />
      </button>
    </div>
  );
}