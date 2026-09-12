// components/QuoteCard.jsx
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getQuotes, resolvePrayerPhoto } from "./Utils.js";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  FaCompass,
  FaLink,
  FaQuoteLeft,
  FaQuoteRight,
  FaRandom,
} from "react-icons/fa";
import "../pages/QuotesPage.css";

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
  "Spiritual Growth": {
    en: "Spiritual Growth",
    it: "Crescita Spirituale",
  },
  Humility: { en: "Humility", it: "Umiltà" },
  Gratitude: { en: "Gratitude", it: "Gratitudine" },
  Gratittude: { en: "Gratitude", it: "Gratitudine" },
  Latin: { en: "Latin", it: "Latino" },
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

// Photo loader component — remounts per quote (keyed by _id) so state resets.
function QuotePhoto({ quote }) {
  const [photoUrl, setPhotoUrl] = useState(undefined);

  useEffect(() => {
    let active = true;
    const loader = resolvePrayerPhoto(quote.photo);
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
  }, [quote]);

  return photoUrl ? (
    <img src={photoUrl} alt={quote.author} className="quotes-photo" />
  ) : (
    <div className="quotes-photo quotes-monogram">
      {getInitials(quote.author)}
    </div>
  );
}

export default function QuoteCard() {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const quotes = useMemo(
    () => getQuotes().map((q, i) => ({ ...q, _id: i })),
    []
  );

  const [quote, setQuote] = useState(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
  });

  const shuffleQuote = () => {
    let next = quote;
    if (quotes.length > 1) {
      do {
        const idx = Math.floor(Math.random() * quotes.length);
        next = quotes[idx];
      } while (next._id === quote._id);
    }
    setQuote(next);
    setCopied(false);
  };

  const category = CATEGORY_LABELS[quote.category] || {
    en: quote.category,
    it: quote.category,
  };
  const quoteText =
    language === "en" ? quote.quote : quote.italianQuote;
  const otherText =
    language === "en" ? quote.italianQuote : quote.quote;

  const t = {
    newQuote: language === "en" ? "New Quote" : "Nuova Citazione",
    moreQuotes:
      language === "en" ? "See More Quotes" : "Altre Citazioni",
    copyLink: language === "en" ? "Copy Link" : "Copia Link",
    copied: language === "en" ? "Link Copied" : "Link Copiato",
  };

  const shareUrl = () =>
    `${window.location.origin}${window.location.pathname}#/quotes?theme=${encodeURIComponent(quote.category)}&item=${quote._id}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <article className="quotes-card" key={quote._id}>
      <div className="quotes-card-header">
        <QuotePhoto key={quote._id} quote={quote} />
        <div className="quotes-card-meta">
          <cite className="quotes-author">{quote.author}</cite>
          <span className="quotes-category-badge">
            {category.en} · {category.it}
          </span>
        </div>
      </div>

      <div className="quotes-quote-body">
        <FaQuoteLeft className="quotes-open-mark" />
        <blockquote className="quotes-quote-text">{quoteText}</blockquote>
        <FaQuoteRight className="quotes-close-mark" />
      </div>

      {otherText && <p className="quotes-other-lang">{otherText}</p>}

      <div className="gold-rule" />

      <div className="quotes-actions">
        <Link to="/quotes" className="quotes-action explore">
          <FaCompass />
          {t.moreQuotes}
        </Link>
        <button className="quotes-action share" onClick={handleShare}>
          <FaLink /> {copied ? t.copied : t.copyLink}
        </button>
        <button className="quotes-action shuffle" onClick={shuffleQuote}>
          <FaRandom /> {t.newQuote}
        </button>
      </div>
    </article>
  );
}