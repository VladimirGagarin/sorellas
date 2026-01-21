// Header.jsx - Updated for purple theme
import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaTimes,
  FaGlobe,
  FaMoon,
  FaSun,
  FaPray,
  FaInfoCircle,
  FaRegHeart,
  FaCross,
  FaHammer,
  FaQuestionCircle,
  FaStar,
  FaQuoteRight,
  FaFeatherAlt,
  FaSeedling,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme.jsx";
import "./Header.css";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const languageNames = {
    en: "English",
    it: "Italiano",
  };

  // Translations for both themes
  const translations = {
    en: {
      appName: "Fiori Di Preghiera",
      subtitle: isDarkMode ? "Mystical Garden" : "Spiritual Garden",
      home: "Garden Gate",
      prayerJournal: "Prayer Journal",
      about: "About the Garden",
      litanyOfMary: "Litany of the Blessed Virgin Mary",
      litanyOfJesus: "Litany of the Holy Name of Jesus",
      litanyOfSaintJoseph: "Litany of Saint Joseph",
      quotes: "Garden Quotes",
      settings: "Garden Tools",
      logout: "Return to Earth",
      rosesOfRome: "Roses of Rome",
      currentLanguage: "Language",
      welcome: isDarkMode
        ? "Welcome to the Mystical Garden"
        : "Welcome to the Spiritual Garden",
      menu: "Garden Paths",
      themeToggle: isDarkMode ? "Light Garden" : "Mystical Garden",
      themeLabel: isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme",
      themeDesc: isDarkMode
        ? "Switch to light garden"
        : "Switch to mystical purple garden",
    },
    it: {
      appName: "Fiori Di Preghiera",
      subtitle: isDarkMode ? "Giardino Mistico" : "Giardino Spirituale",
      home: "Porta del Giardino",
      prayerJournal: "Diario di Preghiera",
      about: "Sul Giardino",
      l
      myFlowers: "I Miei Fiori",
      settings: "Attrezzi da Giardino",
      logout: "Ritorno alla Terra",
      rosesOfRome: "Rose di Roma",
      currentLanguage: "Lingua",
      welcome: isDarkMode
        ? "Benvenuto nel Giardino Mistico"
        : "Benvenuto nel Giardino Spirituale",
      menu: "Sentieri del Giardino",
      themeToggle: isDarkMode ? "Giardino Luminoso" : "Giardino Mistico",
      themeLabel: isDarkMode ? "Passa al tema chiaro" : "Passa al tema scuro",
      themeDesc: isDarkMode
        ? "Passa al giardino luminoso"
        : "Passa al giardino mistico viola",
    },
  };

  const t = translations[language];

  // Flower colors that adapt to theme
  const getFlowerColor = (flowerType) => {
    if (isDarkMode) {
      switch (flowerType) {
        case "rose":
          return "#F472B6"; // Blush pink
        case "lily":
          return "#D8B4FE"; // Lavender
        case "oak":
          return "#FBBF24"; // Golden
        case "leaf":
          return "#10B981"; // Emerald
        default:
          return "#C4B5FD"; // Lavender
      }
    } else {
      switch (flowerType) {
        case "rose":
          return "#E91E63"; // Pink
        case "lily":
          return "#9C27B0"; // Purple
        case "oak":
          return "#5D4037"; // Brown
        case "leaf":
          return "#2E7D32"; // Green
        default:
          return "#7B1FA2"; // Purple
      }
    }
  };

  const drawerItems = [
    {
      icon: <FaHome />,
      label: t.home,
      link: "/",
      color: getFlowerColor("leaf"),
    },

    {
      icon: <FaPray />,
      label: t.prayers,
      link: "/prayers",
      description:
        language === "en"
          ? "Garden of Daily Prayers"
          : "Giardino delle Preghiere Quotidiane",
      color: getFlowerColor("rose"),
    },

    {
      icon: <FaInfoCircle />,
      label: t.about,
      link: "/about",
      color: isDarkMode ? "#60A5FA" : "#1976D2",
    },

    {
      icon: <FaRegHeart />,
      label: t.litanyOfMary,
      link: "/litany-mary",
      description:
        language === "en"
          ? "Litany of the Blessed Virgin Mary"
          : "Litanie della Beata Vergine Maria",
      color: getFlowerColor("lily"),
    },

    {
      icon: <FaCross />,
      label: t.litanyOfJesus,
      link: "/litany-jesus",
      description:
        language === "en"
          ? "Litany of the Holy Name of Jesus"
          : "Litanie del Santissimo Nome di Gesù",
      color: getFlowerColor("oak"),
    },

    {
      icon: <FaHammer />,
      label: t.litanyOfSaintJoseph,
      link: "/litany-joseph",
      description:
        language === "en"
          ? "Litany of Saint Joseph"
          : "Litanie di San Giuseppe",
      color: isDarkMode ? "#FBBF24" : "#8D6E63",
    },

    {
      icon: <FaQuestionCircle />,
      label: t.deepseekQuestions,
      link: "/deepseek",
      description:
        language === "en"
          ? "Questions for Deep Reflection"
          : "Domande per Riflessione Profonda",
      color: isDarkMode ? "#38BDF8" : "#0288D1",
    },

    {
      icon: <FaStar />,
      label: t.favouriteWords,
      link: "/favourite-words",
      description:
        language === "en"
          ? "Words That Touch the Soul"
          : "Parole che Toccono l’Anima",
      color: isDarkMode ? "#A78BFA" : "#7B1FA2",
    },

    {
      icon: <FaQuoteRight />,
      label: t.quotes,
      link: "/quotes",
      color: isDarkMode ? "#34D399" : "#388E3C",
    },

    {
      icon: <FaFeatherAlt />,
      label: t.justBecause,
      link: "/just-because",
      description:
        language === "en"
          ? "Prayers Without a Reason"
          : "Preghiere Senza Motivo",
      color: isDarkMode ? "#F472B6" : "#C2185B",
    },
  ];


  return (
    <>
      <header className="header">
        <nav className="nav-container">
          {/* Left side - Logo */}
          <div className="nav-left">
            <a href="#" className="home-link" onClick={toggleDrawer}>
              <div className="logo-container">
                <FaSeedling className="logo-icon" />
                <div className="app-titles">
                  <span className="app-name">{t.appName}</span>
                  <span className="app-subtitle">
                    {language === "en"
                      ? "Where prayers bloom like flowers"
                      : "Dove le preghiere sbocciano come fiori"}
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Right side - Controls */}
          <div className="nav-right">
            {/* Theme Toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={t.themeLabel}
              title={t.themeLabel}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Language Toggle */}
            <button
              className="language-toggle"
              onClick={() => changeLanguage(language === "en" ? "it" : "en")}
              aria-label={t.currentLanguage}
              title={`${t.currentLanguage}: ${languageNames[language]}`}
            >
              <FaGlobe className="globe-icon" />
              <span className="language-code">{language.toUpperCase()}</span>
            </button>

            {/* Menu Toggle */}
            <button
              className="menu-toggle"
              onClick={toggleDrawer}
              aria-label={t.menu}
            >
              {isDrawerOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer Overlay */}
      <div
        className={`drawer-overlay ${isDrawerOpen ? "active" : ""}`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-content">
            <FaSeedling className="drawer-header-icon" />
            <div>
              <h3>{t.menu}</h3>
              <p className="drawer-subtitle">{t.welcome}</p>
            </div>
          </div>
          <button
            className="drawer-close"
            onClick={closeDrawer}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="drawer-content">
          {drawerItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="drawer-item"
              onClick={closeDrawer}
              style={{ "--item-color": item.color }}
            >
              <span className="drawer-icon">{item.icon}</span>
              <div className="drawer-item-content">
                <span className="drawer-label">{item.label}</span>
                {item.description && (
                  <span className="drawer-description">{item.description}</span>
                )}
              </div>
            </a>
          ))}

          {/* Theme Toggle in Drawer */}
          <button
            className="drawer-item theme-toggle-item"
            onClick={() => {
              toggleTheme();
              closeDrawer();
            }}
          >
            <span className="drawer-icon">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </span>
            <div className="drawer-item-content">
              <span className="drawer-label">{t.themeToggle}</span>
              <span className="drawer-description">{t.themeDesc}</span>
            </div>
          </button>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="footer-content">
            <FaSeedling className="footer-icon" />
            <div>
              <p className="app-version">{t.rosesOfRome}</p>
              <p className="app-theme">Aeternum Floreamus</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
