import {useEffect, } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { useNavigate } from 'react-router-dom';
import Header from "./components/Header.jsx";
import { useLanguage } from "./contexts/useLanguage.js";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  // user  browser language if is IT change app language to IT
  const userLang = navigator.language || navigator.userLanguage;

  useEffect(() => {
    if (userLang.startsWith("it")) {
      changeLanguage("it");
    } else {
      changeLanguage("en");
    }
  }

  useEffect(() => {
    navigate("/home");
  }, []);

  return (
    <>
      <Header />
    </>
  );
}

export default App;
