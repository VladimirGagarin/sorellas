import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  getFamousPrayers,
  resolvePrayerPhoto,
} from "../components/Utils.js";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaLink,
  FaQuoteLeft,
  FaPrayingHands,
  FaTimes,
} from "react-icons/fa";
import "./PrayerPage.css";

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

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function PrayerDetail({ prayer, totalCount, navigate, language, t }) {
  const [photoUrl, setPhotoUrl] = useState(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const loader = resolvePrayerPhoto(prayer.photo);
    if (loader) {
      loader()
        .then((mod) => {
          if (active) setPhotoUrl(mod.default || mod);
        })
        .catch(() => {
          if (active) setPhotoUrl(null);
        });
    }
    return () => {
      active = false;
    };
  }, [prayer]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const goTo = (idx) => {
    if (idx >= 0 && idx < totalCount) navigate(`/prayer/${idx}`);
  };

  const wc = wordCount(prayer.prayer);
  const category = getLengthCategory(wc);
  const prayerText = language === "en" ? prayer.prayer : prayer.italianPrayer;
  const authorQuote =
    language === "en" ? prayer.quote : prayer.italianQuote;
  const hasQuote = Boolean(authorQuote && authorQuote.trim());

  const lengthLabel = {
    en: { short: "Short", medium: "Medium", long: "Long" },
    it: { short: "Breve", medium: "Media", long: "Lunga" },
  }[language][category];

  return (
    <div className="prayer-container">
      <div className="prayer-topbar">
        <Link to="/prayers" className="prayer-back-link">
          <FaArrowLeft /> {t.back}
        </Link>
        <button
          className={`share-btn ${copied ? "copied" : ""}`}
          onClick={handleShare}
          aria-label={t.shareLink}
        >
          {copied ? <FaTimes /> : <FaLink />}
          {copied ? t.copied : t.shareLink}
        </button>
      </div>

      <div className="prayer-nav-row">
        <button
          className="prayer-nav-btn"
          onClick={() => goTo(prayer._id - 1)}
          disabled={prayer._id === 0}
          aria-label={t.previousPrayer}
        >
          <FaChevronLeft />
        </button>
        <span className="prayer-nav-count">
          {prayer._id + 1} / {totalCount}
        </span>
        <button
          className="prayer-nav-btn"
          onClick={() => goTo(prayer._id + 1)}
          disabled={prayer._id === totalCount - 1}
          aria-label={t.nextPrayer}
        >
          <FaChevronRight />
        </button>
      </div>

      <article className="prayer-article">
        <header className="prayer-author">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={prayer.author}
              className="author-photo"
            />
          ) : (
            <div className="author-photo monogram">
              {getInitials(prayer.author)}
            </div>
          )}
          <div className="prayer-author-info">
            <span className="prayer-eyebrow">{t.readingTime(wc)}</span>
            <h1 className="prayer-author-name">{prayer.author}</h1>
            <div className="prayer-badges">
              <span className={`length-badge ${category}`}>
                {lengthLabel}
              </span>
              <span className="word-count">
                {wc} {t.wordCount}
              </span>
            </div>
          </div>
        </header>

        <div className="gold-rule" />

        <blockquote className="prayer-author-quote">
          <span className="prayer-quote-label">{t.fromTheAuthor}</span>
          <div className="prayer-quote-body">
            <FaQuoteLeft className="prayer-quote-mark" />
            <p className="prayer-quote-text">
              {hasQuote ? authorQuote : t.deoGratias}
            </p>
          </div>
        </blockquote>

        <div className="gold-rule" />

        <div className="prayer-body-text">
          <p className="prayer-text drop-cap">{prayerText}</p>
        </div>

        <footer className="prayer-footer">
          <FaPrayingHands className="prayer-footer-icon" />
          <span className="prayer-footer-plain">{prayer.author}</span>
        </footer>
      </article>
    </div>
  );
}

export default function PrayerPage() {
  const { language } = useLanguage();
  const { prayerId } = useParams();
  const navigate = useNavigate();

  const t = useMemo(() => {
    const en = {
      back: "Back to Garden of Prayers",
      notFoundTitle: "Prayer Not Found",
      notFoundText:
        "The prayer you are looking for does not exist in the garden.",
      readAnother: "Wander the Garden",
      shareLink: "Copy Link",
      copied: "Link Copied",
      wordCount: "words",
      previousPrayer: "Previous prayer",
      nextPrayer: "Next prayer",
      fromTheAuthor: "In the author's own words",
      deoGratias: "Deo Gratias – thanks be to God.",
      readingTime: (wc) =>
        wc < 100 ? "a moment of prayer" : "a pause for prayer",
    };
    const it = {
      back: "Torna al Giardino delle Preghiere",
      notFoundTitle: "Preghiera Non Trovata",
      notFoundText:
        "La preghiera che stai cercando non esiste nel giardino.",
      readAnother: "Vagare nel Giardino",
      shareLink: "Copia Link",
      copied: "Link Copiato",
      wordCount: "parole",
      previousPrayer: "Preghiera precedente",
      nextPrayer: "Preghiera successiva",
      fromTheAuthor: "Con le parole dell'autore",
      deoGratias: "Deo Gratias – grazie a Dio.",
      readingTime: (wc) =>
        wc < 100 ? "un momento di preghiera" : "una pausa di preghiera",
    };
    return language === "en" ? en : it;
  }, [language]);

  const prayer = useMemo(() => {
    const list = getFamousPrayers();
    const idx = parseInt(prayerId, 10);
    if (Number.isInteger(idx) && idx >= 0 && idx < list.length) {
      return { ...list[idx], _id: idx };
    }
    return null;
  }, [prayerId]);

  const totalCount = useMemo(
    () => (prayer ? getFamousPrayers().length : 0),
    [prayer]
  );

  return (
    <div className="prayer-page">
      <Header />
      {prayer ? (
        <PrayerDetail
          key={prayer._id}
          prayer={prayer}
          totalCount={totalCount}
          navigate={navigate}
          language={language}
          t={t}
        />
      ) : (
        <div className="prayer-container">
          <div className="prayer-not-found">
            <FaPrayingHands />
            <h1>{t.notFoundTitle}</h1>
            <p>{t.notFoundText}</p>
            <Link to="/prayers" className="prayer-back-btn">
              <FaArrowLeft /> {t.readAnother}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}