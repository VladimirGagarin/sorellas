import { flowers } from "../components/Flower";
import FlowerCard from "../components";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import "./HomeScreen.css";

export default function HomeScreenPage() {
  const { language } = useLanguage();

  // Group flowers by DayTime
  const groupedFlowers = {
    morning: flowers.filter(
      (f) =>
        f.DayTime[language] === (language === "en" ? "Morning" : "Mattina"),
    ),
    midday: flowers.filter(
      (f) =>
        f.DayTime[language] === (language === "en" ? "Midday" : "Mezzogiorno"),
    ),
    evening: flowers.filter(
      (f) => f.DayTime[language] === (language === "en" ? "Evening" : "Sera"),
    ),
  };

  return (
    <div className="home-screen">
      <Header />

      <div className="home-content">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h1>
            🌸{" "}
            {language === "en"
              ? "Your Spiritual Garden"
              : "Il Tuo Giardino Spirituale"}{" "}
            🌸
          </h1>
          <p>
            {language === "en"
              ? "Select a flower to begin your prayer journey"
              : "Seleziona un fiore per iniziare il tuo viaggio di preghiera"}
          </p>
        </div>

        {/* Time-based Sections */}
        <div className="time-sections">
          {/* Morning Flowers */}
          <div className="time-section morning-section">
            <div className="time-header">
              <span className="time-icon">🌅</span>
              <h2>
                {language === "en"
                  ? "Morning Prayers"
                  : "Preghiere del Mattino"}
              </h2>
            </div>
            <div className="flowers-masonry">
              {groupedFlowers.morning.map((flower) => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  language={language}
                  compact={true}
                />
              ))}
            </div>
          </div>

          {/* Midday Flowers */}
          <div className="time-section midday-section">
            <div className="time-header">
              <span className="time-icon">☀️</span>
              <h2>
                {language === "en"
                  ? "Midday Prayers"
                  : "Preghiere del Mezzogiorno"}
              </h2>
            </div>
            <div className="flowers-masonry">
              {groupedFlowers.midday.map((flower) => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  language={language}
                  compact={true}
                />
              ))}
            </div>
          </div>

          {/* Evening Flowers */}
          <div className="time-section evening-section">
            <div className="time-header">
              <span className="time-icon">🌙</span>
              <h2>
                {language === "en" ? "Evening Prayers" : "Preghiere della Sera"}
              </h2>
            </div>
            <div className="flowers-masonry">
              {groupedFlowers.evening.map((flower) => (
                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  language={language}
                  compact={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
