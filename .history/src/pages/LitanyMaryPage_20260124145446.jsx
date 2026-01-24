// LitanyMaryPage.jsx
import { getLitany } from "../components/Utils";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme";
import LitanyPageTemplate from "../components/LitanyPageTemplate";
import{useL}
import "./LitanyMaryPage.css";
import Header from "../components/Header";

export default function LitanyMaryPage() {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const litanyData = getLitany();

  return (
    <div className="litany-mary-page">
      <Header />
      <LitanyPageTemplate
        title={
          language === "en"
            ? "Litany of the Blessed Virgin Mary"
            : "Litanie della Beata Vergine Maria"
        }
        litany={litanyData}
        theme={isDarkMode ? "light" : "dark"}
      />
    </div>
  );
}
