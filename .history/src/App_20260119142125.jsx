import {useEffect, useState } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { useNavigate } from 'react-router-dom';
import './App.css'


function App() {
  const navigate = useNavigate();
  const [isGoingHome, setIsGoingHome] = useState(false);

  const goHome = () => {
    if()
  };

  // navigate to home after a certain period of time
  useEffect(() => {
    const timer = setTimeout(() => {
     setIsGoingHome(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HomeScreenPage />
    </>
  )
}

export default App
