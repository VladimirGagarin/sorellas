import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  FaExternalLinkAlt,
  FaGlobe,
  FaYoutube,
  FaInstagram,
  FaGooglePlay,
  FaQuoteLeft,
  FaCross,
  FaPray,
  FaTiktok,
  FaDonate,
  FaSeedling,
  FaBookOpen,
  FaQuoteRight,
  FaMusic,
} from "react-icons/fa";
import { SITE_IMAGE_URL, SITE_NAME, useSeo } from "../utils/seo.js";
import "./AboutScreenPage.css";

// The sections this page offers to jump between. Declared once so the nav and
// nothing else can drift apart.
const NAV_SECTIONS = [
  {
    id: "about",
    label: { en: "About Us", it: "Chi Siamo" },
  },
  {
    id: "inspired",
    label: { en: "Inspired By", it: "Ispirato Da" },
  },
  {
    id: "app",
    label: { en: "Mobile App", it: "App Mobile" },
  },
];

// This app routes on the hash (#/about), so a plain href="#about" would replace
// the route with a fragment the router cannot read — landing on the home page
// instead. Scrolling by hand keeps the address untouched.
function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function AboutScreenPage() {
  const { language } = useLanguage();

  const pageTitle =
    language === "en"
      ? "About Fiori Di Preghiera | Catholic Prayer Garden"
      : "Chi Siamo | Fiori Di Preghiera";

  const pageDescription =
    language === "en"
      ? "Learn about Fiori Di Preghiera, the story behind this Catholic prayer garden, the people who inspired it, and the mobile app to pray on the go."
      : "Scopri Fiori Di Preghiera: la storia di questo giardino cattolico di preghiere, chi lo ha ispirato e l'app mobile per pregare ovunque tu sia.";

  useSeo({
    title: pageTitle,
    description: pageDescription,
    url: `${window.location.origin}${window.location.pathname}${window.location.hash}`,
    image: SITE_IMAGE_URL,
  });

  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return undefined;
    }
    const links = Array.from(document.querySelectorAll(".about-nav-link"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.dataset.navTarget === entry.target.id,
            );
          });
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -30% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Description text for the share image, which otherwise falls back to the
    // filename when a link is previewed.
    const alt = document.createElement("meta");
    alt.setAttribute("property", "og:image:alt");
    alt.setAttribute(
      "content",
      language === "en"
        ? "Fiori Di Preghiera — a Catholic garden of prayer and flowers"
        : "Fiori Di Preghiera — un giardino cattolico di preghiere e fiori",
    );
    document.head.appendChild(alt);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "about-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "#website",
          name: SITE_NAME,
          url: "https://vladimirgagarin.github.io/sorellas/",
          inLanguage: language === "it" ? "it-IT" : "en-US",
          publisher: { "@id": "#organization" },
        },
        {
          "@type": "Organization",
          "@id": "#organization",
          name: SITE_NAME,
          url: "https://vladimirgagarin.github.io/sorellas/",
          logo: SITE_IMAGE_URL,
        },
        {
          "@type": "WebPage",
          name: pageTitle,
          description: pageDescription,
          url: `${window.location.origin}${window.location.pathname}${window.location.hash}`,
          inLanguage: language === "it" ? "it-IT" : "en-US",
          isPartOf: { "@id": "#website" },
          about: { "@id": "#cottolengo" },
        },
        {
          "@type": "ReligiousOrganization",
          "@id": "#cottolengo",
          name: "Sisters of Saint Joseph Cottolengo",
          alternateName: "Suore di San Giuseppe Cottolengo",
          url: "https://cottolengo.org/",
          foundingDate: "1828",
          founder: {
            "@type": "Person",
            name: "St. Joseph Benedict Cottolengo",
          },
        },
      ],
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById("about-jsonld")?.remove();
      alt.remove();
    };
  }, [pageTitle, pageDescription, language]);

  const aboutArticles = [
    {
      articleTitle: {
        en: "About Fiori Di Preghiera",
        it: "Informazioni su Fiori di Preghiera",
      },
      articleContent: {
        en: "Fiori di Preghiera (Flowers of Prayer) is a spiritual garden where flowers meet faith and prayers bloom like flowers. Our mission is to provide daily spiritual nourishment through carefully curated prayers paired with the symbolic beauty of flowers. Each flower in our collection represents a unique prayer intention, carefully selected to inspire, comfort, and elevate your soul throughout the day. We believe that just as flowers bring beauty to our world, prayers bring grace to our souls.",
        it: "Fiori di Preghiera è un giardino spirituale dove i fiori incontrano la fede e le preghiere sbocciano come fiori. La nostra missione è fornire nutrimento spirituale quotidiano attraverso preghiere accuratamente selezionate abbinate alla bellezza simbolica dei fiori. Ogni fiore nella nostra collezione rappresenta un'intenzione di preghiera unica, selezionata con cura per ispirare, confortare ed elevare la tua anima durante la giornata. Crediamo che così come i fiori portano bellezza nel nostro mondo, le preghiere portano grazia nelle nostre anime.",
      },
      icon: "🌺",
      links: [
        {
          name: { en: "Website", it: "Sito Web" },
          url: "https://vladimirgagarin.github.io/fiori/",
          icon: <FaGlobe />,
        },
      ],
      stats: [
        { label: { en: "Daily Prayers", it: "Preghiere Giornaliere" }, value: "30+" },
        { label: { en: "Flower Species", it: "Specie di Fiori" }, value: "50+" },
        { label: { en: "Languages", it: "Lingue" }, value: "2" },
      ],
    },
    {
      articleTitle: { en: "Roses Of Rome Pictures", it: "Rose Di Roma Immagini" },
      articleContent: {
        en: "Roses Of Rome Pictures is a creative media production company specializing in cinematic storytelling, animation, and film scoring. We are passionate about creating visual narratives that touch hearts and inspire souls. Our expertise lies in capturing the essence of stories through stunning imagery, compelling animation, and beautiful film music. As creators of Fiori Di Preghiera, we combine our love for visual arts with our spiritual mission to create a digital sanctuary for prayer and reflection.",
        it: "Roses Of Rome Pictures è una società di produzione multimediale creativa specializzata in narrativa cinematografica, animazione e colonne sonore per film. Siamo appassionati di creare narrazioni visive che tocchino i cuori e ispirino le anime. La nostra esperienza risiede nel catturare l'essenza delle storie attraverso immagini straordinarie, animazioni coinvolgenti e bellissima musica cinematografica. Come creatori di Fiori Di Preghiera, uniamo il nostro amore per le arti visive con la nostra missione spirituale per creare un santuario digitale per la preghiera e la riflessione.",
      },
      icon: "🎬",
      links: [
        { name: { en: "YouTube", it: "YouTube" }, url: "https://www.youtube.com/@rosesofrome", icon: <FaYoutube /> },
        { name: { en: "Instagram", it: "Instagram" }, url: "https://www.instagram.com/rosesofrome", icon: <FaInstagram /> },
        { name: { en: "Tiktok", it: "Tiktok" }, url: "https://www.tiktok.com/@roses_of_rome", icon: <FaTiktok /> },
        { name: { en: "Website", it: "Sito Web" }, url: "https://vladimirgagarin.github.io/roses-of-rome/", icon: <FaGlobe /> },
        { name: { en: "Support Us", it: "Sostieni Ci" }, url: "https://vladimirgagarin.github.io/roses-of-rome/Support.html", icon: <FaDonate /> },
      ],
      stats: [
        { label: { en: "Years Experience", it: "Anni di Esperienza" }, value: "10+" },
        { label: { en: "Projects", it: "Progetti" }, value: "200+" },
        { label: { en: "Awards", it: "Premi" }, value: "15+" },
      ],
    },
    {
      articleTitle: { en: "Mobile App Experience", it: "Esperienza App Mobile" },
      articleContent: {
        en: "Our mobile app brings the garden to your fingertips. Designed with a user-friendly interface and intuitive navigation, it lets you carry your daily prayers wherever you go. Features include daily prayer reminders, prayer journaling, favorite collections, offline access, and beautiful flower-themed wallpapers.",
        it: "La nostra app mobile porta il giardino spirituale a portata di mano. Progettata con un'interfaccia user-friendly e una navigazione intuitiva, l'app ti permette di portare le tue preghiere quotidiane ovunque tu vada. Le funzionalità includono promemoria di preghiera giornalieri, diario delle preghiere, collezioni preferite, accesso offline e bellissimi sfondi a tema floreale. Sperimenta tutta la bellezza di Fiori Di Preghiera con funzionalità avanzate e un'esperienza mobile senza soluzione di continuità.",
      },
      icon: "📱",
      links: [
        {
          name: { en: "Download App", it: "Scarica l'App" },
          url: "https://github.com/VladimirGagarin/flowers/releases/download/v2.0.0/application-da5577c1-2f71-4814-a715-de861b103ae8.apk",
          icon: <FaGooglePlay />,
        },
      ],
      features: [
        { en: "Daily Prayer Notifications", it: "Notifiche Preghiera Giornaliere" },
        { en: "Prayer Journal", it: "Diario delle Preghiere" },
        { en: "Offline Access", it: "Accesso Offline" },
        { en: "Flower Gallery", it: "Galleria Fiori" },
      ],
    },
  ];

  const inspiredBy = [
    {
      name: { en: "St. Joseph Benedict Cottolengo", it: "San Giuseppe Benedetto Cottolengo" },
      title: { en: "Founder of the Cottolengo Family", it: "Fondatore della Famiglia Cottolengo" },
      description: {
        en: "Inspired by his dedication to serving the poorest and most abandoned, Cottolengo's mission of compassionate service and unconditional love forms the spiritual foundation of our work. His famous phrase 'God Provides' reminds us of divine providence in every endeavor.",
        it: "Ispirati dalla sua dedizione a servire i più poveri e abbandonati, la missione di servizio compassionevole e amore incondizionato di Cottolengo forma le fondamenta spirituali del nostro lavoro. La sua famosa frase 'Dio Provvede' ci ricorda della provvidenza divina in ogni impresa.",
      },
      role: "founder",
      imageColor: "var(--primary-green)",
      quote: { en: "God provides, always and in every circumstance.", it: "Dio provvede, sempre e in ogni circostanza." },
    },
    {
      name: { en: "Sister Mary Japheth", it: "Suor Maria Japheth" },
      title: { en: "Cottolengo Sister — Spiritual Guide", it: "Suora Cottolengo — Guida Spirituale" },
      description: {
        en: "A devoted Cottolengo sister whose gentle wisdom and deep prayer life inspired the contemplative dimension of this project. Her guidance on integrating prayer with daily life has shaped our approach to spiritual nourishment.",
        it: "Una devota suora Cottolengo la cui dolce saggezza e profonda vita di preghiera ha ispirato la dimensione contemplativa di questo progetto. La sua guida sull'integrazione della preghiera nella vita quotidiana ha plasmato il nostro approccio al nutrimento spirituale.",
      },
      role: "nun",
      imageColor: "var(--soft-blue)",
      quote: { en: "Every flower in God's garden has a prayer to teach us.", it: "Ogni fiore nel giardino di Dio ha una preghiera da insegnarci." },
    },
    {
      name: { en: "Father Gusto Crameri", it: "Padre Gusto Crameri" },
      title: { en: "Cottolengo Priest — Theological Advisor", it: "Sacerdote Cottolengo — Consulente Teologico" },
      description: {
        en: "His profound theological insights and pastoral experience helped shape the spiritual content and ensure the prayers' faithfulness to Catholic tradition while remaining accessible to all.",
        it: "I suoi profondi spunti teologici e l'esperienza pastorale hanno contribuito a modellare il contenuto spirituale e garantire la fedeltà delle preghiere alla tradizione cattolica rimanendo accessibili a tutti.",
      },
      role: "priest",
      imageColor: "var(--warm-orange)",
      quote: { en: "Prayer is the breath of the soul, as necessary as air is to the body.", it: "La preghiera è il respiro dell'anima, tanto necessaria quanto l'aria al corpo." },
    },
    {
      name: { en: "Cottolengo Sisters", it: "Suore Cottolengo" },
      title: { en: "Community of Prayer and Service", it: "Comunità di Preghiera e Servizio" },
      description: {
        en: "The entire community of Cottolengo Sisters, through their witness of joyful service and contemplative prayer, inspired the communal and intercessory aspects of this spiritual garden.",
        it: "L'intera comunità delle Suore Cottolengo, attraverso la loro testimonianza di servizio gioioso e preghiera contemplativa, ha ispirato gli aspetti comunitari e intercessori di questo giardino spirituale.",
      },
      role: "community",
      imageColor: "var(--soft-pink)",
      quote: { en: "In serving the least, we encounter Christ in every person.", it: "Servendo gli ultimi, incontriamo Cristo in ogni persona." },
    },
    {
      name: { en: "Cottolengo Priests", it: "Sacerdoti Cottolengo" },
      title: { en: "Spiritual Fathers and Guides", it: "Padri Spirituali e Guide" },
      description: {
        en: "The Cottolengo Priests' dedication to sacramental life and spiritual direction inspired the liturgical and sacramental dimensions incorporated into our prayer collection.",
        it: "La dedizione dei Sacerdoti Cottolengo alla vita sacramentale e alla direzione spirituale ha ispirato le dimensioni liturgiche e sacramentali incorporate nella nostra collezione di preghiere.",
      },
      role: "priests",
      imageColor: "var(--deep-purple)",
      quote: { en: "The Eucharist is the source and summit of all prayer.", it: "L'Eucaristia è la fonte e il culmine di ogni preghiera." },
    },
  ];

  const missionStatement = {
    en: "Where prayers are sown like seeds, blossom as flowers of faith, and fragrance the world with divine grace. A sanctuary where the soul's deepest longings find expression through nature's most beautiful vocabulary.",
    it: "Dove le preghiere sono seminate come semi, sbocciano come fiori di fede, e profumano il mondo con la grazia divina. Un santuario dove i desideri più profondi dell'anima trovano espressione attraverso il vocabolario più bello della natura.",
  };

  return (
    <div className="about-screen">
      <Header />

      <main className="about-container">
        <header className="about-hero">
          <h1 className="about-main-title">{SITE_NAME}</h1>
          <p className="about-subtitle">
            {language === "en" ? "Where flowers meet faith, and prayers bloom like flowers" : "Dove i fiori incontrano la fede, e preghiere sbocciano come fiori"}
          </p>
          <div className="mission-statement">
            <FaQuoteLeft className="quote-icon" aria-hidden="true" />
            <p>{missionStatement[language]}</p>
          </div>
        </header>

        <nav className="about-nav" aria-label={language === "en" ? "About sections" : "Sezioni su di noi"}>
          {NAV_SECTIONS.map((section, index) => (
            <button
              key={section.id}
              type="button"
              className={`about-nav-link ${index === 0 ? "active" : ""}`}
              data-nav-target={section.id}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label[language]}
            </button>
          ))}
        </nav>

        <div className="about-content">
          <section id="about" data-section className="about-section">
            <div className="section-head">
              <h2>{language === "en" ? "About Us" : "Chi Siamo"}</h2>
              <p>
                {language === "en"
                  ? "A Catholic prayer garden rooted in beauty, contemplation and service."
                  : "Un giardino cattolico di preghiere radicato nella bellezza, nella contemplazione e nel servizio."}
              </p>
            </div>

            <div className="about-articles">
              {aboutArticles.map((article, index) => (
                <article key={index} className="article-card">
                  <header className="article-header">
                    <span className="article-icon" aria-hidden="true">{article.icon}</span>
                    <h3>{article.articleTitle[language]}</h3>
                  </header>
                  <div className="article-body">
                    <p>{article.articleContent[language]}</p>
                    {article.stats && (
                      <div className="article-stats">
                        {article.stats.map((stat, idx) => (
                          <div key={idx} className="stat-item">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label[language]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {article.features && (
                      <div className="article-features">
                        <h4>{language === "en" ? "Features" : "Caratteristiche"}</h4>
                        <ul>
                          {article.features.map((feature, idx) => (
                            <li key={idx}>{feature[language]}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {article.links && article.links.length > 0 && (
                    <div className="article-links">
                      {article.links.map((link, idx) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                          {link.icon}
                          <span>{link.name[language]}</span>
                          <FaExternalLinkAlt className="external-icon" />
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="about-internal-links">
              <Link to="/garden" className="internal-link">
                <FaSeedling />
                {language === "en" ? "Explore the Flower Garden" : "Esplora il Giardino dei Fiori"}
              </Link>
              <Link to="/prayers" className="internal-link">
                <FaBookOpen />
                {language === "en" ? "Browse All Prayers" : "Esplora Tutte le Preghiere"}
              </Link>
              <Link to="/quotes" className="internal-link">
                <FaQuoteRight />
                {language === "en" ? "Garden of Quotes" : "Giardino delle Citazioni"}
              </Link>
              <Link to="/thankyou/" className="internal-link">
                <FaMusic />
                {language === "en" ? "Songs of the Sisters" : "Canti delle Suore"}
              </Link>
            </div>
          </section>

          <section id="inspired" data-section className="about-section inspired-section">
            <div className="section-head">
              <h2>{language === "en" ? "Inspired By" : "Ispirato Da"}</h2>
              <p>
                {language === "en"
                  ? "Fiori Di Preghiera draws inspiration from the Cottolengo Family and spiritual guides who embody compassion, prayer and service."
                  : "Fiori Di Preghiera trae ispirazione dalla Famiglia Cottolengo e da guide spirituali che incarnano compassione, preghiera e servizio."}
              </p>
            </div>
            <div className="inspired-grid">
              {inspiredBy.map((person, index) => (
                <article key={index} className="inspiration-card">
                  <header className="inspiration-header">
                    <div className="person-avatar" style={{ backgroundColor: person.imageColor }}>
                      {person.role === "founder" && <FaCross />}
                      {person.role === "nun" && <FaPray />}
                      {person.role === "priest" && <FaCross />}
                      {person.role === "community" && <FaPray />}
                      {person.role === "priests" && <FaCross />}
                    </div>
                    <div className="person-info">
                      <h3>{person.name[language]}</h3>
                      <p className="person-title">{person.title[language]}</p>
                    </div>
                  </header>
                  <blockquote className="inspiration-quote">
                    <FaQuoteLeft aria-hidden="true" />
                    <p>{person.quote[language]}</p>
                  </blockquote>
                  <div className="inspiration-description">
                    <p>{person.description[language]}</p>
                  </div>
                  <div className="role-badge">
                    <span className={`badge ${person.role}`}>
                      {person.role === "founder" && (language === "en" ? "Founder" : "Fondatore")}
                      {person.role === "nun" && (language === "en" ? "Sister" : "Suora")}
                      {person.role === "priest" && (language === "en" ? "Priest" : "Sacerdote")}
                      {person.role === "community" && (language === "en" ? "Community" : "Comunità")}
                      {person.role === "priests" && (language === "en" ? "Priests" : "Sacerdoti")}
                    </span>
                  </div>
                </article>
              ))}
            </div>
            <div className="cottolengo-legacy">
              <h3>{language === "en" ? "The Cottolengo Legacy" : "L'Eredità Cottolengo"}</h3>
              <p>
                {language === "en"
                  ? 'Founded by St. Joseph Benedict Cottolengo in 1828, the Cottolengo Family continues to serve the poorest and most abandoned worldwide. Their charism of "welcoming all as Christ" inspires our mission to make spiritual resources accessible to everyone.'
                  : 'Fondata da San Giuseppe Benedetto Cottolengo nel 1828, la Famiglia Cottolengo continua a servire i più poveri e abbandonati in tutto il mondo. Il loro carisma di "accogliere tutti come Cristo" ispira la nostra missione di rendere le risorse spirituali accessibili a tutti.'}
              </p>
            </div>
          </section>

          <section id="app" data-section className="about-section app-section">
            <div className="section-head">
              <h2>{language === "en" ? "Mobile App" : "App Mobile"}</h2>
              <p>
                {language === "en"
                  ? "The whole garden in your pocket — offline access, daily reminders, and the flowers you love."
                  : "Tutto il giardino in tasca — accesso offline, promemoria giornalieri e i fiori che ami."}
              </p>
            </div>
            <div className="app-hero">
              <div className="app-info">
                <p className="app-tagline">
                  {language === "en" ? "Pray wherever the day finds you" : "Prega ovunque ti trovi la giornata"}
                </p>
                <p className="app-description">
                  {language === "en"
                    ? "The full garden, with offline access and gentle daily reminders, in a seamless interface built for reflection on the go."
                    : "L'intero giardino, con accesso offline e gentili promemoria giornalieri, in un'interfaccia fluida pensata per la riflessione in movimento."}
                </p>
                <a
                  href="https://github.com/VladimirGagarin/flowers/releases/download/v2.0.0/application-da5577c1-2f71-4814-a715-de861b103ae8.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-btn"
                >
                  <FaGooglePlay />
                  <span>{language === "en" ? "Download the Android App" : "Scarica l'App Android"}</span>
                </a>
              </div>
              <div className="app-features">
                <h3>{language === "en" ? "App Features" : "Funzionalità dell'App"}</h3>
                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">🔔</div>
                    <div className="feature-text">
                      <h4>{language === "en" ? "Daily Reminders" : "Promemoria Giornalieri"}</h4>
                      <p>{language === "en" ? "Gentle prayer notifications" : "Notifiche gentili per la preghiera"}</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📖</div>
                    <div className="feature-text">
                      <h4>{language === "en" ? "Prayer Journal" : "Diario delle Preghiere"}</h4>
                      <p>{language === "en" ? "Personal prayer reflections" : "Riflessioni personali di preghiera"}</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">🌸</div>
                    <div className="feature-text">
                      <h4>{language === "en" ? "Flower Gallery" : "Galleria Fiori"}</h4>
                      <p>{language === "en" ? "Beautiful floral collection" : "Bellissima collezione floreale"}</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📱</div>
                    <div className="feature-text">
                      <h4>{language === "en" ? "Offline Access" : "Accesso Offline"}</h4>
                      <p>{language === "en" ? "Pray anywhere, anytime" : "Prega ovunque, in qualsiasi momento"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="about-cta">
            <h2>{language === "en" ? "Join Our Spiritual Community" : "Unisciti alla Nostra Comunità Spirituale"}</h2>
            <p>
              {language === "en"
                ? "Discover the beauty of prayer through flowers. Download our app or explore our website today."
                : "Scopri la bellezza della preghiera attraverso i fiori. Scarica la nostra app o esplora il nostro sito oggi stesso."}
            </p>
            <div className="cta-buttons">
              <a
                href="https://github.com/VladimirGagarin/flowers/releases/download/v2.0.0/application-da5577c1-2f71-4814-a715-de861b103ae8.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn primary"
              >
                <FaGooglePlay />
                {language === "en" ? "Get the App" : "Scarica l'App"}
              </a>
              <a href="https://vladimirgagarin.github.io/fiori/" target="_blank" rel="noopener noreferrer" className="cta-btn secondary">
                <FaGlobe />
                {language === "en" ? "Visit Website" : "Visita il Sito"}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}