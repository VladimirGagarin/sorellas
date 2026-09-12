// pages/FavoriteWordsPage.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { getFavWords, AUTHOR_PHOTOS, resolvePrayerPhoto } from "../components/Utils.js";
import { FaQuoteLeft, FaShareAlt, FaTimes } from "react-icons/fa";
import "./FavoriteWordsPage.css";

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Author photo loader — remounts per word so state resets.
function WordPhoto({ photo, author }) {
  const [photoUrl, setPhotoUrl] = useState(undefined);

  useEffect(() => {
    let active = true;
    const loader = photo ? resolvePrayerPhoto(photo) : null;
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
  }, [photo]);

  if (photoUrl) {
    return <img className="fw-avatar-img" src={photoUrl} alt={author} />;
  }
  return <span className="fw-avatar-initials">{getInitials(author)}</span>;
}

export default function FavoriteWordsPage() {
  const { language } = useLanguage();
  const words = getFavWords();
  const [copiedId, setCopiedId] = useState(null);

  const t = {
    eyebrow:
      language === "en" ? "Words of the Garden" : "Parole del Giardino",
    title: language === "en" ? "Favourite Words" : "Parole Preferite",
    subtitle:
      language === "en"
        ? "Words the heart keeps close, whispered by the voices of our garden."
        : "Parole che il cuore custodisce, sussurrate dalle voci del nostro giardino.",
    count: language === "en" ? "words" : "parole",
    share: language === "en" ? "Share this word" : "Condividi questa parola",
    copied: language === "en" ? "Copied" : "Copiato",
  };

  const shareWord = async (word, index) => {
    const text = [
      `“${word.favWord[language]}”`,
      word.reason?.[language],
      `— ${word.author}`,
    ]
      .filter(Boolean)
      .join("\n");
    const title = "Favourite Word";
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopiedId(index);
      setTimeout(() => setCopiedId((cur) => (cur === index ? null : cur)), 2000);
    } catch {
      /* user cancelled or clipboard unavailable */
    }
  };

  return (
    <div className="fw-page">
      <Header />

      <div className="fw-hero">
        <span className="fw-eyebrow">{t.eyebrow}</span>
        <h1 className="fw-title">{t.title}</h1>
        <p className="fw-subtitle">{t.subtitle}</p>
        <div className="fw-hero-meta">
          <span>
            <FaQuoteLeft /> {words.length} {t.count}
          </span>
        </div>
      </div>

      <div className="fw-container">
        <div className="fw-grid">
          {words.map((word, index) => (
            <article className="fw-card glass" key={index}>
              <span className="fw-card-mark" aria-hidden="true">
                ❝
              </span>
              <div className="fw-card-top">
                <span className="fw-identity">
                  <span className="fw-avatar">
                    <WordPhoto
                      key={word.author}
                      photo={AUTHOR_PHOTOS[word.author]}
                      author={word.author}
                    />
                  </span>
                  <span className="fw-author">{word.author}</span>
                </span>
                <button
                  className={`fw-share ${copiedId === index ? "copied" : ""}`}
                  onClick={() => shareWord(word, index)}
                  aria-label={t.share}
                  title={t.share}
                >
                  {copiedId === index ? <FaTimes /> : <FaShareAlt />}
                  {copiedId === index ? t.copied : ""}
                </button>
              </div>
              <h3 className="fw-word">{word.favWord[language]}</h3>
              {word.reason?.[language] && (
                <p className="fw-message">“{word.reason[language]}”</p>
              )}
              <span className="fw-item-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}