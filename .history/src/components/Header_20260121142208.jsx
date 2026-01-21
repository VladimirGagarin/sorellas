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
  FaBookOpen,
  FaLeaf,
  FaHeart,
  FaCalendarAlt,
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
      gratitude: "Rose Garden",
      healing: "Lily Pond",
      reflections: "Oak Grove",
      liturgicalCalendar: "Sacred Seasons",
      myFlowers: "My Blossoms",
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
      gratitude: "Giardino delle Rose",
      healing: "Stagno dei Gigli",
      reflections: "Bosco di Querce",
      liturgicalCalendar: "Stagioni Sacre",
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
      icon: <FaBookOpen />,
      label: t.prayerJournal,
      link: "/journal",
      color: isDarkMode ? "#8B5CF6" : "#2196F3",
    },
    {
      icon: <FaHeart />,
      label: t.gratitude,
      link: "/gratitude",
      description:
        language === "en"
          ? "Rose - Gratitude Prayers"
          : "Rosa - Preghiere di Gratitudine",
      color: getFlowerColor("rose"),
    },
    {
      icon: <FaLeaf />,
      label: t.healing,
      link: "/healing",
      description:
        language === "en"
          ? "Lily - Healing Intentions"
          : "Giglio - Intenzioni di Guarigione",
      color: getFlowerColor("lily"),
    },
    {
      icon: <FaFeatherAlt />,
      label: t.reflections,
      link: "/reflections",
      description:
        language === "en"
          ? "Oak - Deep Reflections"
          : "Quercia - Riflessioni Profonde",
      color: getFlowerColor("oak"),
    },
    {
      icon: <FaCalendarAlt />,
      label: t.liturgicalCalendar,
      link: "/calendar",
      color: isDarkMode ? "#FBBF24" : "#FF9800",
    },
    {
      icon: <FaSeedling />,
      label: t.myFlowers,
      link: "/my-flowers",
      color: getFlowerColor("leaf"),
    },
    {
      icon: <FaPray />,
      label: t.settings,
      link: "/settings",
      color: isDarkMode ? "#94A3B8" : "#607D8B",
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
                  <span className="app-subtitle">{t.subtitle}</span>
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
              <p className="app-theme">
                Aeternum Floreamus
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
