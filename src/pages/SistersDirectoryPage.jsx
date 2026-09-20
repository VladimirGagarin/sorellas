// pages/SistersDirectoryPage.jsx
// "Come and See" — an inspiring garden walk with the Sisters, for young
// hearts wondering whether the Lord is calling them to this life.
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../contexts/useLanguage.js";
import { sisterhood, resolvePrayerPhoto } from "../components/Utils.js";
import CaptureCard from "../components/CaptureCard.jsx";
import Header from "../components/Header.jsx";
import {
  FaChurch,
  FaFeatherAlt,
  FaHandSparkles,
  FaHeart,
  FaLightbulb,
  FaQuoteLeft,
  FaQuoteRight,
  FaSeedling,
} from "react-icons/fa";
import { SITE_IMAGE_URL, useSeo } from "../utils/seo.js";
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
  const tiltRef = useRef(null);
  const frameRef = useRef(null);
  const { language } = useLanguage();
  const message = language === "en" ? sister.message?.en : sister.message?.it;
  const advice = language === "en" ? sister.advice?.en : sister.advice?.it;

  // Enable the 3D tilt only for fine pointers, and honour reduced motion.
  const canTilt = useMemo(
    () =>
      typeof window !== "undefined" &&
      Boolean(
        window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches
      ) &&
      !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  const rotateCard = (e) => {
    if (!canTilt || !tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = tiltRef.current;
      if (!el) return;
      el.style.setProperty("--rx", `${((0.5 - py) * 8).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * 10).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    });
  };

  const flushTilt = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "35%");
  };

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

      <div
        className="sd-tilt"
        ref={tiltRef}
        onMouseMove={rotateCard}
        onMouseLeave={flushTilt}
      >
        <span className="sd-glare" aria-hidden="true" />
        <article className="sd-card" ref={cardRef}>
          <div className="sd-card-top">
            <SisterAvatar sister={sister} />
            <div className="sd-card-meta">
              <span className="sd-order">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="sd-name">{sister.sister}</h3>
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
          ? "Want to become like us?"
          : "Vuoi diventare come noi?",
      subtitle:
        language === "en"
          ? `Every sister once paused before her yes. Let their gentle stories stir the quiet dream in your own heart — listen, and imagine the life that could be yours.`
          : `Ogni suora, un giorno, ha esitato davanti al suo sì. Lascia che le loro storie gentili accendano il sogno nel tuo cuore — ascolta e immagina la vita che potrebbe essere tua.`,
      count:
        language === "en"
          ? "sisters sharing their vocation stories"
          : "suore che condividono la loro storia vocazionale",
      walkTitle:
        language === "en"
          ? "Meet the Sisters Who Answered Yes"
          : "Incontra le suore che hanno risposto sì",
      aboutLead:
        language === "en"
          ? `Religious life begins with a simple question — and a single invitation. In the Gospel of John, Jesus turns to two curious disciples and says: “Come and see.” That is all He asks of you today. On this page you will meet real women — sisters of the Congregation of the Sisters of Saint Joseph Cottolengo — who once stood exactly where you stand, wondering whether God was calling them to something more.`
          : `La vita religiosa comincia con una domanda semplice — e un solo invito. Nel Vangelo di Giovanni, Gesù si rivolge a due discepoli curiosi e dice: «Venite e vedete.» Oggi non ti chiede altro. In questa pagina incontri donne vere — suore della Congregazione delle Suore di San Giuseppe Cottolengo — che un tempo si trovavano esattamente dove sei tu, chiedendosi se Dio le chiamasse a qualcosa di più.`,
      aboutWhoTitle:
        language === "en" ? "Who the Sisters are" : "Chi sono le Suore",
      aboutWhoBody:
        language === "en"
          ? "The women you are about to meet are consecrated religious — nurses and teachers, missionaries and mothers of communities — who have chosen a life of prayer, poverty, service and joy in community, following the charism of Blessed Giuseppe Cottolengo. Some have lived this life for decades; some are younger. Every one of them was once a young woman who had to ask herself the same question you are asking today: does God dream a different life for me?"
          : "Le donne che stai per incontrare sono religiose consacrate — infermiere e insegnanti, missionarie e madri di comunità — che hanno scelto una vita di preghiera, povertà, servizio e gioia in comunità, seguendo il carisma del Beato Giuseppe Cottolengo. Alcune vivono questa vita da decenni, altre sono più giovani. Ognuna di loro è stata una volta una giovane donna che ha dovuto chiedersi la stessa cosa che ti chiedi tu oggi: Dio sogna per me una vita diversa?",
      aboutWhatTitle:
        language === "en"
          ? "What you will find here"
          : "Cosa troverai qui",
      aboutWhatBody:
        language === "en"
          ? `A Catholic vocation story, straight from the heart. Each sister shares the moment she said yes to religious life, the fears she carried, and the grace that carried her. As you walk the garden path, ${sisters.length} sisters open their hearts in their own words. Read their messages, listen to their gentle advice, and save the insights that move you — each one becomes a keepsake card to keep close while your own discernment journey takes its time.`
          : `Una storia vocazionale cattolica, raccontata direttamente dal cuore. Ogni suora condivide il momento del suo sì alla vita religiosa, le paure che ha portato e la grazia che l'ha portata. Mentre percorri il sentiero del giardino, ${sisters.length} suore aprono il loro cuore con le loro parole. Leggi i loro messaggi, ascolta i loro dolci consigli e salva le intuizioni che ti toccano — ognuna diventa una cartolina ricordo da tenere vicino mentre il tuo cammino di discernimento prende il suo tempo.`,
      aboutWhyTitle:
        language === "en"
          ? "Why explore religious life"
          : "Perché esplorare la vita religiosa",
      aboutWhyBody:
        language === "en"
          ? "A vocation is not a verdict — it is a conversation. Exploring religious life is one of the most honest things a heart in love with God can do, because you only discover your calling by looking. The Catholic Church needs women who will pray without ceasing, nurse the sick, teach the young, serve the poor and stand beside the forgotten. Whether God calls you to become a sister or to a life of service in the world, your discernment begins with the same beautiful courage: listening."
          : "Una vocazione non è un verdetto — è una conversazione. Esplorare la vita religiosa è una delle cose più oneste che un cuore innamorato di Dio possa fare, perché si scopre la propria chiamata solo guardando. La Chiesa cattolica ha bisogno di donne che pregano senza sosta, curano gli ammalati, insegnano ai giovani, servono i poveri e stanno accanto ai dimenticati. Che Dio ti chiami a diventare suora o a una vita di servizio nel mondo, il tuo discernimento comincia con lo stesso bellissimo coraggio: ascoltare.",
      aboutHowTitle:
        language === "en"
          ? "How to begin"
          : "Come cominciare",
      aboutHowBody:
        language === "en"
          ? "Start simply. Read a few stories. Save the words that stir your soul. Say the little prayer the sisters love — “The Love of Christ Impels Us.” Then ask God one honest question: what do You dream for my life? The Shepherd does not shout; He whispers, often through a stranger, a song, or a story like the ones waiting for you below. Come and see."
          : "Comincia semplicemente. Leggi alcune storie. Salva le parole che toccano la tua anima. Di' la piccola preghiera che le suore amano — «La carità di Cristo ci spinge.» Poi fai a Dio una domanda onesta: cosa sogni per la mia vita? Il Pastore non grida; sussurra, spesso attraverso un estraneo, una canzone o una storia come quelle che ti aspettano qui sotto. Vieni e vedi.",
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
      endingQuote:
        language === "en"
          ? "The Love of Christ Impels Us to Do the Will of God"
          : "La carità di Cristo ci spinge a fare la volontà di Dio",
    }),
    [language, sisters]
  );

  useSeo({
    title: `Come and See | ${sisters.length} Sisters Share Their Catholic Vocation Stories`,
    description:
      "Come and see. The Sisters of Saint Joseph Cottolengo share Catholic vocation stories, recorded messages and gentle advice for young women discerning religious life — read, listen, and save the insights that move your heart as you explore what it means to become a sister.",
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

  // Structured data — an itemized list of the sisters for search engines.
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "sd-come-and-see-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name:
        language === "en"
          ? "Come and See — Vocation Stories of the Sisters of Saint Joseph Cottolengo"
          : "Vieni e Vedi — Storie Vocazionali delle Suore di San Giuseppe Cottolengo",
      description:
        language === "en"
          ? "Catholic vocation stories, messages and gentle advice shared by the Sisters of Saint Joseph Cottolengo for young women discerning religious life."
          : "Storie vocazionali cattoliche, messaggi e dolci consigli condivisi dalle Suore di San Giuseppe Cottolengo per le giovani donne in discernimento vocazionale.",
      numberOfItems: sisters.length,
      itemListElement: sisters.map((sister, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Person",
          name: sister.sister,
          description:
            (language === "en" ? sister.message?.en : sister.message?.it) ||
            undefined,
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById("sd-come-and-see-jsonld")?.remove();
    };
  }, [sisters, language]);

  return (
    <div className="sd-page">
      <Header />

      {/* Hero */}
      <section className="sd-hero">
        <span className="sd-eyebrow">{t.eyebrow}</span>
        <h1 className="sd-title">{t.title}</h1>
        <p className="sd-subtitle">{t.subtitle}</p>
        <div className="sd-hero-meta">
          <span>
            <FaFeatherAlt /> {sisters.length} {t.count}
          </span>
        </div>
        <p className="sd-verse">{t.verse}</p>
      </section>

      {/* Who we are — a word for seekers before the walk begins */}
      <section className="sd-about">
        <p className="sd-about-lead">{t.aboutLead}</p>
        <div className="sd-about-grid">
          <div className="sd-about-block">
            <FaHandSparkles className="sd-about-icon" />
            <h2 className="sd-about-title">{t.aboutWhoTitle}</h2>
            <p className="sd-about-body">{t.aboutWhoBody}</p>
          </div>
          <div className="sd-about-block">
            <FaHeart className="sd-about-icon" />
            <h2 className="sd-about-title">{t.aboutWhatTitle}</h2>
            <p className="sd-about-body">{t.aboutWhatBody}</p>
          </div>
          <div className="sd-about-block">
            <FaChurch className="sd-about-icon" />
            <h2 className="sd-about-title">{t.aboutWhyTitle}</h2>
            <p className="sd-about-body">{t.aboutWhyBody}</p>
          </div>
          <div className="sd-about-block">
            <FaSeedling className="sd-about-icon" />
            <h2 className="sd-about-title">{t.aboutHowTitle}</h2>
            <p className="sd-about-body">{t.aboutHowBody}</p>
          </div>
        </div>
      </section>

      {/* Walking path of sisters */}
      <section className="sd-walk">
        <h2 className="sd-walk-title">
          {t.walkTitle} · {sisters.length} {t.count}
        </h2>
        {sisters.map((sister, index) => (
          <SisterCard
            key={sister.sister}
            sister={sister}
            index={index}
            t={t}
          />
        ))}
      </section>

      {/* Ending — the sisterhood's own farewell */}
      <section className="sd-ending">
        <span className="sd-ending-ornament" aria-hidden="true">
          ✦ ❁ ✦
        </span>
        <p className="sd-ending-quote">{t.endingQuote}</p>
      </section>

      {/* Watermark — bottom right, outside the cards */}
      <div className="sd-watermark" aria-hidden="true">
        AETERNUM FLOREAMUS
      </div>
    </div>
  );
}