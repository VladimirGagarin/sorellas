import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { LanguageProvider } from './contexts/language.jsx';
import { ThemeProvider } from './contexts/theme.jsx';
import AboutScreenPage from './pages/AboutScreenPage.jsx';
import GardenPage from "./pages/GardenPage.jsx";
import DeepSeekPage from './pages/DeepSeekPage.jsx';
import LitanyMaryPage from './pages/LitanyMaryPage.jsx';
import LitanyJesusPage from './pages/LitanyJesusPage.jsx';
import LitanyJosephPage from './pages/LitanyJosephPage.jsx';
import LitanyCottolengoPage from './pages/LitanyCottolengoPage.jsx';
import QuotesPage from './pages/QuotesPage.jsx';
import PrayersPage from './pages/PrayersPage.jsx';
import PrayerPage from './pages/PrayerPage.jsx';
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
    path: "garden",
    element: <GardenPage
  },
  {
    path: "deepseek",
    element: <DeepSeekPage/>
  },
{
      path: "litany-mary",
      element: <LitanyMaryPage/>  
    },
    {
      path: "litany-jesus",
      element: <LitanyJesusPage/>  
    },
    {
      path: "litany-joseph",
      element: <LitanyJosephPage/>  
    },
    {
      path: "litany-cottolengo",
      element: <LitanyCottolengoPage/>  
    },
    {
      path: "prayers",
      element: <PrayersPage />
    },
    {
      path: "prayer/:prayerId",
      element: <PrayerPage />
    },
    {
      path: "quotes",
      element: <QuotesPage />
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
