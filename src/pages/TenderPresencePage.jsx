// pages/TenderPresencePage.jsx - Tender Presence (Presenza Tenera)
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  HolisticAnthropomorphism,
  AUTHOR_PHOTOS,
  resolvePrayerPhoto,
} from "../components/Utils.js";
import { useSeo } from "../utils/seo.js";
import { FaShareAlt, FaTimes, FaHeart } from "react-icons/fa";
import "./TenderPresencePage.css";

const PERSONA_LABELS = {
  Jesus: { en: "Jesus", it: "Gesù" },
  "Blessed Virgin Mary": {
    en: "Blessed Virgin Mary",
    it: "Beata Vergine Maria",
  },
  "Saint Joseph": { en: "Saint Joseph", it: "San Giuseppe" },
  "St. Joseph Cottolengo": {
    en: "St. Joseph Cottolengo",
    it: "San Giuseppe Cottolengo",
  },
  "Maria Goretti": { en: "Maria Goretti", it: "Maria Goretti" },
  "Mother Teresa": { en: "Mother Teresa", it: "Madre Teresa" },
};

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0][0] + words[2][0]).toUpperCase();
}

// Persona monogram avatar — photos fall back to initials for these figures.
function Photo({ persona }) {
  const [photoUrl, setPhotoUrl] = useState(undefined);

  useEffect(() => {
    let active = true;
    const photo = AUTHOR_PHOTOS[persona];
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
  }, [persona]);

  if (photoUrl) {
    return <img className="tp-avatar-img" src={photoUrl} alt={persona} />;
  }
  return <span className="tp-avatar-initials">{getInitials(persona)}</span>;
}

export default function TenderPresencePage() {
  const { language } = useLanguage();
  const groups = HolisticAnthropomorphism();
  const entries = useMemo(
    () =>
      groups.flatMap((group) =>
        group.anthropos.map((line) => ({
          persona: group.title,
          en: line.en,
          it: line.it,
        }))
      ),
    [groups]
  );
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState("all");

  useSeo({
    title: "Tender Presence ✦ Presenza Tenera | Fiori Di Preghiera",
    description: "Poetic glimpses of Divine tenderness in Jesus, Mary and the saints who walk beside us.",
  });

  const personas = useMemo(
    () =>
      groups.map((group) => ({
        key: group.title,
        label: PERSONA_LABELS[group.title] || { en: group.title, it: group.title },
        count: group.anthropos.length,
      })),
    [groups]
  );

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.persona === filter);

  const t = {
    eyebrow: language === "en" ? "Whispers of Tenderness" : "Sussurri di Tenerezza",
    title: language === "en" ? "Tender Presence" : "Presenza Tenera",
    subtitle:
      language === "en"
        ? "The sacred, gently near — poetic glimpses of heaven in the figures who love us."
        : "Il sacro, teneramente vicino — sguardi poetici di cielo nelle figure che ci amano.",
    count: language === "en" ? "glimpses" : "sguardi",
    all: language === "en" ? "All" : "Tutti",
    share: language === "en" ? "Share this glimpse" : "Condividi questo sguardo",
    copied: language === "en" ? "Copied" : "Copiato",
  };

  const shareEntry = async (entry, index) => {
    const text = [`“${entry[language]}”`, `— ${entry.persona}`]
      .filter(Boolean)
      .join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: t.title, text });
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
    <div className="tp-page">
      <Header />

      <div className="tp-hero">
        <span className="tp-eyebrow">{t.eyebrow}</span>
        <h1 className="tp-title">{t.title}</h1>
        <p className="tp-subtitle">{t.subtitle}</p>
        <div className="tp-hero-meta">
          <span>
            <FaHeart /> {entries.length} {t.count}
          </span>
        </div>
      </div>

      <div className="tp-container">
        <div
          className="tp-filters"
          role="group"
          aria-label={
            language === "en" ? "Filter by person" : "Filtra per persona"
          }
        >
          <button
            className={`tp-filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t.all}
            <span className="tp-filter-count">{entries.length}</span>
          </button>
          {personas.map((persona) => (
            <button
              key={persona.key}
              className={`tp-filter ${filter === persona.key ? "active" : ""}`}
              onClick={() => setFilter(persona.key)}
            >
              {language === "en" ? persona.label.en : persona.label.it}
              <span className="tp-filter-count">{persona.count}</span>
            </button>
          ))}
        </div>

        <div className="tp-grid">
          {filtered.map((entry, index) => (
            <article
              className="tp-card glass tp-card-glass"
              key={entry.persona + entry.en}
            >
              <span className="tp-card-mark" aria-hidden="true">
                ☩
              </span>
              <div className="tp-card-top">
                <span className="tp-identity">
                  <span className="tp-avatar">
                    <Photo key={entry.persona} persona={entry.persona} />
                  </span>
                  <span className="tp-meta">
                    <span className="tp-persona">
                      {language === "en"
                        ? (PERSONA_LABELS[entry.persona] || {
                            en: entry.persona,
                          }).en
                        : (PERSONA_LABELS[entry.persona] || {
                            it: entry.persona,
                          }).it}
                    </span>
                    <span className="tp-topic">{t.title}</span>
                  </span>
                </span>
                <button
                  className={`tp-share ${copiedId === index ? "copied" : ""}`}
                  onClick={() => shareEntry(entry, index)}
                  aria-label={t.share}
                  title={t.share}
                >
                  {copiedId === index ? <FaTimes /> : <FaShareAlt />}
                  {copiedId === index ? t.copied : ""}
                </button>
              </div>
              <p className="tp-sentiment">“{entry[language]}”</p>
              <span className="tp-item-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}