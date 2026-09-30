// pages/JustBecausePage.jsx
import { useEffect, useMemo, useRef, useState, createRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { justBecauseArray, AUTHOR_PHOTOS, resolvePrayerPhoto } from "../components/Utils.js";
import {
  JUST_BECAUSE_TOPIC_LABELS,
  JUST_BECAUSE_TOPIC_ORDER,
  JUST_BECAUSE_SISTER_COUNT,
} from "../components/justBecauseData.js";
import CaptureCard from "../components/CaptureCard.jsx";
import { FaShareAlt, FaTimes, FaHeart } from "react-icons/fa";
import "./JustBecausePage.css";

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Draws a random order, held for the rest of the visit so the grid and the tag
// row do not reshuffle under the reader on every re-render. The same seed
// always produces the same order.
function useShuffled(list, seed) {
  return useMemo(() => {
    const out = [...list];
    // mulberry32: small, fast, and good enough to spread a list of 385.
    let state = seed >>> 0;
    const next = () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }, [list, seed]);
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

// A single "gift" card. Rendered both in the grid and inside the deep-link
// overlay, so the captured image is identical in either place.
function GiftCard({ entry, number, cardRef, language }) {
  return (
    <article className="jb-card glass" data-jb-id={entry.id} ref={cardRef}>
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
      </div>
      <p className="jb-sentiment">“{entry.sentiment[language]}”</p>
      <div className="jb-card-foot">
        <span className="jb-item-index">
          {String(number).padStart(2, "0")}
        </span>
        <span className="jb-capture-watermark">Aeternum Floreamus</span>
      </div>
    </article>
  );
}

export default function JustBecausePage() {
  const { language } = useLanguage();
  const entries = useMemo(() => justBecauseArray(), []);
  // Cards and category tags are shown in a random order, but the order is drawn
  // once per visit and then kept, so it does not jump around while reading.
  const [shuffleSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const messageParam = searchParams.get("message");

  // The deep-linked entry, resolved once. Kept in state (rather than read back
  // off the URL) so the id survives until the overlay is explicitly closed.
  const [focusId, setFocusId] = useState(messageParam);
  const overlayCardRef = useRef(null);

  const focusedEntry = useMemo(
    () => entries.find((e) => e.id === focusId) ?? null,
    [entries, focusId]
  );

  const overlayOpen = Boolean(messageParam) && Boolean(focusedEntry);

  // Closing the overlay is what clears the param, so the link stays shareable
  // for as long as the overlay is up.
  const closeOverlay = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("message");
    setSearchParams(next, { replace: true });
    setFocusId(null);
  };

  // Lock page scroll behind the overlay.
  useEffect(() => {
    if (!overlayOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [overlayOpen]);

  // Escape closes the overlay.
  useEffect(() => {
    if (!overlayOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayOpen]);

  // Cards are shown in a random order; the deep-linked entry is then hoisted to
  // the front so it still renders as the first card.
  const shuffled = useShuffled(entries, shuffleSeed);
  const ordered = useMemo(() => {
    if (!focusedEntry) return shuffled;
    const idx = shuffled.findIndex((e) => e.id === focusedEntry.id);
    if (idx <= 0) return shuffled;
    return [focusedEntry, ...shuffled.slice(0, idx), ...shuffled.slice(idx + 1)];
  }, [shuffled, focusedEntry]);

  // Anything unexpected is appended rather than dropped.
  const topics = useMemo(() => {
    const counts = new Map();
    entries.forEach((entry) => {
      const key = entry.topic?.en;
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const known = JUST_BECAUSE_TOPIC_ORDER.filter((key) => counts.has(key));
    const extra = [...counts.keys()].filter((key) => !known.includes(key));
    return [...known, ...extra].map((key) => ({
      key,
      label: JUST_BECAUSE_TOPIC_LABELS[key] || { en: key, it: key },
      count: counts.get(key),
    }));
  }, [entries]);

  // The category tags are shown in a random order too. "All" is rendered
  // separately and stays pinned at the front of the row.
  const topicList = useShuffled(topics, shuffleSeed + 1);

  // A deep link decides its own category: the entry's own topic, falling back
  // to "all" when the id is unknown. Otherwise the user's own filter wins.
  const activeFilter = focusId ? focusedEntry?.topic?.en ?? "all" : filter;

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? ordered
        : ordered.filter((e) => e.topic?.en === activeFilter),
    [ordered, activeFilter]
  );

  // Stable ref per card, recreated only when the visible list changes.
  const cardRefs = useMemo(
    () => filtered.map(() => createRef()),
    [filtered]
  );

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
    snapshot: language === "en" ? "Save Card" : "Salva Scheda",
    saveAsImage: language === "en" ? "Save as Image" : "Salva come Immagine",
    close: language === "en" ? "Close" : "Chiudi",
    sharedGift: language === "en" ? "A gift shared with you" : "Un dono condiviso con te",
  };

  const shareUrl = (entry) =>
    `${window.location.origin}${window.location.pathname}#/just-because?message=${entry.id}`;

  // Deep link: `?message=<uuid>` hoists the entry to the first card and puts it
  // in the overlay. The param is deliberately left in the URL so the view stays
  // shareable; only the close button removes it.
  useEffect(() => {
    if (!messageParam) return;
    // Re-assert while author photos load and shift the layout.
    let cancelled = false;
    const toTop = (attempt) => {
      if (cancelled) return;
      window.scrollTo({ top: 0, behavior: attempt === 0 ? "smooth" : "auto" });
      if (attempt < 3) setTimeout(() => toTop(attempt + 1), 250);
    };
    toTop(0);

    return () => {
      cancelled = true;
    };
  }, [messageParam]);

  const shareEntry = async (entry, index) => {
    const text = [`“${entry.sentiment[language]}”`, `— ${entry.author}`]
      .filter(Boolean)
      .join("\n");
    const title = "Just Because";
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl(entry) });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${shareUrl(entry)}`);
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
            <FaHeart /> {JUST_BECAUSE_SISTER_COUNT} {t.count}
          </span>
        </div>
      </div>

      <div className="jb-container">
        <div className="jb-filters" role="group" aria-label={language === "en" ? "Filter by topic" : "Filtra per tema"}>
          <button
            className={`jb-filter ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => {
              setFocusId(null);
              setFilter("all");
            }}
          >
            {t.all}
            <span className="jb-filter-count">{entries.length}</span>
          </button>
          {topicList.map((topic) => (
            <button
              key={topic.key}
              className={`jb-filter ${activeFilter === topic.key ? "active" : ""}`}
              onClick={() => {
                setFocusId(null);
                setFilter(topic.key);
              }}
            >
              {language === "en" ? topic.label.en : topic.label.it}
              <span className="jb-filter-count">{topic.count}</span>
            </button>
          ))}
        </div>

        <div className="jb-grid">
          {filtered.map((entry, index) => (
            <div className="jb-card-wrap" key={entry.id}>
              <GiftCard
                entry={entry}
                number={entry.sisterIndex + 1}
                cardRef={cardRefs[index]}
                language={language}
              />

              <div className="jb-card-tools">
                <CaptureCard
                  cardRef={cardRefs[index]}
                  title={entry.author}
                  subtitle={language === "en" ? entry.topic.en : entry.topic.it}
                  fileName={`just-because-${entry.author}`}
                  shareUrl={shareUrl(entry)}
                  shareText={`“${entry.sentiment[language]}” — ${entry.author}`}
                  buttonLabel={t.snapshot}
                  buttonClassName="jb-capture-btn"
                />
                <button
                  className={`jb-share ${copiedId === index ? "copied" : ""}`}
                  onClick={() => shareEntry(entry, index)}
                  aria-label={t.share}
                  title={t.share}
                >
                  {copiedId === index ? <FaTimes /> : <FaShareAlt />}
                  {copiedId === index ? t.copied : t.share}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {overlayOpen && (
        <div
          className="jb-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.sharedGift}
        >
          <div className="jb-overlay-panel">
            <div className="jb-overlay-head">
              <h2 className="jb-overlay-title">{t.sharedGift}</h2>
              <button
                className="jb-overlay-close"
                onClick={closeOverlay}
                aria-label={t.close}
                title={t.close}
              >
                <FaTimes />
              </button>
            </div>

            <div className="jb-overlay-body">
              <GiftCard
                entry={focusedEntry}
                number={focusedEntry.sisterIndex + 1}
                cardRef={overlayCardRef}
                language={language}
              />
            </div>

            <div className="jb-overlay-tools">
              <CaptureCard
                cardRef={overlayCardRef}
                title={focusedEntry.author}
                subtitle={
                  language === "en"
                    ? focusedEntry.topic.en
                    : focusedEntry.topic.it
                }
                fileName={`just-because-${focusedEntry.author}`}
                shareUrl={shareUrl(focusedEntry)}
                shareText={`“${focusedEntry.sentiment[language]}” — ${focusedEntry.author}`}
                buttonLabel={t.saveAsImage}
                buttonClassName="jb-capture-btn"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}