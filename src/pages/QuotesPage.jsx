// pages/QuotesPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { getQuotes, resolvePrayerPhoto } from "../components/Utils.js";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFeatherAlt,
  FaList,
  FaLink,
  FaQuoteLeft,
  FaQuoteRight,
  FaRandom,
  FaUserAlt,
  FaVolumeUp,
  FaTimes,
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
  "Prayer and Meditation": { en: "Prayer & Meditation", it: "Preghiera e Meditazione" },
  Compassion: { en: "Compassion", it: "Compassione" },
  "Hope and Perseverance": { en: "Hope & Perseverance", it: "Speranza e Perseveranza" },
  Charity: { en: "Charity", it: "Carità" },
  Forgiveness: { en: "Forgiveness", it: "Perdono" },
  Wisdom: { en: "Wisdom", it: "Saggezza" },
  "Spiritual Growth": { en: "Spiritual Growth", it: "Crescita Spirituale" },
  Humility: { en: "Humility", it: "Umiltà" },
  Gratitude: { en: "Gratitude", it: "Gratitudine" },
  Gratittude: { en: "Gratitude", it: "Gratitudine" },
  Latin: { en: "Latin", it: "Latino" },
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

  const quotes = useMemo(
    () => getQuotes().map((q, i) => ({ ...q, _id: i })),
    []
  );

  const categories = useMemo(() => {
    const seen = new Set();
    return quotes
      .map((q) => q.category)
      .filter((c) => {
        if (seen.has(c)) return false;
        seen.add(c);
        return true;
      });
  }, [quotes]);

  const groupedQuotes = useMemo(() => {
    const groups = {};
    quotes.forEach((q) => {
      (groups[q.category] = groups[q.category] || []).push(q);
    });
    return groups;
  }, [quotes]);

  const itemIdFromUrl = searchParams.get("item");
  const initialIndex = itemIdFromUrl
    ? quotes.findIndex((q) => q._id === Number(itemIdFromUrl))
    : Math.floor(Math.random() * quotes.length);

  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(undefined);
  const activeItemRef = useRef(null);

  const currentQuote = quotes[currentIndex];

  const nextQuote = () => setCurrentIndex((prev) => (prev + 1) % quotes.length);
  const prevQuote = () =>
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  const goToQuote = (idx) => {
    setCurrentIndex(idx);
    setIsMenuOpen(false);
  };

  // Keep URL shareable per quote
  useEffect(() => {
    if (currentQuote) {
      const next = new URLSearchParams(searchParams);
      next.set("item", String(currentQuote._id));
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentQuote?._id]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevQuote();
      if (e.key === "ArrowRight") nextQuote();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, quotes.length]);

  // Load author photo
  useEffect(() => {
    let active = true;
    setPhotoUrl(undefined);
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

  // Scroll active row into view when menu opens
  useEffect(() => {
    if (isMenuOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [isMenuOpen, currentIndex]);

  const shareUrl = () => `${window.location.origin}${window.location.pathname}?item=${currentQuote._id}`;

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
    if ("speechSynthesis" in window) {
      const text =
        language === "en" ? currentQuote.quote : currentQuote.italianQuote;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = language === "en" ? "en-US" : "it-IT";
      u.rate = 0.9;
      speechSynthesis.speak(u);
    }
  };

  const catLabel = CATEGORY_LABELS[currentQuote.category] || {
    en: currentQuote.category,
    it: currentQuote.category,
  };
  const quoteText = language === "en" ? currentQuote.quote : currentQuote.italianQuote;
  const otherText = language === "en" ? currentQuote.italianQuote : currentQuote.quote;

  const t = {
    eyebrow: language === "en" ? "Sacred Words" : "Parole Sacre",
    title: language === "en" ? "Garden of Quotes" : "Giardino delle Citazioni",
    subtitle:
      language === "en"
        ? "Fragrant blossoms of wisdom from the souls of the garden."
        : "Fiori profumati di saggezza dalle anime del giardino.",
    back: language === "en" ? "Back to Home" : "Torna alla Home",
    allQuotes: language === "en" ? "All Quotes" : "Tutte le Citazioni",
    current: language === "en" ? "Current" : "Corrente",
    total: language === "en" ? "Total" : "Totale",
    categories: language === "en" ? "Themes" : "Temi",
    copyLink: language === "en" ? "Copy Link" : "Copia Link",
    copied: language === "en" ? "Link Copied" : "Link Copiato",
    listen: language === "en" ? "Listen" : "Ascolta",
    surprise: language === "en" ? "Surprise Me" : "Sorpresa",
    shareText:
      language === "en"
        ? "Share this quote by copying the link"
        : "Condividi questa citazione copiando il link",
  };

  return (
    <div className="quotes-page">
      <Header />

      {/* Hero */}
      <div className="quotes-hero">
        <span className="quotes-eyebrow">{t.eyebrow}</span>
        <h1 className="quotes-title">{t.title}</h1>
        <p className="quotes-subtitle">{t.subtitle}</p>
        <div className="quotes-hero-meta">
          <span>
            <FaQuoteLeft /> {quotes.length} {t.total}
          </span>
          <span>
            <FaFeatherAlt /> {categories.length} {t.categories}
          </span>
        </div>
      </div>

      <div className="quotes-container">
        <div className="quotes-topbar">
          <Link to="/" className="quotes-back-link">
            <FaArrowLeft /> {t.back}
          </Link>
          <div className="quotes-top-actions">
            <button
              className="quotes-shuffle"
              onClick={() => goToQuote(Math.floor(Math.random() * quotes.length))}
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

        {/* Mini menu — list of all quotes, grouped by theme */}
        <div
          className="quotes-menu-wrap"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <button
            className="quotes-menu-toggle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={t.allQuotes}
            aria-expanded={isMenuOpen}
          >
            <FaList />
          </button>

          {isMenuOpen && (
            <div className="quotes-menu">
              <h3 className="quotes-menu-title">{t.allQuotes}</h3>
              <ul className="quotes-menu-list">
                {categories.map((cat) => {
                  const label = CATEGORY_LABELS[cat] || { en: cat, it: cat };
                  return (
                    <li key={cat} className="quotes-menu-group">
                      <span className="quotes-menu-category">
                        {language === "en" ? label.en : label.it}
                        <small>{groupedQuotes[cat].length}</small>
                      </span>
                      <ul className="quotes-menu-sublist">
                        {groupedQuotes[cat].map((q) => (
                          <li key={q._id}>
                            <button
                              ref={q._id === currentIndex ? activeItemRef : null}
                              className={`quotes-menu-item ${
                                q._id === currentIndex ? "active" : ""
                              }`}
                              onClick={() => goToQuote(q._id)}
                            >
                              <span className="quotes-menu-index">{q._id + 1}</span>
                              <span className="quotes-menu-text">“{q.quote}”</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Quote card */}
        <article className="quotes-card" key={currentQuote._id}>
          <span className="quotes-category-badge">{catLabel.en} · {catLabel.it}</span>

          <div className="quotes-quote-body">
            <FaQuoteLeft className="quotes-open-mark" />
            <blockquote className="quotes-quote-text">{quoteText}</blockquote>
            <FaQuoteRight className="quotes-close-mark" />
          </div>

          {otherText && (
            <p className="quotes-other-lang">{otherText}</p>
          )}

          <div className="gold-rule" />

          <div className="quotes-attribution">
            {photoUrl ? (
              <img src={photoUrl} alt={currentQuote.author} className="quotes-photo" />
            ) : (
              <div className="quotes-photo quotes-monogram">
                {getInitials(currentQuote.author)}
              </div>
            )}
            <cite className="quotes-author">
              <FaUserAlt /> {currentQuote.author}
            </cite>
          </div>

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
              style={{ width: `${((currentIndex + 1) / quotes.length) * 100}%` }}
            />
          </div>
          <div className="quotes-progress-text">
            {currentIndex + 1} / {quotes.length}
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