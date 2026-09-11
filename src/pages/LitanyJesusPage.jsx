// LitanyJesusPage.jsx
import { FaHeart } from "react-icons/fa";
import { getJesusLitany } from "../components/Utils";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme";
import LitanyPageTemplate from "../components/LitanyPageTemplate";

import "./LitanyJesusPage.css";
import Header from "../components/Header";

export default function LitanyJesusPage() {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();

  const litanyData = getJesusLitany().map((item, index) => ({
    ...item,
    id: `jesus-${index + 1}`,
    alt: item.title_en,
    response_en: item.response_en || "Have mercy on us.",
    response_it: item.response_it || "Abbi pietà di noi.",
  }));

  return (
    <div className="litany-jesus-page">
      <Header />
      <LitanyPageTemplate
        title={
          language === "en"
            ? "Litany of the Sacred Heart of Jesus"
            : "Litanie del Sacro Cuore di Gesù"
        }
        subtitle={
          language === "en"
            ? "A devotion to the burning love of Christ"
            : "Una devozione all'amore ardente di Cristo"
        }
        footerText={
          language === "en"
            ? "Sacred Heart of Jesus, have mercy on us"
            : "Sacro Cuore di Gesù, abbi pietà di noi"
        }
        responseText={
          language === "en" ? "Have mercy on us." : "Abbi pietà di noi."
        }
        litany={litanyData}
        theme={isDarkMode ? "light" : "dark"}
        className="litany-jesus"
        icon={<FaHeart className="header-icon" />}
      />
    </div>
  );
}