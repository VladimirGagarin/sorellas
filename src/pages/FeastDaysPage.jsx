// FeastDaysPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import {
  FaChevronLeft,
  FaChevronRight,
  FaWikipediaW,
  FaChurch,
  FaArrowRight,
  FaFireAlt,
  FaSun,
  FaMoon,
  FaTimes,
  FaExternalLinkAlt,
  FaGift,
  FaLightbulb,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  getFeastsForMonth,
  getAllFeastsForYear,
  getFeastsOnDate,
  getWikipediaUrl,
} from "../components/Utils.js";
import "./FeastDaysPage.css";

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_IT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

const FUN_FACTS = [
  {
    en: "August holds more saint feast days than any other month — over 50 major ones. Priests joke they never get a day off in August.",
    it: "Agosto conta più feste di santi di ogni altro mese — oltre 50 importanti. I preti scherzano che in agosto non hanno mai un giorno libero.",
  },
  {
    en: "The Church's New Year doesn't start on January 1st! It begins on the First Sunday of Advent, in late November or early December — a whole month before your regular New Year.",
    it: "Il Capodanno della Chiesa non inizia il 1° gennaio! Comincia con la Prima Domenica di Avvento, a fine novembre o inizio dicembre — un mese prima del Capodanno civile.",
  },
  {
    en: "February is the calendar's quiet month — the fewest saint days of all, thanks to its 28 days and the fact that Lent often knocks on its door.",
    it: "Febbraio è il mese più silenzioso del calendario — poche feste di santi, grazie ai suoi 28 giorni e al fatto che la Quaresima bussa spesso alla sua porta.",
  },
  {
    en: "A saint can have two feasts! St. John the Baptist is honoured on June 24 (his birth) and August 29 (his death). Most saints are celebrated on their death day, but John and Mary also on their birthdays — born without original sin.",
    it: "Un santo può avere due feste! San Giovanni Battista è celebrato il 24 giugno (nascita) e il 29 agosto (morte). Molti santi si festeggiano il giorno della morte, ma Giovanni e Maria anche nel giorno della nascita — nati senza peccato originale.",
  },
  {
    en: "Christmas used to be 40 days long — from December 25 to February 2, the Feast of the Presentation. So yes, you can leave your nativity scene up until February 2. Papa Francesco still does.",
    it: "Il Natale una volta durava 40 giorni — dal 25 dicembre al 2 febbraio, festa della Presentazione al Tempio. Quindi sì, puoi lasciare il presepe fino al 2 febbraio. Papa Francesco ancora lo fa.",
  },
  {
    en: "You can't have a funeral Mass on Holy Thursday, Good Friday, Holy Saturday, Easter Sunday, or Christmas — those feasts are simply too high.",
    it: "Non si può celebrare una Messa funebre né il Giovedì Santo, né il Venerdì Santo, né il Sabato Santo, né la Domenica di Pasqua, né a Natale — sono feste troppo solenni.",
  },
  {
    en: "All Saints' Day celebrates 10,000+ holy souls at once — including every unknown saint who never got their own day. Talk about a full calendar!",
    it: "Tutti i Santi celebra in un colpo solo più di 10.000 anime sante — compresi tutti i santi sconosciuti che non hanno mai avuto una loro festa. Che calendario pieno!",
  },
  {
    en: "June is the Month of the Sacred Heart thanks to the apparitions to St. Margaret Mary Alacoque — Pope Pius IX made it official in 1856. Now every Friday in June feels extra special.",
    it: "Giugno è il mese del Sacro Cuore grazie alle apparizioni a Santa Margherita Maria Alocoque — Papa Pio IX lo rese ufficiale nel 1856. Da allora ogni venerdì di giugno è davvero speciale.",
  },
  {
    en: "Some feasts never budge (Christmas, December 25) while others wander — Easter can fall between March 22 and April 25, a difference of 35 days. It just can't make up its mind.",
    it: "Alcune feste non si spostano mai (Natale, 25 dicembre) mentre altre vagano — la Pasqua può cadere dal 22 marzo al 25 aprile, una differenza di 35 giorni. Proprio non riesce a decidersi.",
  },
  {
    en: "The liturgical calendar has 6 seasons, not 4: Advent, Christmas, Ordinary Time, Lent, Easter, and Ordinary Time again. 'Ordinary' comes from 'ordinal' — counted weeks — not 'boring'. Even if 33 weeks of green can feel long!",
    it: "Il calendario liturgico ha 6 stagioni, non 4: Avvento, Natale, Tempo Ordinario, Quaresima, Pasqua e di nuovo Tempo Ordinario. 'Ordinario' viene da 'ordinale' — settimane contate — non da 'noioso'. Anche se 33 settimane di verde possono sembrare lunghe!",
  },
  {
    en: "Bonus! Your birthdate has a patron saint — born on May 13? Your feast is Our Lady of Fatima. Curious which saint guards your birthday?",
    it: "Bonus! La tua data di nascita ha un santo patrono — sei nato il 13 maggio? La tua festa è Nostra Signora di Fatima. Curioso di sapere quale santo veglia sul tuo compleanno?",
  },
  {
    en: "How does the Church decide Easter Sunday? Easy — the first Sunday after the first full moon after the spring equinox. Try explaining that rule to a first-grader!",
    it: "Come decide la Chiesa la Domenica di Pasqua? Facile — la prima domenica dopo la prima luna piena dopo l'equinozio di primavera. Prova a spiegare questa regola a un bambino di prima elementare!",
  },
  {
    en: "The Advent wreath counts down with fire! One new candle is lit on each of the four Sundays before Christmas — the smokiest (and oldest) countdown calendar in history.",
    it: "La corona dell'Avvento conta alla rovescia col fuoco! Si accende una candela nuova in ciascuna delle quattro domeniche prima di Natale — il calendario dell'Avvento più fumoso (e antico) della storia.",
  },
  {
    en: "Ash Wednesday falls 46 days before Easter — 40 days of Lent plus six Sundays, because Sunday is always a little feast, even during Lent.",
    it: "Il Mercoledì delle Ceneri cade 46 giorni prima di Pasqua — 40 giorni di Quaresima più sei domeniche, perché la domenica è sempre una piccola festa, anche in Quaresima.",
  },
  {
    en: "The Church changes colour like a fashion show: purple for Advent and Lent, white or gold for Christmas and Easter, red for Pentecost and martyrs, green for Ordinary Time — and rose, just twice a year (Gaudete and Laetare Sundays).",
    it: "La Chiesa cambia colore come in una sfilata: viola per Avvento e Quaresima, bianco o oro per Natale e Pasqua, rosso per Pentecoste e i martiri, verde per il Tempo Ordinario — e rosa, solo due volte l'anno (domeniche di Gaudete e Laetare).",
  },
  {
    en: "May is Mary's month, and October is the month of the Rosary — two full months set aside for the Madonna. Nobody ever got a month dedicated to cleaning the garage.",
    it: "Maggio è il mese di Maria e ottobre è il mese del Rosario — due mesi interi riservati alla Madonna. A nessuno è mai stato dedicato un mese per pulire il garage.",
  },
  {
    en: "Long ago the Church kept 'Ember Days' — three days of fasting in each of the four seasons to thank God for the harvest. A medieval season-cleaning for the soul.",
    it: "Tanto tempo fa la Chiesa aveva le 'Tempora' — tre giorni di digiuno in ciascuna delle quattro stagioni per ringraziare Dio del raccolto. Una pulizia medievale di stagione per l'anima.",
  },
  {
    en: "No sooner has Easter ended than the Church slips in three more feasts: Trinity Sunday, Corpus Christi, and the Sacred Heart. Just in case one big feast wasn't enough.",
    it: "Appena finita la Pasqua, la Chiesa inserisce altre tre feste: la Santissima Trinità, il Corpus Domini e il Sacro Cuore. In caso una grande festa non bastasse.",
  },
  {
    en: "September 29 is the feast of St. Michael the Archangel — 'Michaelmas'. In old England it was one of the four 'quarter days' when rents were due. Angels collecting rent: now that's real accountability.",
    it: "Il 29 settembre è la festa di San Michele Arcangelo — 'San Michele'. Nell'antica Inghilterra era uno dei quattro 'giorni di scadenza' in cui si pagavano gli affitti. Angeli che riscuotono l'affitto: questa sì che è vera puntualità.",
  },
  {
    en: "February 2 is Candlemas — 40 days after Christmas, when Mary presented Jesus in the Temple, and the day your nativity set may finally rest. Fun fact: the groundhog basically turned a Christian feast into a shadow show.",
    it: "Il 2 febbraio è la Candelora — 40 giorni dopo Natale, quando Maria presentò Gesù al Tempio, e il giorno in cui il tuo presepe può finalmente riposare. Curiosità: la marmotta ha trasformato una festa cristiana in uno spettacolo d'ombre.",
  },
];

function buildMonthCells(year, month, feasts) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mm = String(month + 1).padStart(2, "0");
  const cells = [];

  for (let i = 0; i < firstDow; i += 1) cells.push(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dd = String(day).padStart(2, "0");
    cells.push({
      day,
      dateStr: `${year}-${mm}-${dd}`,
      feasts: feasts.filter(
        (f) => f.date.slice(5, 7) === mm && f.date.slice(8) === dd
      ),
    });
  }

  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < trailing; i += 1) cells.push(null);

  return cells;
}

function formatLongDate(date, language) {
  return date.toLocaleDateString(language === "en" ? "en-US" : "it-IT", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr, language) {
  const [y, m, d] = dateStr.split("-");
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return dt.toLocaleDateString(language === "en" ? "en-US" : "it-IT", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function FeastDaysPage() {
  const { language } = useLanguage();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [overlay, setOverlay] = useState(null);
  const [factIndex, setFactIndex] = useState(0);
  const [factDir, setFactDir] = useState(1);
  const [copied, setCopied] = useState(false);

  const todayFeasts = getFeastsOnDate(today);
  const tomorrowFeasts = getFeastsOnDate(tomorrow);

  const allFeasts = getAllFeastsForYear(year);
  const monthFeasts = getFeastsForMonth(year, month);
  const monthName =
    language === "en" ? MONTHS_EN[month] : MONTHS_IT[month];
  const weekdays = language === "en" ? WEEKDAYS_EN : WEEKDAYS_IT;
  const cells = buildMonthCells(year, month, allFeasts);

  const todayStr = formatToday();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const monthTabs = (language === "en" ? MONTHS_EN : MONTHS_IT).map((m, i) => ({
    name: m,
    index: i,
  }));

  const t = {
    title: language === "en" ? "Feast Days" : "Giorni di Festa",
    subtitle:
      language === "en"
        ? "Saints and solemnities of the year, celebrated by the Church"
        : "Santi e solennità dell'anno, celebrati dalla Chiesa",
    calendar: language === "en" ? "Year Calendar" : "Calendario dell'Anno",
    feastsOf: language === "en" ? "Feasts of" : "Feste di",
    today: language === "en" ? "Today" : "Oggi",
    tomorrow: language === "en" ? "Tomorrow" : "Domani",
    celebratedToday:
      language === "en" ? "Celebrated today" : "Celebrata oggi",
    noFeastToday:
      language === "en"
        ? "No feast day is recorded for today."
        : "Nessuna festa è registrata per oggi.",
    noFeastTomorrow:
      language === "en"
        ? "No feast day is recorded for tomorrow."
        : "Nessuna festa è registrata per domani.",
    celebrateOn:
      language === "en" ? "Celebrated on" : "Celebrata il",
    viewOnWikipedia:
      language === "en" ? "View on Wikipedia" : "Vedi su Wikipedia",
    feastCount: (n) =>
      language === "en"
        ? `${n} feast${n > 1 ? "s" : ""}`
        : `${n} fest${n > 1 ? "e" : "a"}`,
    funFactTitle: language === "en" ? "Did You Know?" : "Lo Sapevi?",
    funFactSubtitle:
      language === "en"
        ? "Little secrets of the Catholic calendar, one card at a time"
        : "Piccoli segreti del calendario cattolico, una carta alla volta",
    funFactCopy: language === "en" ? "Copy" : "Copia",
    funFactCopied: language === "en" ? "Copied!" : "Copiato!",
    funFactCount: (n, total) =>
      language === "en"
        ? `Did You Know ${n} / ${total}`
        : `Lo Sapevi ${n} / ${total}`,
    explorePrayers:
      language === "en" ? "Explore Prayers" : "Esplora Preghiere",
    backHome: language === "en" ? "Back to Home" : "Torna alla Home",
  };

  const gotoFact = (dir) => {
    setFactDir(dir);
    setFactIndex((i) => (i + dir + FUN_FACTS.length) % FUN_FACTS.length);
    setCopied(false);
  };

  const copyFact = (fact) => {
    const text = `${fact.en}\n\n${fact.it}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  };

  const openOverlay = (dateStr, feasts) => {
    if (feasts.length === 0) return;
    setOverlay({ dateStr, feasts });
  };

  const closeOverlay = () => setOverlay(null);

  const dayBlock = (label, date, feasts, emptyMsg, isToday) => (
    <div className={`feast-day-block ${isToday ? "today" : "tomorrow"}`}>
      <div className="feast-day-head">
        <div className="feast-day-heading">
          <span className="feast-day-badge">
            {isToday ? <FaSun /> : <FaMoon />}
            {label}
          </span>
          <span className="feast-day-date">
            {formatLongDate(date, language)}
          </span>
        </div>
      </div>
      {feasts.length === 0 ? (
        <p className="feast-day-empty">{emptyMsg}</p>
      ) : (
        <div className="feast-day-list">
          {feasts.map((feast) => (
            <a
              key={`${label}-${feast.en}`}
              href={getWikipediaUrl(feast.en, language)}
              target="_blank"
              rel="noopener noreferrer"
              className="feast-day-item"
            >
              <span className="feast-day-item-name">
                {language === "en" ? feast.en : feast.it}
              </span>
              <span className="feast-day-item-wiki">
                <FaWikipediaW />
                <FaExternalLinkAlt />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="feast-page">
      <Header />
      <div className="feast-content">
        <section className="feast-hero">
          <span className="feast-hero-eyebrow">✦ {t.title} ✦</span>
          <h1 className="feast-hero-title">{t.title}</h1>
          <p className="feast-hero-subtitle">{t.subtitle}</p>
        </section>

        <section className="feast-day-sections">
          {dayBlock(t.today, today, todayFeasts, t.noFeastToday, true)}
          {dayBlock(t.tomorrow, tomorrow, tomorrowFeasts, t.noFeastTomorrow, false)}
        </section>

        <section className="feast-calendar-card glass">
          <div className="feast-calendar-head">
            <div className="feast-calendar-title">
              <FaChurch className="feast-calendar-icon" />
              <h2>
                {t.calendar} — {monthName} {year}
              </h2>
            </div>
            <div className="feast-year-nav">
              <button
                className="feast-year-btn"
                onClick={() => setYear(year - 1)}
                aria-label="Previous year"
              >
                <FaChevronLeft />
              </button>
              <span className="feast-year-label">{year}</span>
              <button
                className="feast-year-btn"
                onClick={() => setYear(year + 1)}
                aria-label="Next year"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="feast-nav">
            {monthTabs.map((tab) => (
              <button
                key={tab.index}
                className={`feast-month-tab ${month === tab.index ? "active" : ""}`}
                onClick={() => setMonth(tab.index)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="feast-weekdays">
            {weekdays.map((w) => (
              <span key={w} className="feast-weekday">
                {w}
              </span>
            ))}
          </div>
          <div className="feast-grid">
            {cells.map((cell, idx) =>
              cell === null ? (
                <div key={idx} className="feast-cell empty" />
              ) : (
                <div
                  key={idx}
                  className={`feast-cell ${
                    cell.feasts.length > 0 ? "has-feast" : ""
                  } ${isCurrentMonth && cell.dateStr === todayStr ? "today" : ""}`}
                  onClick={() => openOverlay(cell.dateStr, cell.feasts)}
                  role={cell.feasts.length > 0 ? "button" : undefined}
                  tabIndex={cell.feasts.length > 0 ? 0 : undefined}
                  onKeyDown={
                    cell.feasts.length > 0
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openOverlay(cell.dateStr, cell.feasts);
                          }
                        }
                      : undefined
                  }
                >
                  <span className="feast-day-num">{cell.day}</span>
                  {isCurrentMonth && cell.dateStr === todayStr && (
                    <span className="feast-today-badge">{t.today}</span>
                  )}
                  {cell.feasts.length > 0 && (
                    <span className="feast-cell-icon" title={t.feastCount(cell.feasts.length)}>
                      <FaGift />
                      {cell.feasts.length > 1 && (
                        <span className="feast-cell-count">
                          {cell.feasts.length}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        <section className="feast-cards-section">
          <div className="feast-cards-header">
            <FaFireAlt className="feast-cards-icon" />
            <h2>
              {t.feastsOf} {monthName} {year}
            </h2>
          </div>
          {monthFeasts.length === 0 ? (
            <p className="feast-no-cards">
              {language === "en"
                ? "No feast days recorded for this month."
                : "Nessuna festa registrata per questo mese."}
            </p>
          ) : (
            <div className="feast-cards">
              {monthFeasts.map((f) => {
                const dayNum = Number(f.date.slice(8));
                const mmdd = f.date.slice(5);
                return (
                  <div
                    key={`${f.en}-${mmdd}`}
                    className={`feast-card glass ${
                      isCurrentMonth && mmdd === todayStr.slice(5)
                        ? "is-today"
                        : ""
                    }`}
                  >
                    <div className="feast-card-date">
                      <span className="feast-card-day">{dayNum}</span>
                      <span className="feast-card-month">{monthName}</span>
                    </div>
                    <div className="feast-card-body">
                      <h3 className="feast-card-name">
                        {language === "en" ? f.en : f.it}
                      </h3>
                      <a
                        href={getWikipediaUrl(f.en, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="feast-card-wiki"
                      >
                        <FaWikipediaW />
                        Wikipedia
                        <FaExternalLinkAlt />
                      </a>
                    </div>
                    {isCurrentMonth && mmdd === todayStr.slice(5) && (
                      <span className="feast-card-today">{t.celebratedToday}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="fun-fact-corner">
          <div className="feast-cards-header">
            <FaLightbulb className="feast-cards-icon" />
            <div>
              <h2>{t.funFactTitle}</h2>
              <p className="fun-fact-subtitle">{t.funFactSubtitle}</p>
            </div>
          </div>
          <div className="fun-fact-card glass">
            <div className="fun-fact-head">
              <FaLightbulb className="fun-fact-bulb" />
              <span className="fun-fact-counter">
                {t.funFactCount(factIndex + 1, FUN_FACTS.length)}
              </span>
            </div>
            <div
              key={factIndex}
              className={`fun-fact-slide ${
                factDir === 1 ? "slide-in-right" : "slide-in-left"
              }`}
            >
              <p className="fun-fact-text">
                {language === "en"
                  ? FUN_FACTS[factIndex].en
                  : FUN_FACTS[factIndex].it}
              </p>
            </div>
            <div className="fun-fact-controls">
              <button
                className="fun-fact-nav-btn"
                onClick={() => gotoFact(-1)}
                aria-label="Previous fact"
              >
                <FaChevronLeft />
              </button>
              <button
                className="fun-fact-nav-btn"
                onClick={() => gotoFact(1)}
                aria-label="Next fact"
              >
                <FaChevronRight />
              </button>
              <button
                className={`fun-fact-copy ${copied ? "copied" : ""}`}
                onClick={() => copyFact(FUN_FACTS[factIndex])}
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? t.funFactCopied : t.funFactCopy}
              </button>
            </div>
          </div>
        </section>

        <div className="feast-footer-actions">
          <Link to="/prayers" className="feast-footer-btn primary">
            <FaChurch /> {t.explorePrayers} <FaArrowRight />
          </Link>
          <Link to="/home" className="feast-footer-btn ghost">
            {t.backHome}
          </Link>
        </div>
      </div>

      {/* Feast overlay */}
      {overlay && (
        <div
          className="feast-overlay-backdrop"
          onClick={closeOverlay}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="feast-overlay glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="feast-overlay-head">
              <div className="feast-overlay-heading">
                <FaChurch className="feast-overlay-icon" />
                <div>
                  <h2 className="feast-overlay-title">
                    {overlay.feasts.length === 1
                      ? language === "en"
                        ? overlay.feasts[0].en
                        : overlay.feasts[0].it
                      : t.feastCount(overlay.feasts.length)}
                  </h2>
                  <p className="feast-overlay-date">
                    {t.celebrateOn} {formatDateShort(overlay.dateStr, language)}
                  </p>
                </div>
              </div>
              <button
                className="feast-overlay-close"
                onClick={closeOverlay}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="feast-overlay-body">
              {overlay.feasts.map((feast) => (
                <div key={feast.en} className="feast-overlay-row">
                  <div className="feast-overlay-name">
                    <FaChurch className="feast-overlay-row-icon" />
                    <span>
                      {language === "en" ? feast.en : feast.it}
                    </span>
                  </div>
                  <a
href={getWikipediaUrl(feast.en, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="feast-overlay-wiki"
                  >
                    <FaWikipediaW />
                    {t.viewOnWikipedia}
                    <FaExternalLinkAlt />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatToday() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}