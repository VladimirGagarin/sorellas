import {useEffect } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { useNavigate } from 'react-router-dom';
import './App.css'

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/home');
  }, []);

  return (
    <>
      
    </>
  )
}

export default App
