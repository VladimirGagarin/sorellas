import {useEffect } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { useNavigate } from 'react-router-dom';
import './App.css'

function App() {
  const navigate = useNavigate();

  // navigate to home after
  useEffect(() => {
    navigate('/home');
  }, []);

  return (
    <>
      
    </>
  )
}

export default App
