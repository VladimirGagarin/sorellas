import {useEffect } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { useNavigate } from 'react-router-dom';
import './App.css'


function App() {
  const navigate = useNavigate();

  
  // navigate to home after a certain period of time
  useEffect(() => {
    const timer = setTimeout(() => {
     goHome();
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
