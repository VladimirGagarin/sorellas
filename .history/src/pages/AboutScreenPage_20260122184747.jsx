import Header from "../components/Header.jsx";
import {useLanguage } from "../contexts/LanguageContext.jsx";
import "./AboutScreenPage.css";


export default function AboutScreenPage() {
    const { language } = useLanguage();
    const aboutArticles = [
        { articleTitle: { en: "About Fiori Di Preghiera", it: "Informazioni su Fiori di Preghiera" }, articleContent: { en: "Fiori di Preghiera is an app dedicated to bringing spiritual comfort through the beauty of flowers and prayers. Each flower represents a unique prayer, carefully selected to inspire and uplift your soul throughout the day.", it: "Fiori di Preghiera è un'app dedicata a portare conforto spirituale attraverso la bellezza dei fiori e delle preghiere. Ogni fiore rappresenta una preghiera unica, accuratamente selezionata per ispirare e elevare la tua anima durante la giornata." } },
        {articleTitle:{en: "Roses Of Rome Pictures", it: "Rose Di Roma Immagini"}, articleContent:{en:}}
     ]

    
    return(
        <div>
            <Header />
            <h1>About Screen Page</h1>
        </div>
    )
}