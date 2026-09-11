// LitanyCottolengoPage.jsx
import { FaPrayingHands } from "react-icons/fa";
import CottolengoImage from "../assets/cottolengo.jpg";
import { getCottolengoLitany } from "../components/Utils";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme";
import LitanyPageTemplate from "../components/LitanyPageTemplate";

import "./LitanyCottolengoPage.css";
import Header from "../components/Header";

export default function LitanyCottolengoPage() {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();

  const litanyData = getCottolengoLitany().map((item, index) => ({
    title_en: item.en,
    title_it: item.it,
    id: `cottolengo-${index + 1}`,
    alt: item.en,
    image: CottolengoImage,
    response_en: item.response_en || "Pray for us.",
    response_it: item.response_it || "Prega per noi.",
  }));

  return (
    <div className="litany-cottolengo-page">
      <Header />
      <LitanyPageTemplate
        title={
          language === "en"
            ? "Litany of St. Joseph Benedict Cottolengo"
            : "Litanie di San Giuseppe Benedetto Cottolengo"
        }
        subtitle={
          language === "en"
            ? "Trusting in Divine Providence, founder of the Piccola Casa"
            : "Confidando nella Divina Provvidenza, fondatore della Piccola Casa"
        }
        footerText={
          language === "en"
            ? "Caritas Christi urget nos — The love of Christ impels us"
            : "Caritas Christi urget nos — L'amore di Cristo ci sprona"
        }
        litany={litanyData}
        theme={isDarkMode ? "light" : "dark"}
        className="litany-cottolengo"
        icon={<FaPrayingHands className="header-icon" />}
      />
    </div>
  );
}