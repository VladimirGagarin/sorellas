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
      prayers: "Prayer Journal",
      about: "About the Garden",
      litanyOfMary: "Litany of the Blessed Virgin Mary",
      litanyOfJesus: "Litany of Jesus",
      litanyOfSaintJoseph: "Litany of Saint Joseph",
      litanyOfCottolengo: "Litany of Cottolengo",
      quotes: "Garden Quotes",
      settings: "Garden Tools",
      logout: "Return to Earth",
      rosesOfRome: "Roses of Rome",
      deepseekQuestions: "Deepseek Questions",
      favouriteWords: "Favourite Words",
      justBecause: "Just Because",

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
      litanyOfMary: "Litanie della Beata Vergine Maria",
      litanyOfJesus: "Litanie del Santissimo Nome di Gesù",
      litanyOfSaintJoseph: "Litanie di San Giuseppe",
      litanyOfCottolengo: "Litanie di Cottolengo",
      quotes: "Citazioni del Giardino",
      deepseekQuestions: "Domande Deepseek",
      favouriteWords: "Parole Preferite",
      justBecause: "Solo Perché",
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
      color: getFlowerColor("lily"),
    },

    {
      icon: <FaCross />,
      label: t.litanyOfJesus,
      link: "/litany-jesus",
      color: getFlowerColor("oak"),
    },

    {
      icon: <FaHammer />,
      label: t.litanyOfSaintJoseph,
      link: "/litany-joseph",
      color: isDarkMode ? "#FBBF24" : "#8D6E63",
    },

    {
      icon: <FaSeedling />,
    }

    {
      icon: <FaQuestionCircle />,
      label: t.deepseekQuestions,
      link: "/deepseek",
      color: isDarkMode ? "#38BDF8" : "#0288D1",
    },

    {
      icon: <FaStar />,
      label: t.favouriteWords,
      link: "/favourite-words",
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
              </div>
            </a>
          ))}

         
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
