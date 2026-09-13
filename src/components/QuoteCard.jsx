// components/QuoteCard.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getQuotes, resolvePrayerPhoto } from "./Utils.js";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  FaArrowRight,
  FaDownload,
  FaImage,
  FaLink,
  FaQuoteLeft,
  FaQuoteRight,
  FaRandom,
  FaShare,
  FaTimes,
} from "react-icons/fa";
import { toPng } from "html-to-image";
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
  const QuoteCardRef = useRef(null);
  const [snapShotCaptured, setSnapShotCaptured] = useState(null);

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
    moreQuotes: language === "en" ? "See More Quotes" : "Altre Citazioni",
    copyLink: language === "en" ? "Share Quote" : "Condividi",
    copied: language === "en" ? "Link Copied" : "Link Copiato",
    snapshot: language === "en" ? "Save Quote" : "Salva Citazione",
    previewTitle: language === "en" ? "Quote Preview" : "Anteprima Citazione",
    savePhoto: language === "en" ? "Save Photo" : "Salva Foto",
    sharePhoto: language === "en" ? "Share Photo" : "Condividi Foto",
    close: language === "en" ? "Close" : "Chiudi",
  };

  const shareUrl = () =>
    `${window.location.origin}${window.location.pathname}#/quotes?theme=${encodeURIComponent(quote.category)}&item=${quote._id}`;

  const handleShare = async () => {
    const shareData = {
      title: "Fiori Di Preghiera",
      text: `“${quoteText}” — ${quote.author}`,
      url: shareUrl(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const getSnapShotConf = () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    return {
      cacheBust: true,
      backgroundColor: isDark ? "#141a26" : "#fffdf6",
      pixelRatio: 2,
    };
  };

  const takeQuoteSnapShot = async () => {
    if (!QuoteCardRef.current) return;
    try {
      const dataUrl = await toPng(QuoteCardRef.current, getSnapShotConf());
      setSnapShotCaptured(dataUrl);
    } catch {
      /* image capture unavailable */
    }
  };

  const fileName = () =>
    `quote-${quote.author.replace(/\s+/g, "-").toLowerCase()}.png`;

  const downloadSnapShot = () => {
    if (!snapShotCaptured) return;
    const anchor = document.createElement("a");
    anchor.href = snapShotCaptured;
    anchor.download = fileName();
    anchor.click();
  };

  const shareSnapShot = async () => {
    if (!snapShotCaptured) return;
    try {
      const blob = await (await fetch(snapShotCaptured)).blob();
      const file = new File([blob], fileName(), { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t.previewTitle,
          text: quoteText,
        });
        return;
      }
    } catch {
      /* fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <article className="quotes-card" key={quote._id} ref={QuoteCardRef}>
        <div className="quotes-card-header">
          <QuotePhoto key={quote._id} quote={quote} />
          <div className="quotes-card-meta">
            <cite className="quotes-author">{quote.author}</cite>
            <Link
              to={`/quotes?theme=${encodeURIComponent(quote.category)}&item=${quote._id}`}
              className="quotes-action explore"
              data-html2canvas-ignore
            >
              {language === "en" ? category.en : category.it}
              <FaArrowRight />
            </Link>
          </div>
        </div>

        <div className="quotes-quote-body">
          <FaQuoteLeft className="quotes-open-mark" />
          <blockquote className="quotes-quote-text">{quoteText}</blockquote>
          <FaQuoteRight className="quotes-close-mark" />
        </div>

        {otherText && <p className="quotes-other-lang">{otherText}</p>}

        <div className="gold-rule" />

        <div className="quotes-actions" data-html2canvas-ignore>
          <button
            className="quotes-action share"
            onClick={takeQuoteSnapShot}
          >
            <FaImage />
            {t.snapshot}
          </button>
          <button className="quotes-action share" onClick={handleShare}>
            <FaLink /> {copied ? t.copied : t.copyLink}
          </button>
          <button className="quotes-action share" onClick={shuffleQuote}>
            <FaRandom /> {t.newQuote}
          </button>
        </div>
      </article>

      {snapShotCaptured && (
        <div className="image-preview-overlay">
          <div className="image-overlay-content">
            <div className="header-content">
              <div className="title">
                <h2>{quote.author}</h2>
                <p>{language === "en" ? category.en : category.it}</p>
              </div>
              <div className="close-overlay" onClick={() => setSnapShotCaptured(null)}>
                <span>
                  <FaTimes />
                </span>
              </div>
            </div>
            <div className="image-preiview-main">
              <img src={snapShotCaptured} alt={quote.author} />
            </div>

            <div className="image-preview-footer">
              <button className="quotes-action share" onClick={downloadSnapShot}>
                <FaDownload /> {t.savePhoto}
              </button>
              <button className="quotes-action share" onClick={shareSnapShot}>
                <FaShare /> {t.sharePhoto}
              </button>
              <button
                className="quotes-action share"
                onClick={() => setSnapShotCaptured(null)}
              >
                <FaTimes /> {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}