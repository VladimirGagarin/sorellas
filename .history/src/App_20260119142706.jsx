import {useEffect, useState } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import './App.css'


function App() {
  const navigate = useNavigate();
  const [isGoingHome, setIsGoingHome] = useState(false);

  const goHome = () => {
    navigate("/home");
  };

  // navigate to home after a certain period of time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGoingHome(true);
      isGoingHome && goHome();
    }, 2000);
    return () => clearTimeout(timer);
  }, [isGoingHome]);

  return (
    <>
      >
    </>
  )
}

export default App
