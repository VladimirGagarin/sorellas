// Header.jsx
import React, { useState } from "react";
import { FaBars, FaHome, FaTimes, FaGlobe } from "react-icons/fa";
import {
  FaUser,
  FaCog,
  FaEnvelope,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";

import "./Header.css";

export default function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {language, changeLanguage} = useLanguage();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const drawerItems = [
    { icon: <FaHome />, label: language === "en" ? "Home" : "Casa", link: "/" },
    { icon: <FaUser />, label: language === "en" ? "Profile" : "Profilo", link: "/profile" },
    { icon: <FaEnvelope />, label: language === "en" ? "Messages" : "Messaggi", link: "/messages" },
    { icon: <FaCog />, label: language === "en" ? "Settings" : "Impostazioni", link: "/settings" },
    { icon: <FaInfoCircle />, label: language === "en" ? "About" : "Informazioni", link: "/about" },
{ icon: <FaSignOutAlt />, label: language === "en" ? "Logout" : "Esci", link: "/logout" },
    
  ];

  return (
    <>
      <header className="header">
        <nav className="nav-container">
          {/* Left side - Home icon */}
          <div className="nav-left">
            <a href="/" className="home-link">
              <span className="app-name">Fiori Di Preghiera</span>
            </a>
          </div>

          {/* Right side - Menu icon */}
          <div className="nav-right">
            <button
              className="menu-toggle"
              onClick={toggleDrawer}
              aria-label="Toggle menu"
            >
              {isDrawerOpen ? <FaTimes /> : <FaBars />}
                      </button>
            <button
              className="language-toggle"
              onClick={() =>
                changeLanguage(language === "en" ? "it" : "en")
              }
              aria-label="Toggle language"
            >
              {language === "en" ? "IT" : "EN"} <FaGlobe />
            </button>
                  </div>
                  
        </nav>
      </header>

      {/* Drawer Overlay & Content */}
      <div
        className={`drawer-overlay ${isDrawerOpen ? "active" : ""}`}
        onClick={closeDrawer}
      />

      <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <h3>Menu</h3>
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
            >
              <span className="drawer-icon">{item.icon}</span>
              <span className="drawer-label">{item.label}</span>
            </a>
          ))}
        </div>

        {/* Drawer Footer (Optional) */}
        <div className="drawer-footer">
          <p className="app-version">Rose</p>
        </div>
      </div>
    </>
  );
}
