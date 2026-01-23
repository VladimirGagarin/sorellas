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
  FaRegHeart,
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
      changeLanguage: "Change Language",
      selectLanguage: "Select Language",
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
      link: "/home",
      color: getFlowerColor("leaf"), // Life / entry
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
      color: isDarkMode ? "#93C5FD" : "#1E88E5", // Sky clarity
    },
    {
      icon: <FaChurch />,
      label: t.litanyOfMary,
      link: "/litany-mary",
      color: getFlowerColor("lily"), // Marian purity
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
      color: isDarkMode ? "#4ADE80" : "#2E7D32", // Charity / service
    },
    {
      icon: <FaQuestionCircle />,
      label: t.deepseekQuestions,
      link: "/deepseek",
      color: isDarkMode ? "#38BDF8" : "#0277BD", // Thought / inquiry
    },
    {
      icon: <FaStar />,
      label: t.favouriteWords,
      link: "/favourite-words",
      color: isDarkMode ? "#C4B5FD" : "#6A1B9A", // Reflection / beauty
    },
    {
      icon: <FaQuoteRight />,
      label: t.quotes,
      link: "/quotes",
      color: isDarkMode ? "#34D399" : "#2E7D32", // Wisdom / growth
    },
    {
      icon: <FaFeatherAlt />,
      label: t.justBecause,
      link: "/just-because",
      color: isDarkMode ? "#F9A8D4" : "#AD1457", // Grace / poetry
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
                    onClick={() => {changeLanguage("en"); closeDrawer();}}
                  >
                    <FaGlobe />
                    <span>English</span>
                  </button>
                  <button
                    className={`language-option ${language === "it" ? "active" : ""}`}
                    onClick={() => {changeLanguage("it"); closeDrawer();}}
                  >
                    <FaGlobe />
                    <span>Italiano</span>
                  </button>
                </div>
              </div>

              {/* Theme Section */}
              <div className="drawer-controls-section">
                <h4 className="drawer-controls-title">{t.themeLabel}</h4>
                <button className="theme-switch-button" onClick={() => { toggleTheme();  closeDrawer(); }}>
                  <div className="theme-switch-content">
                    {isDarkMode ? <FaSun /> : <FaMoon />}
                    <span>
                      {isDarkMode ? "Light" : "Mystical Garden"}
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
              <p className="app-version">{t.rosesOfRome}</p>
              <p className="app-theme">Aeternum Floreamus</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
