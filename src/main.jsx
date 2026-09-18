import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import HomeScreenPage from "./pages/HomeScreenPage.jsx";
import { LanguageProvider } from './contexts/language.jsx';
import { ThemeProvider } from './contexts/theme.jsx';
import AboutScreenPage from './pages/AboutScreenPage.jsx';
import GardenPage from "./pages/GardenPage.jsx";
import FeastDaysPage from "./pages/FeastDaysPage.jsx";
import DeepSeekPage from './pages/DeepSeekPage.jsx';
import LitanyMaryPage from './pages/LitanyMaryPage.jsx';
import LitanyJesusPage from './pages/LitanyJesusPage.jsx';
import LitanyJosephPage from './pages/LitanyJosephPage.jsx';
import LitanyCottolengoPage from './pages/LitanyCottolengoPage.jsx';
import QuotesPage from './pages/QuotesPage.jsx';
import PoemsPage from './pages/PoemsPage.jsx';
import ReadPoemPage from './pages/ReadPoemPage.jsx';
import PrayersPage from './pages/PrayersPage.jsx';
import PrayerPage from './pages/PrayerPage.jsx';
import FavoriteWordsPage from './pages/FavoriteWordsPage.jsx';
import JustBecausePage from './pages/JustBecausePage.jsx';
import TenderPresencePage from './pages/TenderPresencePage.jsx';
import DisclaimerPage from './pages/DisclaimerPage.jsx';
import SistersDirectoryPage from './pages/SistersDirectoryPage.jsx';
import DisclaimerModal from './components/DisclaimerModal.jsx';
import './index.css'
import App from './App.jsx'

const router = createHashRouter([
  {
    element: <DisclaimerModal />,
    children: [
      {
        index: true,
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
    element: <GardenPage />,
  },
  {
    path: "deepseek",
    element: <DeepSeekPage />
  },
  {
    path: "feasts",
    element: <FeastDaysPage />
  },
{
      path: "litany-mary",
      element: <LitanyMaryPage />  
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
    },
    {
      path: "come-and-see",
      element: <SistersDirectoryPage />
    },
    {
      path: "poems",
      element: <PoemsPage />
    },
    {
      path: "readpoem",
      element: <ReadPoemPage />
    },
    {
      path: "favourite-words",
      element: <FavoriteWordsPage />
    },
    {
      path: "just-because",
      element: <JustBecausePage />
    },
    {
      path: "tender-presence",
      element: <TenderPresencePage />
    },
    {
      path: "disclaimer",
      element: <DisclaimerPage />
    },
    ],
  },
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

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
  });
}
