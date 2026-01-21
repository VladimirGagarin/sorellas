import { useState } from 'react'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)} classN >
        count
      </button>
     <p>Count is {count}</p>
    </>
  )
}

export default App
