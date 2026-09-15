// pages/PoemsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import { getAllPoems, resolvePrayerPhoto } from "../components/Utils.js";
import { FaFeatherAlt, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { DEFAULT_SEO, SITE_IMAGE_URL, SITE_NAME, useSeo } from "../utils/seo.js";
import "./PoemsPage.css";

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
    return (
      <div className="poems-avatar poems-monogram">
        {getInitials(poem.author)}
      </div>
    );
  }
  return <img src={photoUrl} alt={poem.author} className="poems-avatar" />;
}

export default function PoemsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const poems = useMemo(() => getAllPoems(), []);

  const t = useMemo(
    () => ({
      eyebrow: language === "en" ? "Words in Bloom" : "Parole in Fiore",
      title: language === "en" ? "Garden of Poems" : "Giardino delle Poesie",
      subtitle:
        language === "en"
          ? "Little verses from the Sisters — flowers of prayer to carry with you."
          : "Piccoli versi delle Sorelle — fiori di preghiera da portare con te.",
      poemsCount: language === "en" ? "poems" : "poesie",
      open: language === "en" ? "Read Poem" : "Leggi la Poesia",
    }),
    [language]
  );

  const seo = useMemo(
    () => ({
      title: `Poems ✦ ${SITE_NAME}`,
      description:
        "Poems and verses from the Sisters of Saint Joseph Cottolengo – flowers of prayer to carry with you.",
      url: window.location.href,
      image: SITE_IMAGE_URL,
    }),
    []
  );
  useSeo(seo);

  return (
    <div className="poems-page">
      <Header />

      <div className="poems-hero">
        <span className="poems-eyebrow">{t.eyebrow}</span>
        <h1 className="poems-title">{t.title}</h1>
        <p className="poems-subtitle">{t.subtitle}</p>
        <div className="poems-hero-meta">
          <span>
            <FaFeatherAlt /> {poems.length} {t.poemsCount}
          </span>
        </div>
      </div>

      <div className="poems-grid-container">
        <div className="poems-grid">
          {poems.map((poem, index) => (
            <button
              key={index}
              className="poems-card"
              onClick={() => navigate(`/readpoem?pId=${index}`)}
              aria-label={`${t.open}: ${poem.author}`}
            >
              <div className="poems-card-avatar">
                <PoemAuthorPhoto poem={poem} />
              </div>
              <span className="poems-card-author">{poem.author}</span>
              <span className="poems-card-title">
                <FaQuoteLeft className="poems-card-quote" />
                {language === "en" ? poem.title.en : poem.title.it}
                <FaQuoteRight className="poems-card-quote" />
              </span>
              <span className="poems-card-open">{t.open}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}