import Header from "../components/Header.jsx";
import {useLanguage } from "../contexts/LanguageContext.jsx";
import ""

export default function AboutScreenPage() {
    const { language } = useLanguage();

    return(
        <div>
            <Header />
            <h1>About Screen Page</h1>
        </div>
    )
}