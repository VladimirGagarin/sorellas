import Header from "../components/Header.jsx";
import {useLanguage } from "../contexts/LanguageContext.jsx";
import "./AboutScreenPage.css";


export default function AboutScreenPage() {
    const { language } = useLanguage();
    const aboutArticles = [
        {articleTitle: {en:}}
    ]

    
    return(
        <div>
            <Header />
            <h1>About Screen Page</h1>
        </div>
    )
}