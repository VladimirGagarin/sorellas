import Header from "../components/Header.jsx";
import {useLanguage } from "../contexts/LanguageContext.jsx";
import "./AboutScreenPage.css";


export default function AboutScreenPage() {
    const { language } = useLanguage();
    const aboutArticles = [
        { articleTitle: { en: "About Fiori Di Preghiera", it: "Informazioni su Fiori di Preghiera" }, articleContent: { en: "Fiori di Preghiera is an app dedicated to bringing spiritual comfort through the beauty of flowers and prayers. Each flower represents a unique prayer, carefully selected to inspire and uplift your soul throughout the day.", it: "Fiori di Preghiera è un'app dedicata a portare conforto spirituale attraverso la bellezza dei fiori e delle preghiere. Ogni fiore rappresenta una preghiera unica, accuratamente selezionata per ispirare e elevare la tua anima durante la giornata." } },
        {articleTitle:{en: "Roses Of Rome Pictures", it: "Rose Di Roma Immagini"}, articleContent:{en: "Roses Of Rome Pictures is a film industry company that specializes in creating high-quality visual content for various media platforms. Their expertise lies in capturing the essence of stories through stunning imagery and cinematic techniques. We  are  connoisuers of  film music and  animation. We are passionate about bringing stories to life through visual storytelling. We are  also passionate  in blooming  this website 'Fiori Di Preghiera' and we hope this website will be  inspiring and  blessful to you.", it: "Roses Of Rome Pictures è una società del settore cinematografico specializzata nella creazione di contenuti visivi di alta qualità per varie piattaforme mediatiche. La loro esperienza risiede nel catturare l'essenza delle storie attraverso immagini straordinarie e tecniche cinematografiche. Siamo esperti di musica cinematografica e animazione. Siamo appassionati di portare le storie alla vita attraverso la narrativa visiva. S" } },
     ]

    
    return(
        <div>
            <Header />
            <h1>About Screen Page</h1>
        </div>
    )
}