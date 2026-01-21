import {useEffect, } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { useNavigate } from 'react-router-dom';
import Header from "./components/Header.jsx";
import { useLanguage } from "./contexts/useLanguage.js";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const { language, chang } = useLanguage();

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
