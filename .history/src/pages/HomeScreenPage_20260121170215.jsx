import { flowers } from "../components/Flower";
import FlowerCard from "../components/FlowerCard.jsx";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import "./HomeScreen.css";

export default function HomeScreenPage() {
  const { language } = useLanguage();
  
  return (
    <div className="home-screen">
      <Header />
      
      <div className="home-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {language === "en" 
                ? "Welcome to Your Spiritual Garden" 
                : "Benvenuto nel Tuo Giardino Spirituale"}
            </h1>
            <p className="hero-subtitle">
              {language === "en"
                ? "Where prayers bloom like flowers"
                : "Dove le preghiere sbocciano come fiori"}
            </p>
          </div>
          <div className="hero-decoration">
            <div className="flower-decoration"></div>
          </div>
        </section>

        {/* Flowers Grid */}
        <section className="flowers-section">
          <div className="section-header">
            <h2 className="section-title">
              {language === "en" ? "Spiritual Flowers" : "Fiori Spirituali"}
            </h2>
            <p className="section-subtitle">
              {language === "en"
                ? "Each flower represents a different prayer intention"
                : "Ogni fiore rappresenta un'intenzione di preghiera diversa"}
            </p>
          </div>

          <div className="flowers-grid">
            {flowers.map((flower) => (
              <FlowerCard
                key={flower.id}
                flower={flower}
                language={language}
              />
            ))}
          </div>
        </section>

        {/* Daily Flower Section */}
        <section className="daily-flower-section">
          <div className="section-header">
            <h2 className="section-title">
              {language === "en" ? "Today's Flower" : "Fiore del Giorno"}
            </h2>
            <p className="section-subtitle">
              {language === "en"
                ? "Focus on today's prayer intention"
                : "Concentrati sull'intenzione di preghiera di oggi"}
            </p>
          </div>
          
          <div className="daily-flower-container">
            {flowers.length > 0 && (
              <FlowerCard
                flower={flowers[0]} // Or logic to pick daily flower
                language={language}
                isDaily={true}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}