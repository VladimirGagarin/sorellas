// pages/JustBecausePage.jsx
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { justBecauseArray, AUTHOR_PHOTOS, resolvePrayerPhoto } from "../components/Utils.js";
import { FaShareAlt, FaTimes, FaHeart } from "react-icons/fa";
import "./JustBecausePage.css";

const TOPIC_LABELS = {
  Jesus: { en: "Jesus", it: "Gesù" },
  "Virgin Mary": { en: "Virgin Mary", it: "Vergine Maria" },
  Cottolengo: { en: "Cottolengo", it: "Cottolengo" },
};

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Author photo loader — remounts per entry so state resets.
function Photo({ photo, author }) {
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
    return <img className="jb-avatar-img" src={photoUrl} alt={author} />;
  }
  return <span className="jb-avatar-initials">{getInitials(author)}</span>;
}

export default function JustBecausePage() {
  const { language } = useLanguage();
  const entries = justBecauseArray();
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState("all");

  const topics = useMemo(() => {
    const seen = [];
    entries.forEach((entry) => {
      const key = entry.topic?.en;
      if (key && !seen.some((t) => t.key === key)) seen.push({ key });
    });
    return seen.map(({ key }) => ({
      key,
      label: TOPIC_LABELS[key] || { en: key, it: key },
      count: entries.filter((e) => e.topic?.en === key).length,
    }));
  }, [entries]);

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.topic?.en === filter);

  const t = {
    eyebrow: language === "en" ? "Small Graces" : "Piccole Grazie",
    title: language === "en" ? "Just Because" : "Solo Perché",
    subtitle:
      language === "en"
        ? "Love that asks for no reason — whispered by the voices of our garden."
        : "Amore che non chiede perché — sussurrato dalle voci del nostro giardino.",
    count: language === "en" ? "gifts" : "ricordi",
    all: language === "en" ? "All" : "Tutti",
    share: language === "en" ? "Share this gift" : "Condividi questo dono",
    copied: language === "en" ? "Copied" : "Copiato",
  };

  const shareEntry = async (entry, index) => {
    const text = [`“${entry.sentiment[language]}”`, `— ${entry.author}`]
      .filter(Boolean)
      .join("\n");
    const title = "Just Because";
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
    <div className="jb-page">
      <Header />

      <div className="jb-hero">
        <span className="jb-eyebrow">{t.eyebrow}</span>
        <h1 className="jb-title">{t.title}</h1>
        <p className="jb-subtitle">{t.subtitle}</p>
        <div className="jb-hero-meta">
          <span>
            <FaHeart /> {entries.length} {t.count}
          </span>
        </div>
      </div>

      <div className="jb-container">
        <div className="jb-filters" role="group" aria-label={language === "en" ? "Filter by topic" : "Filtra per tema"}>
          <button
            className={`jb-filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t.all}
            <span className="jb-filter-count">{entries.length}</span>
          </button>
          {topics.map((topic) => (
            <button
              key={topic.key}
              className={`jb-filter ${filter === topic.key ? "active" : ""}`}
              onClick={() => setFilter(topic.key)}
            >
              {language === "en" ? topic.label.en : topic.label.it}
              <span className="jb-filter-count">{topic.count}</span>
            </button>
          ))}
        </div>

        <div className="jb-grid">
          {filtered.map((entry, index) => (
            <article className="jb-card glass" key={entry.author + index}>
              <span className="jb-card-mark" aria-hidden="true">
                ❤
              </span>
              <div className="jb-card-top">
                <span className="jb-identity">
                  <span className="jb-avatar">
                    <Photo
                      key={entry.author}
                      photo={AUTHOR_PHOTOS[entry.author]}
                      author={entry.author}
                    />
                  </span>
                  <span className="jb-meta">
                    <span className="jb-author">{entry.author}</span>
                    <span className="jb-topic">
                      {language === "en" ? entry.topic.en : entry.topic.it}
                    </span>
                  </span>
                </span>
                <button
                  className={`jb-share ${copiedId === index ? "copied" : ""}`}
                  onClick={() => shareEntry(entry, index)}
                  aria-label={t.share}
                  title={t.share}
                >
                  {copiedId === index ? <FaTimes /> : <FaShareAlt />}
                  {copiedId === index ? t.copied : ""}
                </button>
              </div>
              <p className="jb-sentiment">“{entry.sentiment[language]}”</p>
              <span className="jb-item-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}