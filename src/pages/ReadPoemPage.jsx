// pages/ReadPoemPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { getAllPoems, resolvePrayerPhoto } from "../components/Utils.js";
import CaptureCard from "../components/CaptureCard.jsx";
import { FaArrowLeft, FaFeatherAlt, FaLink, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { DEFAULT_SEO, SITE_IMAGE_URL, SITE_NAME, useSeo } from "../utils/seo.js";
import "./ReadPoemPage.css";

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function PoemAuthorPhoto({ poem }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  useEffect(() => {
    let active = true;
    const loader = resolvePrayerPhoto(poem.photo);
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
  }, [poem]);

  if (!photoUrl) {
    return <div className="readpoem-photo readpoem-monogram">{getInitials(poem.author)}</div>;
  }
  return <img src={photoUrl} alt={poem.author} className="readpoem-photo" />;
}

export default function ReadPoemPage() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const poemCardRef = useRef(null);

  const poems = useMemo(() => getAllPoems(), []);
  const pId = Number(searchParams.get("pId"));
  const poem =
    Number.isInteger(pId) && pId >= 0 && pId < poems.length ? poems[pId] : null;
  const currentPoem = poem || poems[0] || null;
  const currentIndex = poem ? pId : 0;

  const t = useMemo(
    () => ({
      back: language === "en" ? "All Poems" : "Tutte le Poesie",
      sharePoem: language === "en" ? "Share Poem" : "Condividi Poesia",
      copied: language === "en" ? "Link Copied" : "Link Copiato",
      verseLabel: language === "en" ? "Verse" : "Strofa",
      poet: language === "en" ? "From the garden of" : "Dal giardino di",
      poemTitleFallback:
        language === "en" ? "A Flower of Prayer" : "Un Fiore di Preghiera",
    }),
    [language]
  );

  const shareUrl = () =>
    `${window.location.origin}${window.location.pathname}#/readpoem?pId=${currentIndex}`;

  const seo = useMemo(() => {
    if (!currentPoem) return DEFAULT_SEO;
    const cleanTitle = (currentPoem.title.en || "")
      .replace(/\s+/g, " ")
      .trim();
    return {
      title: `${cleanTitle} — ${currentPoem.author} ✦ ${SITE_NAME}`,
      description: `“${cleanTitle}” — a poem by ${currentPoem.author}. From the garden of the Sisters of Saint Joseph Cottolengo.`,
      url: window.location.href,
      image: SITE_IMAGE_URL,
    };
  }, [currentPoem]);
  useSeo(seo);

  const handleShare = async () => {
    const shareData = {
      title: "Fiori Di Preghiera",
      text: `“${
        language === "en" ? currentPoem.title.en : currentPoem.title.it
      }” — ${currentPoem.author}`,
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

  if (!currentPoem) {
    return (
      <div className="readpoem-page">
        <Header />
        <div className="readpoem-empty">
          <p>{language === "en" ? "No poems yet." : "Nessuna poesia."}</p>
          <Link to="/poems">← {t.back}</Link>
        </div>
      </div>
    );
  }

  const poemTitle = language === "en" ? currentPoem.title.en : currentPoem.title.it;
  const verses = language === "en" ? currentPoem.verses : currentPoem.verses;
  const verseList = Object.values(verses).map((v) => v[language] || v.en || []);
  const closer =
    (currentPoem.closer && currentPoem.closer[language]) || "DEO GRATIAS";

  return (
    <div className="readpoem-page">
      <Header />

      <div className="readpoem-container">
        <div className="readpoem-topbar">
          <Link to="/poems" className="readpoem-back-link">
            <FaArrowLeft /> {t.back}
          </Link>
          <div className="readpoem-top-actions">
            <button
              className={`readpoem-share ${copied ? "copied" : ""}`}
              onClick={handleShare}
              aria-label={t.sharePoem}
            >
              <FaLink /> {copied ? t.copied : t.sharePoem}
            </button>
            <CaptureCard
              cardRef={poemCardRef}
              title={currentPoem.author}
              subtitle={poemTitle}
              fileName={`poem-${currentPoem.author}`}
              shareUrl={shareUrl}
              shareText={`“${poemTitle}” — ${currentPoem.author}`}
              buttonLabel={language === "en" ? "Save Photo" : "Salva Foto"}
              buttonClassName="readpoem-share"
            />
          </div>
        </div>

        {/* Poem card */}
        <article className="readpoem-card" ref={poemCardRef}>
          <div className="readpoem-card-header">
            <div className="readpoem-author-row">
              <PoemAuthorPhoto key={currentIndex} poem={currentPoem} />
              <div className="readpoem-author-meta">
                <span className="readpoem-author-hint">{t.poet}</span>
                <cite className="readpoem-author">{currentPoem.author}</cite>
              </div>
            </div>
            <h1 className="readpoem-poem-title">
              <FaQuoteLeft className="readpoem-title-mark" />
              {poemTitle}
              <FaQuoteRight className="readpoem-title-mark" />
            </h1>
          </div>

          <div className="readpoem-body">
            {verseList.map((lines, index) => (
              <div key={index} className="readpoem-verse">
                {verseList.length > 1 && (
                  <span className="readpoem-verse-label">
                    {t.verseLabel} {index + 1}
                  </span>
                )}
                {lines.map((line, lineIndex) => (
                  <p key={lineIndex} className="readpoem-line">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="readpoem-card-footer">
            <span className="readpoem-closer">{closer}</span>
          </div>
        </article>

        <p className="readpoem-note">
          <FaFeatherAlt />{" "}
          {language === "en"
            ? "A flower of prayer, plucked for your garden."
            : "Un fiore di preghiera, colto per il tuo giardino."}
        </p>
      </div>
    </div>
  );
}