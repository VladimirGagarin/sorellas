// LitanyJosephPage.jsx
import { FaHammer } from "react-icons/fa";
import StJoseph1 from "../assets/st_joseph.jpg";
import StJoseph2 from "../assets/st.joseph.jpg";
import { getJosephLitany } from "../components/Utils";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme";
import LitanyPageTemplate from "../components/LitanyPageTemplate";

import "./LitanyJosephPage.css";
import Header from "../components/Header";

const JOSEPH_IMAGES = [StJoseph1, StJoseph2];

export default function LitanyJosephPage() {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();

  const litanyData = getJosephLitany().map((item, index) => ({
    title_en: item.en,
    title_it: item.it,
    id: `joseph-${index + 1}`,
    alt: item.en,
    image: JOSEPH_IMAGES[index % JOSEPH_IMAGES.length],
    response_en: "Pray for us.",
    response_it: "Prega per noi.",
  }));

  return (
    <div className="litany-joseph-page">
      <Header />
      <LitanyPageTemplate
        title={
          language === "en"
            ? "Litany of Saint Joseph"
            : "Litanie di San Giuseppe"
        }
        subtitle={
          language === "en"
            ? "A devotion to the humble guardian of the Holy Family"
            : "Una devozione all'umile custode della Santa Famiglia"
        }
        footerText={
          language === "en"
            ? "Saint Joseph, pray for us"
            : "San Giuseppe, prega per noi"
        }
        litany={litanyData}
        theme={isDarkMode ? "light" : "dark"}
        className="litany-joseph"
        icon={<FaHammer className="header-icon" />}
      />
    </div>
  );
}