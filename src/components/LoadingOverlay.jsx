// components/LoadingOverlay.jsx — context-aware loading veil:
// - First ever open: full branded cycle
//   FIORI DI PREGHIERA → route welcome → AETERNUM FLOREAMUS → DEO GRATIAS.
// - Every later navigation or query-param change: a quick flash of the
//   route's welcome word (author name, flower name, litany, theme name…).
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/useLanguage.js";
import { getAllPoems, getAllPrayers, getQuotes } from "./Utils.js";
import { CATEGORY_LABELS } from "../pages/QuotesPage.jsx";
import flowers from "./Flower";
import "./LoadingOverlay.css";

const FULL_WORD_MS = 1600;
const FULL_TOTAL_MS = FULL_WORD_MS * 4 + 300;
const NAV_TOTAL_MS = 1600;

// Survives React StrictMode's double-mount: the full intro plays exactly once
// per app session; every later key change uses the quick mode.
let introPlayed = false;

const LITANY_NAMES = {
  "litany-mary": { en: "Mary", it: "Maria" },
  "litany-jesus": { en: "Jesus", it: "Gesù" },
  "litany-joseph": { en: "Joseph", it: "Giuseppe" },
  "litany-cottolengo": {
    en: "St. Joseph Cottolengo",
    it: "San Giuseppe Cottolengo",
  },
};

const PAGE_LABELS = {
  "/home": { en: "Welcome Home", it: "Benvenuti a Casa" },
  "/feasts": { en: "Happy Feast", it: "Buona Festa" },
  "/prayers": { en: "PRAYERS", it: "PREGHIERE" },
  "/about": { en: "About", it: "Chi Siamo" },
  "/deepseek": { en: "Deep Thoughts", it: "Pensieri Profondi" },
  "/favourite-words": { en: "Favourite Words", it: "Parole del Cuore" },
  "/just-because": { en: "Just Because", it: "Solo Perché" },
  "/tender-presence": { en: "Tender Presence", it: "Presenza Tenera" },
  "/poems": { en: "Poems", it: "Poesie" },
  "/disclaimer": { en: "A Gentle Word", it: "Una Parola Gentile" },
};

const normalizeCategory = (cat) =>
  !cat ? cat : cat === "Gratittude" ? "Gratitude" : cat;

function getRouteWelcome(location, language) {
  const en = language === "en";
  const path = location.pathname;
  const params = new URLSearchParams(location.search);

  // /prayer/127 → the author's name
  const prayerMatch = path.match(/^\/prayer\/(\d+)/);
  if (prayerMatch) {
    const list = getAllPrayers();
    const idx = parseInt(prayerMatch[1], 10);
    if (Number.isInteger(idx) && list[idx]) return list[idx].author;
  }

  // /garden?pray=4_en_Daisy → the flower's name
  if (path === "/garden") {
    const pray = params.get("pray");
    if (pray) {
      const [flowerId, lang] = pray.split("_");
      const flower = flowers.find((f) => f.id === flowerId);
      const useLang = lang === "en" || lang === "it" ? lang : language;
      if (flower && flower.name && flower.name[useLang]) {
        return flower.name[useLang];
      }
      const fromName = decodeURIComponent(pray.split("_").slice(2).join("_"));
      if (fromName) return fromName;
    }
    return en ? "WELCOME" : "BENVENUTI";
  }

  // /litany-mary … /litany-cottolengo → "Litany of …"
  const litanyKey = Object.keys(LITANY_NAMES).find((k) => path === `/${k}`);
  if (litanyKey) {
    const nm = LITANY_NAMES[litanyKey];
    return en ? `Litany of ${nm.en}` : `Litanie di ${nm.it}`;
  }

  // /quotes?theme=Joy&item=43 → "Author - Theme" (or "Theme | Author")
  if (path === "/quotes") {
    const theme = normalizeCategory(params.get("theme"));
    const themeLabel =
      theme && CATEGORY_LABELS[theme]
        ? CATEGORY_LABELS[theme][language]
        : en
        ? "Quotes"
        : "Citazioni";
    const itemRaw = params.get("item");
    const itemIdx = Number.parseInt(itemRaw, 10);
    if (Number.isInteger(itemIdx) && itemIdx >= 0) {
      const quote = getQuotes()
        .map((q, i) => ({ ...q, _id: i }))
        .find((q) => q._id === itemIdx);
      if (quote && quote.author) {
        return theme ? `${quote.author} - ${themeLabel}` : quote.author;
      }
    }
    return themeLabel;
  }

  // /readpoem?pId=10 → the poem's title in the current language
  if (path === "/readpoem") {
    const poems = getAllPoems();
    const pId = Number.parseInt(params.get("pId"), 10);
    if (Number.isInteger(pId) && pId >= 0 && pId < poems.length) {
      const title = poems[pId].title && poems[pId].title[language];
      if (title) return title;
    }
    return en ? "A Poem" : "Una Poesia";
  }

  // /come-and-see → the sisterhood's own motto
  if (path === "/come-and-see") {
    return en
      ? "The Love of Christ Impels Us to Do the Will of God"
      : "La carità di Cristo ci spinge a fare la volontà di Dio";
  }

  const page = PAGE_LABELS[path];
  if (page) return page[language];

  return en ? "WELCOME" : "BENVENUTI";
}

export default function LoadingOverlay() {
  const location = useLocation();
  const { language } = useLanguage();
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);
  const [mode, setMode] = useState("intro");

  // Every navigation (or first mount) restarts the veil; any previous cycle
  // is cancelled so a single timer always hides the overlay.
  useEffect(() => {
    const heading = !introPlayed;
    introPlayed = true;
    setMode(heading ? "intro" : "quick");
    setPhase(0);
    setShow(true);
    const timer = setTimeout(
      () => setShow(false),
      heading ? FULL_TOTAL_MS : NAV_TOTAL_MS
    );
    return () => clearTimeout(timer);
  }, [location.key]);

  // Word cycling only runs during the full intro cycle.
  useEffect(() => {
    if (!show || mode !== "intro") return;
    const id = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, FULL_WORD_MS);
    return () => clearInterval(id);
  }, [show, mode]);

  const welcome = getRouteWelcome(location, language);
  const isQuick = mode !== "intro";

  if (!show) return null;

  const words = [
    "FIORI DI PREGHIERA",
    welcome,
    "AETERNUM FLOREAMUS",
    "DEO GRATIAS",
  ];

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <p className="loading-eyebrow">
        {isQuick
          ? language === "en"
            ? "Continuing…"
            : "Proseguendo…"
          : language === "en"
          ? "The garden is opening…"
          : "Il giardino si apre…"}
      </p>
      <h1
        className="loading-word"
        key={isQuick ? welcome : phase}
        style={{ animationDuration: `${isQuick ? NAV_TOTAL_MS : FULL_WORD_MS}ms` }}
      >
        {isQuick ? welcome : words[phase]}
      </h1>
      <div className="loading-boxes" aria-hidden="true">
        <span className="loading-box" />
        <span className="loading-box" />
        <span className="loading-box" />
        <span className="loading-box" />
        <span className="loading-box" />
      </div>
    </div>
  );
}