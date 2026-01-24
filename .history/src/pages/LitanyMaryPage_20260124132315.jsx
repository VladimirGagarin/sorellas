import { getLitany } from "../components/Utils";
import { useLanguage } from "../contexts/useLanguage";
import { useTheme } from "../contexts/theme";
import LitanyPageTemplate from "../components/LitanyPageTemplate";


export default function LitanyMaryPage() {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const Litany = getLitany();
    return (
        <LitanyPageTemplate
            title="Litany of the Blessed Virgin Mary"
            litany=
            theme={theme}
        />
    );
}