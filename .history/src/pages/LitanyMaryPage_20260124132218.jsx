import { getLitany } from "../components/Utils";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme";
import LitanyPageTemplate from "../components/LitanyPageTemplate";
import { FaPray, FaHeart } from "react-icons/fa";

export default function LitanyMaryPage() {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const Litany = 
    return (
        <LitanyPageTemplate
            title="Litany of the Blessed Virgin Mary"
            litany={getLitany(language)}
            theme={theme}
        />
    );
}