import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { getFamousPrayers, resolvePrayerPhoto } from "../components/Utils.js";
import {
  FaList,
  FaQuoteLeft,
  FaRandom,
  FaPrayingHands,
  FaTimes,
  FaUserAlt,
} from "react-icons/fa";
import "./PrayersPage.css";

const RANDOM_COUNT = 6;
const PAGE_SIZE = 24;
const SHORT_MAX = 40;
const MEDIUM_MAX = 90;

function wordCount(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

function getLengthCategory(count) {
  if (count < SHORT_MAX) return "short";
  if (count <= MEDIUM_MAX) return "medium";
  return "long";
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (
    words[0][0] + words[1][0]
  ).toUpperCase();
}

function CardPhoto({ photo, name }) {
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    let active = true;
    const update = (v) => {
      if (active) setUrl(v);
    };
    const loader = resolvePrayerPhoto(photo);
    if (loader) {
      loader()
        .then((mod) => update(mod.default || mod))
        .catch(() => update(null));
    } else {
      Promise.resolve().then(() => update(null));
    }
    return () => {
      active = false;
    };
  }, [photo]);

  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="monogram card-photo"
        loading="lazy"
        aria-hidden="true"
      />
    );
  }
  return (
    <div className="monogram" aria-hidden="true">
      {getInitials(name)}
    </div>
  );
}

export default function PrayersPage() {
  const { language } = useLanguage();
  const [authorQuery, setAuthorQuery] = useState("");
  const [lengthFilter, setLengthFilter] = useState("all");
  const [randomKey, setRandomKey] = useState(0);
  const [mode, setMode] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState(() => new Set());
  const sentinelRef = useRef(null);

  const t = useMemo(() => {
    const en = {
      eyebrow: "Sacred Words",
      title: "Garden of Prayers",
      subtitle:
        "Prayers gathered from saints, shepherds of the Church, and humble servants of God.",
      author: "By Author",
      authorPlaceholder: "Search an author...",
      length: "By Length",
      all: "All",
      short: "Short",
      medium: "Medium",
      long: "Long",
      shortHint: "under 40 words",
      mediumHint: "40–90 words",
      longHint: "over 90 words",
      random: "Surprise Me",
      showAll: "All Prayers",
      reset: "Reset",
      clearAuthor: "Clear",
      showing: (n, total) => `Showing ${n} of ${total} prayers`,
      randomNote: "A handful of prayers chosen at random.",
      readMore: "Read the full prayer",
      readLess: "Show less",
      wordCount: "words",
      noResults: "No prayers match your search.",
      totalAuthors: (n) => `From ${n} prayerful souls`,
      emptyAuthorSearch: "Pick an author or length to explore the whole garden.",
    };
    const it = {
      eyebrow: "Parole Sacre",
      title: "Giardino delle Preghiere",
      subtitle:
        "Preghiere raccolte dai santi, dai pastori della Chiesa e dagli umili servi di Dio.",
      author: "Per Autore",
      authorPlaceholder: "Cerca un autore...",
      length: "Per Lunghezza",
      all: "Tutte",
      short: "Brevi",
      medium: "Medie",
      long: "Lunghe",
      shortHint: "meno di 40 parole",
      mediumHint: "40–90 parole",
      longHint: "oltre 90 parole",
      random: "Sorpresa",
      showAll: "Tutte le Preghiere",
      reset: "Azzera",
      clearAuthor: "Cancella",
      showing: (n, total) => `Mostrando ${n} di ${total} preghiere`,
      randomNote: "Un pugno di preghiere scelte a caso.",
      readMore: "Leggi tutta la preghiera",
      readLess: "Mostra meno",
      wordCount: "parole",
      noResults: "Nessuna preghiera corrisponde alla ricerca.",
      totalAuthors: (n) => `Da ${n} anime in preghiera`,
      emptyAuthorSearch:
        "Scegli un autore o una lunghezza per esplorare l'intero giardino.",
    };
    return language === "en" ? en : it;
  }, [language]);

  const allPrayers = useMemo(
    () => getFamousPrayers().map((p, i) => ({ ...p, _id: i })),
    []
  );

  // Fresh random order on every visit so new prayers surface at the top.
  const [shuffledAll, setShuffledAll] = useState(() => shuffleArray(allPrayers));

  const totalAuthors = useMemo(
    () => new Set(allPrayers.map((p) => p.author)).size,
    [allPrayers]
  );

  const authors = useMemo(
    () => [...new Set(allPrayers.map((p) => p.author))].sort(),
    [allPrayers]
  );

  const hasFilters = authorQuery.trim() !== "" || lengthFilter !== "all";

  const filtered = useMemo(() => {
    const q = authorQuery.trim().toLowerCase();
    return allPrayers.filter((p) => {
      const authorMatch = !q || p.author.toLowerCase().includes(q);
      const lengthMatch =
        lengthFilter === "all" ||
        getLengthCategory(wordCount(p.prayer)) === lengthFilter;
      return authorMatch && lengthMatch;
    });
  }, [allPrayers, authorQuery, lengthFilter]);

  const randomPrayers = useMemo(
    () => shuffleArray(allPrayers).slice(0, RANDOM_COUNT),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allPrayers, randomKey]
  );

  const isAll = !hasFilters && mode === "all";
  const source = hasFilters ? filtered : isAll ? shuffledAll : randomPrayers;
  const sourceTotal = source.length;
  const shown = isAll || hasFilters ? source.slice(0, visibleCount) : source;

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShuffle = () => {
    setMode("random");
    setRandomKey((k) => k + 1);
  };

  const handleShowAll = () => {
    setMode("all");
    setVisibleCount(PAGE_SIZE);
  };

  // Infinite scroll: reveal 2 more prayers when the sentinel comes within
  // 200px of the viewport bottom.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && shown.length < sourceTotal) {
            setVisibleCount((c) => Math.min(c + 2, sourceTotal));
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [shown.length, sourceTotal]);

  const handleReset = () => {
    setAuthorQuery("");
    setLengthFilter("all");
    setVisibleCount(PAGE_SIZE);
    setShuffledAll(shuffleArray(allPrayers));
  };

  const changeLength = (value) => {
    setLengthFilter(value);
    setVisibleCount(PAGE_SIZE);
  };

  const changeAuthor = (value) => {
    setAuthorQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const getLengthLabel = (category) => {
    const labels = { short: t.short, medium: t.medium, long: t.long };
    return labels[category];
  };

  const getLengthHint = (category) => {
    const hints = { short: t.shortHint, medium: t.mediumHint, long: t.longHint };
    return hints[category];
  };

  return (
    <div className="prayers-page">
      <Header />

      <div className="prayers-container">
        {/* Hero */}
        <div className="prayers-hero">
          <span className="prayers-eyebrow">{t.eyebrow}</span>
          <h1 className="prayers-main-title">{t.title}</h1>
          <p className="prayers-subtitle">{t.subtitle}</p>
          <div className="prayers-hero-meta">
            <span>
              <FaPrayingHands /> {t.showing(allPrayers.length, allPrayers.length)}
            </span>
            <span>
              <FaUserAlt /> {t.totalAuthors(totalAuthors)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="prayers-controls">
          <div className="controls-row">
            <div className="control-group">
              <span className="control-label">{t.author}</span>
              <div className="author-search-wrap">
                <input
                  type="text"
                  list="prayer-authors"
                  value={authorQuery}
                  onChange={(e) => changeAuthor(e.target.value)}
                  placeholder={t.authorPlaceholder}
                  className="author-search"
                  aria-label={t.author}
                />
                <datalist id="prayer-authors">
                  {authors.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
                {authorQuery && (
                  <button
                    className="clear-btn"
                    onClick={() => changeAuthor("")}
                    aria-label={t.clearAuthor}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">{t.length}</span>
              <div className="length-pills">
                {["all", "short", "medium", "long"].map((value) => (
                  <button
                    key={value}
                    className={`length-pill ${
                      lengthFilter === value ? "active" : ""
                    } ${value}`}
                    onClick={() => changeLength(value)}
                  >
                    {value === "all" ? t.all : getLengthLabel(value)}
                    {value !== "all" && (
                      <small className="pill-hint">
                        {getLengthHint(value)}
                      </small>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="controls-actions">
              {hasFilters ? (
                <button className="shuffle-btn reset" onClick={handleReset}>
                  <FaTimes /> {t.reset}
                </button>
              ) : (
                <>
                  {mode === "random" && (
                    <button className="shuffle-btn reset" onClick={handleShowAll}>
                      <FaList /> {t.showAll}
                    </button>
                  )}
                  <button className="shuffle-btn" onClick={handleShuffle}>
                    <FaRandom /> {t.random}
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="prayers-summary">
            {hasFilters
              ? t.showing(Math.min(shown.length, filtered.length), filtered.length)
              : isAll
                ? t.showing(shown.length, allPrayers.length)
                : `${t.showing(shown.length, allPrayers.length)} — ${t.randomNote}`}
          </p>
        </div>

        {/* Cards */}
        {shown.length === 0 ? (
          <div className="no-results">
            <FaPrayingHands />
            <p>{t.noResults}</p>
            <button className="shuffle-btn reset" onClick={handleReset}>
              <FaTimes /> {t.reset}
            </button>
          </div>
        ) : (
          <div key={hasFilters ? "filtered" : randomKey} className="prayers-grid">
            {shown.map((p) => {
              const isExpanded = expanded.has(p._id);
              const wc = wordCount(p.prayer);
              const category = getLengthCategory(wc);
              const prayerText = language === "en" ? p.prayer : p.italianPrayer;
              const quoteText = language === "en" ? p.quote : p.italianQuote;
              const needsToggle = wc > 60;
              return (
                <Link
                  to={`/prayer/${p._id}`}
                  className="prayer-card"
                  key={p._id}
                  aria-label={p.author}
                >
                  <header className="prayer-card-head">
                    <CardPhoto photo={p.photo} name={p.author} />
                    <div className="author-info">
                      <h3 className="author-name">{p.author}</h3>
                      <div className="card-badges">
                        <span className={`length-badge ${category}`}>
                          {getLengthLabel(category)}
                        </span>
                        <span className="word-count">
                          {wc} {t.wordCount}
                        </span>
                      </div>
                    </div>
                  </header>

                  {quoteText && (
                    <blockquote className="prayer-quote">
                      <FaQuoteLeft className="quote-mark" />
                      <p>{quoteText}</p>
                    </blockquote>
                  )}

                  <div className="prayer-body">
                    <p
                      className={`prayer-text drop-cap ${
                        isExpanded ? "" : "collapsed"
                      }`}
                    >
                      {prayerText}
                    </p>
                    {needsToggle && (
                      <span
                        className="read-more-btn"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleExpanded(p._id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleExpanded(p._id);
                          }
                        }}
                      >
                        {isExpanded ? t.readLess : t.readMore}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        {(hasFilters || isAll) && shown.length < sourceTotal && (
          <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}