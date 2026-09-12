// Header.jsx - Updated with conditional button placement
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaTimes,
  FaGlobe,
  FaMoon,
  FaSun,
  FaPray,
  FaInfoCircle,
  
  FaCross,
  FaHammer,
  FaQuestionCircle,
  FaStar,
  FaQuoteRight,
  FaFeatherAlt,
  FaSeedling,
  FaPrayingHands,
  FaChurch,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme.jsx";
import "./Header.css";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 768);

  // Handle window resize to update isSmallDevice state
  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      home: "Welcome",
      garden: "Garden",
      prayers: "Prayer Journal",
      about: "Why Here?",
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
      welcome:  "Welcome to FLowers of Prayer Garden",
      menu: "Garden Paths",
      themeToggle: isDarkMode ? "Light Garden" : "Mystical Garden",
      themeLabel: isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme",
      themeDesc: isDarkMode
        ? "Switch to light garden"
        : "Switch to mystical purple garden",
      changeLanguage: "Change Language",
      selectLanguage: "Select Language",
    },
    it: {
      appName: "Fiori Di Preghiera",
      subtitle: isDarkMode ? "Giardino Mistico" : "Giardino Spirituale",
      home: "Benvenutti",
      garden: "Giardino",
      prayers: "Diario di Preghiera",
      about: "Perché Qui?",
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
      welcome: "Benvenuto nel Giardino dei Fiori di Preghiera",
      menu: "Sentieri del Giardino",
      themeToggle: isDarkMode ? "Giardino Luminoso" : "Giardino Mistico",
      themeLabel: isDarkMode ? "Passa al tema chiaro" : "Passa al tema scuro",
      themeDesc: isDarkMode
        ? "Passa al giardino luminoso"
        : "Passa al giardino mistico viola",
      changeLanguage: "Cambia Lingua",
      selectLanguage: "Seleziona Lingua",
    },
  };

  const t = translations[language];

  // Flower colors that adapt to theme
  const getFlowerColor = (flowerType) => {
    if (isDarkMode) {
      switch (flowerType) {
        case "rose":
          return "#D9734A"; // Candle rose
        case "lily":
          return "#D4A94C"; // Candle gold
        case "oak":
          return "#E0BE6A"; // Amber gold
        case "leaf":
          return "#9CA86A"; // Muted sage
        default:
          return "#C8A45C"; // Warm sand
      }
    } else {
      switch (flowerType) {
        case "rose":
          return "#A84B2A"; // Rosewood
        case "lily":
          return "#8C6D1F"; // Antique gold
        case "oak":
          return "#5D4037"; // Cathedral oak
        case "leaf":
          return "#4A5D36"; // Liturgical olive
        default:
          return "#8C6D1F"; // Antique gold
      }
    }
  };

  const drawerItems = [
    {
      icon: <FaHome />,
      label: t.home,
      link: "/home",
      color: getFlowerColor("leaf"), // Welcomes
    },
    {
      icon: <FaSeedling />,
      label: t.garden,
      link: "/garden",
      color: getFlowerColor("oak"), // garden
    },
    {
      icon: <FaPray />,
      label: t.prayers,
      link: "/prayers",
      color: getFlowerColor("rose"), // Devotion / love
    },
    {
      icon: <FaInfoCircle />,
      label: t.about,
      link: "/about",
      color: getFlowerColor("default"), // Warm sand
    },
    {
      icon: <FaChurch />,
      label: t.litanyOfMary,
      link: "/litany-mary",
      color: getFlowerColor("lily"), // Marian gold
    },
    {
      icon: <FaCross />,
      label: t.litanyOfJesus,
      link: "/litany-jesus",
      color: getFlowerColor("oak"), // Strength / sacrifice
    },
    {
      icon: <FaHammer />,
      label: t.litanyOfSaintJoseph,
      link: "/litany-joseph",
      color: isDarkMode ? "#D97706" : "#6D4C41", // Carpenter earth tone
    },
    {
      icon: <FaPrayingHands />,
      label: t.litanyOfCottolengo,
      link: "/litany-cottolengo",
      color: getFlowerColor("leaf"), // Charity / service
    },
    {
      icon: <FaQuestionCircle />,
      label: t.deepseekQuestions,
      link: "/deepseek",
      color: isDarkMode ? "#E0BE6A" : "#A85E1E", // Thought / inquiry
    },
    {
      icon: <FaStar />,
      label: t.favouriteWords,
      link: "/favourite-words",
      color: getFlowerColor("lily"), // Reflection / beauty
    },
    {
      icon: <FaQuoteRight />,
      label: t.quotes,
      link: "/quotes",
      color: getFlowerColor("leaf"), // Wisdom / growth
    },
    {
      icon: <FaFeatherAlt />,
      label: t.justBecause,
      link: "/just-because",
      color: getFlowerColor("rose"), // Grace / poetry
    },
  ];

  return (
    <>
      <header className="header">
        <nav className="nav-container">
          {/* Left side - Logo */}
          <div className="nav-left">
            <Link to="/" className="home-link">
              <div className="logo-container">
                {!isSmallDevice && <FaSeedling className="logo-icon" />}
                <div className="app-titles">
                  <span className="app-name">{t.appName}</span>
                  {!isSmallDevice && (
                    <span className="app-subtitle">{t.subtitle}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Right side - Controls */}
          <div className="nav-right">
            {/* Desktop: Language and Theme buttons */}
            {!isSmallDevice && (
              <>
                <button
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label={t.themeLabel}
                  title={t.themeLabel}
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />}
                </button>

                <button
                  className="language-toggle"
                  onClick={() =>
                    changeLanguage(language === "en" ? "it" : "en")
                  }
                  aria-label={t.currentLanguage}
                  title={`${t.currentLanguage}: ${languageNames[language]}`}
                >
                  <FaGlobe className="globe-icon" />
                  <span className="language-code">
                    {language.toUpperCase()}
                  </span>
                </button>
              </>
            )}

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
            <Link
              key={index}
              to={item.link}
              className="drawer-item"
              onClick={closeDrawer}
              style={{ "--item-color": item.color }}
            >
              <span className="drawer-icon">{item.icon}</span>
              <div className="drawer-item-content">
                <span className="drawer-label">{item.label}</span>
              </div>
            </Link>
          ))}

          {/* Mobile: Language and Theme buttons inside drawer */}
          {isSmallDevice && (
            <>
              {/* Language Section */}
              <div className="drawer-controls-section">
                <h4 className="drawer-controls-title">{t.selectLanguage}</h4>
                <div className="language-buttons">
                  <button
                    className={`language-option ${language === "en" ? "active" : ""}`}
                    onClick={() => {
                      changeLanguage("en");
                      closeDrawer();
                    }}
                  >
                    <FaGlobe />
                    <span>English</span>
                  </button>
                  <button
                    className={`language-option ${language === "it" ? "active" : ""}`}
                    onClick={() => {
                      changeLanguage("it");
                      closeDrawer();
                    }}
                  >
                    <FaGlobe />
                    <span>Italiano</span>
                  </button>
                </div>
              </div>

              {/* Theme Section */}
              <div className="drawer-controls-section">
                <h4 className="drawer-controls-title">{t.themeLabel}</h4>
                <button
                  className="theme-switch-button"
                  onClick={() => {
                    toggleTheme();
                    closeDrawer();
                  }}
                >
                  <div className="theme-switch-content">
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                    <span>
                      {isDarkMode
                        ? language === "en"
                          ? "Light Mode"
                          : "Modalità Chiara"
                        : language === "en"
                          ? "Dark Mode"
                          : "Modalità Scura"}
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="footer-content">
            <FaSeedling className="footer-icon" />
            <div>
              <p className="app-version">
                <a href="https://www.youtube.com/@rosesofrome" target="_blank">{t.rosesOfRome}</a>
              </p>
              <p className="app-theme">Aeternum Floreamus</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
