import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaTimes,
  FaGlobe,
  FaPray,
  FaBookOpen,
  FaLeaf,
  FaHeart,
  FaCalendarAlt,
  FaFeatherAlt,
  FaSeedling,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";
import "./Header.css";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Translations object for cleaner code
  const translations = {
    en: {
      appName: "Fiori Di Preghiera",
      subtitle: "Spiritual Garden",
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
      welcome: "Welcome to the Garden",
      menu: "Garden Paths",
    },
    it: {
      appName: "Fiori Di Preghiera",
      subtitle: "Giardino Spirituale",
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
      welcome: "Benvenuto nel Giardino",
      menu: "Sentieri del Giardino",
    },
  };

  const t = translations[language];

  const drawerItems = [
    {
      icon: <FaHome />,
      label: t.home,
      link: "/",
      color: "#4CAF50", // Green for home/entry
    },
    {
      icon: <FaBookOpen />,
      label: t.prayerJournal,
      link: "/journal",
      color: "#2196F3", // Blue for journal
    },
    {
      icon: <FaHeart />,
      label: t.gratitude,
      link: "/gratitude",
      description:
        language === "en"
          ? "Rose - Gratitude Prayers"
          : "Rosa - Preghiere di Gratitudine",
      color: "#E91E63", // Pink for roses
    },
    {
      icon: <FaLeaf />,
      label: t.healing,
      link: "/healing",
      description:
        language === "en"
          ? "Lily - Healing Intentions"
          : "Giglio - Intenzioni di Guarigione",
      color: "#9C27B0", // Purple for lilies
    },
    {
      icon: <FaFeatherAlt />,
      label: t.reflections,
      link: "/reflections",
      description:
        language === "en"
          ? "Oak - Deep Reflections"
          : "Quercia - Riflessioni Profonde",
      color: "#795548", // Brown for oak
    },
    {
      icon: <FaCalendarAlt />,
      label: t.liturgicalCalendar,
      link: "/calendar",
      color: "#FF9800", // Orange for seasons
    },
    {
      icon: <FaSeedling />,
      label: t.myFlowers,
      link: "/my-flowers",
      color: "#4CAF50", // Green for growth
    },
    {
      icon: <FaPray />,
      label: t.settings,
      link: "/settings",
      color: "#607D8B", // Gray for tools
    },
  ];

  const languageNames = {
    en: "English",
    it: "Italiano",
  };

  return (
    <>
      <header className="header">
        <nav className="nav-container">
          {/* Left side - Logo and App Name */}
          <div className="nav-left">
            <a href="/" className="home-link">
              <div className="logo-container">
                <FaSeedling className="logo-icon" />
                <div className="app-titles">
                  <span className="app-name">{t.appName}</span>
                  <span className="app-subtitle">{t.subtitle}</span>
                </div>
              </div>
            </a>
          </div>

          {/* Right side - Language toggle and Menu */}
          <div className="nav-right">
            <button
              className="language-toggle"
              onClick={() => changeLanguage(language === "en" ? "it" : "en")}
              aria-label={t.currentLanguage}
              title={`${t.currentLanguage}: ${languageNames[language]}`}
            >
              <FaGlobe className="globe-icon" />
              <span className="language-code">{language.toUpperCase()}</span>
              <span className="language-name">{languageNames[language]}</span>
            </button>

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

      {/* Drawer - Now on left side */}
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
              <span className="drawer-icon" style={{ color: item.color }}>
                {item.icon}
              </span>
              <div className="drawer-item-content">
                <span className="drawer-label">{item.label}</span>
                {item.description && (
                  <span className="drawer-description">{item.description}</span>
                )}
              </div>
            </a>
          ))}

          {/* Separator for logout */}
          <div className="drawer-separator"></div>

          <a
            href="/logout"
            className="drawer-item logout-item"
            onClick={closeDrawer}
          >
            <span className="drawer-icon">
              <FaPray />
            </span>
            <div className="drawer-item-content">
              <span className="drawer-label">{t.logout}</span>
            </div>
          </a>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <div className="footer-content">
            <FaSeedling className="footer-icon" />
            <div>
              <p className="app-version">{t.rosesOfRome}</p>
              <p className="app-theme">
                {language === "en"
                  ? "Where prayers bloom like flowers"
                  : "Dove le preghiere sbocciano come fiori"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
