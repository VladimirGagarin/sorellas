// pages/SistersDirectoryPage.jsx
// "Come and See" — an inspiring garden walk with the Sisters, for young
// hearts wondering whether the Lord is calling them to this life.
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../contexts/useLanguage.js";
import { sisterhood, resolvePrayerPhoto } from "../components/Utils.js";
import CaptureCard from "../components/CaptureCard.jsx";
import Header from "../components/Header.jsx";
import {
  FaFeatherAlt,
  FaHandSparkles,
  FaLightbulb,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { SITE_IMAGE_URL, SITE_NAME, useSeo } from "../utils/seo.js";
import "./SistersDirectoryPage.css";

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "☩";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function toSentenceCase(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, lead, ch) => lead + ch.toUpperCase());
}

function SisterAvatar({ sister }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  useEffect(() => {
    let active = true;
    const loader = sister.photo ? resolvePrayerPhoto(sister.photo) : null;
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
  }, [sister]);

  return (
    <span className="sd-avatar-wrap">
      {photoUrl ? (
        <img className="sd-avatar-img" src={photoUrl} alt={sister.sister} />
      ) : (
        <span className="sd-avatar-img sd-avatar-monogram">
          {getInitials(sister.sister)}
        </span>
      )}
    </span>
  );
}

function SisterCard({ sister, index, t }) {
  const cardRef = useRef(null);
  const { language } = useLanguage();
  const message = language === "en" ? sister.message?.en : sister.message?.it;
  const advice = language === "en" ? sister.advice?.en : sister.advice?.it;

  return (
    <div className="sd-sister">
      <div className="sd-save-header">
        <span className="sd-save-caption">
          <FaLightbulb /> {t.saveCaption}
        </span>
        <CaptureCard
          cardRef={cardRef}
          title={sister.sister}
          subtitle={t.mark}
          fileName={`insight-${sister.sister
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || `sister-${index + 1}`}`}
          shareText={`“${message || ""}” — ${sister.sister}`}
          buttonLabel={t.save}
          buttonClassName="sd-save-btn"
        />
      </div>

      <article className="sd-card" ref={cardRef}>
        <div className="sd-card-top">
          <SisterAvatar sister={sister} />
          <div className="sd-card-meta">
            <span className="sd-order">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="sd-name">{sister.sister}</h2>
            <span className="sd-grace">
              <FaHandSparkles /> {t.mark}
            </span>
          </div>
        </div>

        {message && (
          <blockquote className="sd-message">
            <FaQuoteLeft className="sd-quote-mark open" />
            <p>{toSentenceCase(message)}</p>
            <FaQuoteRight className="sd-quote-mark close" />
          </blockquote>
        )}

        {advice && (
          <div className="sd-advice">
            <span className="sd-advice-label">{t.adviceLabel}</span>
            <p>{advice}</p>
          </div>
        )}

        <span className="sd-card-mark" aria-hidden="true">
          {t.mark}
        </span>
      </article>
    </div>
  );
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SistersDirectoryPage() {
  const { language } = useLanguage();
  const sisters = useMemo(() => shuffleArray(sisterhood()), []);

  const t = useMemo(
    () => ({
      eyebrow:
        language === "en"
          ? "Come and See"
          : "Vieni e Vedi",
      title:
        language === "en"
          ? "Whispers of a Calling"
          : "Sussurri di una Chiamata",
      subtitle: (n) =>
        language === "en"
          ? `${n} sister${n === 1 ? "" : "s"}, one gentle answer to the question in your heart. Listen with silence — then decide with peace.`
          : `${n} suor${n === 1 ? "a" : "e"}, una risposta gentile alla domanda nel tuo cuore. Ascolta in silenzio — poi decidi in pace.`,
      count:
        language === "en"
          ? "sisters sharing their hearts"
          : "suore che aprono il cuore",
      messageLabel:
        language === "en" ? "Her heart" : "Il suo cuore",
      adviceLabel:
        language === "en" ? "Her gentle advice" : "Il suo dolce consiglio",
      save:
        language === "en" ? "Save Insight" : "Salva Intuizione",
      saveCaption:
        language === "en" ? "Listen" : "Ascolta",
      mark: "Aeternum Floreamus",
      verse:
        language === "en"
          ? "“Come and see.” — John 1:39"
          : "«Veni e vedere.» — Giovanni 1:39",
    }),
    [language]
  );

  useSeo({
    title: `Come and See ✦ ${SITE_NAME}`,
    description:
      "Whispers of a calling — the Sisters of Saint Joseph Cottolengo open their hearts to young women wondering about religious life.",
    image: SITE_IMAGE_URL,
  });

  // Gentle reveal as each card scrolls into view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".sd-card:not(.visible)"));
    if (typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sisters]);

  return (
    <div className="sd-page">
      <Header />

      {/* Hero */}
      <section className="sd-hero">
        <span className="sd-eyebrow">{t.eyebrow}</span>
        <h1 className="sd-title">{t.title}</h1>
        <p className="sd-subtitle">{t.subtitle(sisters.length)}</p>
        <div className="sd-hero-meta">
          <span>
            <FaFeatherAlt /> {sisters.length} {t.count}
          </span>
        </div>
        <p className="sd-verse">{t.verse}</p>
      </section>

      {/* Walking path of sisters */}
      <section className="sd-walk">
        {sisters.map((sister, index) => (
          <SisterCard
            key={sister.sister}
            sister={sister}
            index={index}
            t={t}
          />
        ))}
      </section>

      {/* Watermark — bottom right, outside the cards */}
      <div className="sd-watermark" aria-hidden="true">
        AETERNUM FLOREAMUS
      </div>
    </div>
  );
}