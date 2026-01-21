import { useState } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <button
    <HomeScreenPage countprop={count} />
  )
}

export default App
