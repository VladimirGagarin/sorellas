import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { LanguageProvider } from './contexts/language.jsx';
import { ThemeProvider } from './contexts/theme.jsx';
import AboutScreenPage from './pages/AboutScreenPage.jsx';
import DeepSeekPage from './pages/DeepSeekPage.jsx';

import './index.css'
import App from './App.jsx'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <App />,
  },
  {
    path: "home",
    element: <HomeScreenPage />,
  },
  {
    path: "about",
    element: <AboutScreenPage />,

  },
  {
    path: "deepseek",
    element: <DeepSeekPage/>
  },
  {
    path: "litany-mary",
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
