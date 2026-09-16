// FeastDaysPage.jsx
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import CaptureCard from "../components/CaptureCard.jsx";
import {
  FaChevronLeft,
  FaChevronRight,
  FaWikipediaW,
  FaChurch,
  FaArrowRight,
  FaFireAlt,
  FaSun,
  FaMoon,
  FaTimes,
  FaExternalLinkAlt,
  FaGift,
  FaLightbulb,
} from "react-icons/fa";
import { useLanguage } from "../contexts/useLanguage.js";
import {
  getFeastsForMonth,
  getAllFeastsForYear,
  getFeastsOnDate,
  getWikipediaUrl,
} from "../components/Utils.js";
import "./FeastDaysPage.css";

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_IT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

const FUN_FACTS = [
  {
    en: "August holds more saint feast days than any other month — over 50 major ones. Priests joke they never get a day off in August.",
    it: "Agosto conta più feste di santi di ogni altro mese — oltre 50 importanti. I preti scherzano che in agosto non hanno mai un giorno libero.",
  },
  {
    en: "The Church's New Year doesn't start on January 1st! It begins on the First Sunday of Advent, in late November or early December — a whole month before your regular New Year.",
    it: "Il Capodanno della Chiesa non inizia il 1° gennaio! Comincia con la Prima Domenica di Avvento, a fine novembre o inizio dicembre — un mese prima del Capodanno civile.",
  },
  {
    en: "February is the calendar's quiet month — the fewest saint days of all, thanks to its 28 days and the fact that Lent often knocks on its door.",
    it: "Febbraio è il mese più silenzioso del calendario — poche feste di santi, grazie ai suoi 28 giorni e al fatto che la Quaresima bussa spesso alla sua porta.",
  },
  {
    en: "A saint can have two feasts! St. John the Baptist is honoured on June 24 (his birth) and August 29 (his death). Most saints are celebrated on their death day, but John and Mary also on their birthdays — born without original sin.",
    it: "Un santo può avere due feste! San Giovanni Battista è celebrato il 24 giugno (nascita) e il 29 agosto (morte). Molti santi si festeggiano il giorno della morte, ma Giovanni e Maria anche nel giorno della nascita — nati senza peccato originale.",
  },
  {
    en: "Christmas used to be 40 days long — from December 25 to February 2, the Feast of the Presentation. So yes, you can leave your nativity scene up until February 2. Papa Francesco still does.",
    it: "Il Natale una volta durava 40 giorni — dal 25 dicembre al 2 febbraio, festa della Presentazione al Tempio. Quindi sì, puoi lasciare il presepe fino al 2 febbraio. Papa Francesco ancora lo fa.",
  },
  {
    en: "You can't have a funeral Mass on Holy Thursday, Good Friday, Holy Saturday, Easter Sunday, or Christmas — those feasts are simply too high.",
    it: "Non si può celebrare una Messa funebre né il Giovedì Santo, né il Venerdì Santo, né il Sabato Santo, né la Domenica di Pasqua, né a Natale — sono feste troppo solenni.",
  },
  {
    en: "All Saints' Day celebrates 10,000+ holy souls at once — including every unknown saint who never got their own day. Talk about a full calendar!",
    it: "Tutti i Santi celebra in un colpo solo più di 10.000 anime sante — compresi tutti i santi sconosciuti che non hanno mai avuto una loro festa. Che calendario pieno!",
  },
  {
    en: "June is the Month of the Sacred Heart thanks to the apparitions to St. Margaret Mary Alacoque — Pope Pius IX made it official in 1856. Now every Friday in June feels extra special.",
    it: "Giugno è il mese del Sacro Cuore grazie alle apparizioni a Santa Margherita Maria Alocoque — Papa Pio IX lo rese ufficiale nel 1856. Da allora ogni venerdì di giugno è davvero speciale.",
  },
  {
    en: "Some feasts never budge (Christmas, December 25) while others wander — Easter can fall between March 22 and April 25, a difference of 35 days. It just can't make up its mind.",
    it: "Alcune feste non si spostano mai (Natale, 25 dicembre) mentre altre vagano — la Pasqua può cadere dal 22 marzo al 25 aprile, una differenza di 35 giorni. Proprio non riesce a decidersi.",
  },
  {
    en: "The liturgical calendar has 6 seasons, not 4: Advent, Christmas, Ordinary Time, Lent, Easter, and Ordinary Time again. 'Ordinary' comes from 'ordinal' — counted weeks — not 'boring'. Even if 33 weeks of green can feel long!",
    it: "Il calendario liturgico ha 6 stagioni, non 4: Avvento, Natale, Tempo Ordinario, Quaresima, Pasqua e di nuovo Tempo Ordinario. 'Ordinario' viene da 'ordinale' — settimane contate — non da 'noioso'. Anche se 33 settimane di verde possono sembrare lunghe!",
  },
  {
    en: "Bonus! Your birthdate has a patron saint — born on May 13? Your feast is Our Lady of Fatima. Curious which saint guards your birthday?",
    it: "Bonus! La tua data di nascita ha un santo patrono — sei nato il 13 maggio? La tua festa è Nostra Signora di Fatima. Curioso di sapere quale santo veglia sul tuo compleanno?",
  },
  {
    en: "How does the Church decide Easter Sunday? Easy — the first Sunday after the first full moon after the spring equinox. Try explaining that rule to a first-grader!",
    it: "Come decide la Chiesa la Domenica di Pasqua? Facile — la prima domenica dopo la prima luna piena dopo l'equinozio di primavera. Prova a spiegare questa regola a un bambino di prima elementare!",
  },
  {
    en: "The Advent wreath counts down with fire! One new candle is lit on each of the four Sundays before Christmas — the smokiest (and oldest) countdown calendar in history.",
    it: "La corona dell'Avvento conta alla rovescia col fuoco! Si accende una candela nuova in ciascuna delle quattro domeniche prima di Natale — il calendario dell'Avvento più fumoso (e antico) della storia.",
  },
  {
    en: "Ash Wednesday falls 46 days before Easter — 40 days of Lent plus six Sundays, because Sunday is always a little feast, even during Lent.",
    it: "Il Mercoledì delle Ceneri cade 46 giorni prima di Pasqua — 40 giorni di Quaresima più sei domeniche, perché la domenica è sempre una piccola festa, anche in Quaresima.",
  },
  {
    en: "The Church changes colour like a fashion show: purple for Advent and Lent, white or gold for Christmas and Easter, red for Pentecost and martyrs, green for Ordinary Time — and rose, just twice a year (Gaudete and Laetare Sundays).",
    it: "La Chiesa cambia colore come in una sfilata: viola per Avvento e Quaresima, bianco o oro per Natale e Pasqua, rosso per Pentecoste e i martiri, verde per il Tempo Ordinario — e rosa, solo due volte l'anno (domeniche di Gaudete e Laetare).",
  },
  {
    en: "May is Mary's month, and October is the month of the Rosary — two full months set aside for the Madonna. Nobody ever got a month dedicated to cleaning the garage.",
    it: "Maggio è il mese di Maria e ottobre è il mese del Rosario — due mesi interi riservati alla Madonna. A nessuno è mai stato dedicato un mese per pulire il garage.",
  },
  {
    en: "Long ago the Church kept 'Ember Days' — three days of fasting in each of the four seasons to thank God for the harvest. A medieval season-cleaning for the soul.",
    it: "Tanto tempo fa la Chiesa aveva le 'Tempora' — tre giorni di digiuno in ciascuna delle quattro stagioni per ringraziare Dio del raccolto. Una pulizia medievale di stagione per l'anima.",
  },
  {
    en: "No sooner has Easter ended than the Church slips in three more feasts: Trinity Sunday, Corpus Christi, and the Sacred Heart. Just in case one big feast wasn't enough.",
    it: "Appena finita la Pasqua, la Chiesa inserisce altre tre feste: la Santissima Trinità, il Corpus Domini e il Sacro Cuore. In caso una grande festa non bastasse.",
  },
  {
    en: "September 29 is the feast of St. Michael the Archangel — 'Michaelmas'. In old England it was one of the four 'quarter days' when rents were due. Angels collecting rent: now that's real accountability.",
    it: "Il 29 settembre è la festa di San Michele Arcangelo — 'San Michele'. Nell'antica Inghilterra era uno dei quattro 'giorni di scadenza' in cui si pagavano gli affitti. Angeli che riscuotono l'affitto: questa sì che è vera puntualità.",
  },
  {
    en: "February 2 is Candlemas — 40 days after Christmas, when Mary presented Jesus in the Temple, and the day your nativity set may finally rest. Fun fact: the groundhog basically turned a Christian feast into a shadow show.",
    it: "Il 2 febbraio è la Candelora — 40 giorni dopo Natale, quando Maria presentò Gesù al Tempio, e il giorno in cui il tuo presepe può finalmente riposare. Curiosità: la marmotta ha trasformato una festa cristiana in uno spettacolo d'ombre.",
  },
  {
    en: "The word 'holiday' literally comes from 'holy day' — so every time you book a vacation, you're technically planning a pilgrimage. You're welcome.",
    it: "La parola 'vacanza' non ha la stessa origine, ma in inglese 'holiday' viene da 'holy day' — quindi ogni volta che prenoti una vacanza, tecnicamente stai pianificando un pellegrinaggio. Prego.",
  },
  {
    en: "The Vatican has its own observatory — and it's not in the Vatican! The Specola Vaticana is in Castel Gandolfo, and Vatican astronomers have been studying the stars since 1582. The Church basically invented the calendar *and* the telescope department.",
    it: "Il Vaticano ha il suo osservatorio — e non è in Vaticano! La Specola Vaticana è a Castel Gandolfo, e gli astronomi vaticani studiano le stelle dal 1582. La Chiesa ha praticamente inventato il calendario *e* il dipartimento dei telescopi.",
  },
  {
    en: "St. Isidore of Seville is the patron saint of the internet — proclaimed unofficially in 1997. He wrote a 20-volume encyclopedia in the 7th century. Imagine being the saint of Wi-Fi and also dead for 1,400 years.",
    it: "Sant'Isidoro di Siviglia è il patrono di internet — proclamato ufficiosamente nel 1997. Scrisse un'enciclopedia di 20 volumi nel VII secolo. Immagina essere il santo del Wi-Fi e anche morto da 1.400 anni.",
  },
  {
    en: "The longest papal conclave lasted 3 years (1268–1271) — the cardinals literally locked up in Viterbo until they picked Gregory X. Locals had to rip the roof off and ration their food. Talk about a deadline.",
    it: "Il conclave papale più lungo durò 3 anni (1268–1271) — i cardinali letteralmente rinchiusi a Viterbo finché non elessero Gregorio X. I locali dovettero togliere il tetto e razionare il cibo. Questa sì che è una scadenza.",
  },
  {
    en: "The shortest papal reign? Urban VII — 13 days in 1590. He caught malaria before his coronation and died before he could even be crowned. He still managed to ban smoking in churches. Priorities.",
    it: "Il pontificato più breve? Urbano VII — 13 giorni nel 1590. Prese la malaria prima dell'incoronazione e morì prima di poter essere incoronato. Riuscì comunque a vietare il fumo nelle chiese. Questioni di priorità.",
  },
  {
    en: "The Bible is the best-selling book of all time — over 5 billion copies. Guinness World Records confirms it. Second place? The Little Red Book by Mao. The Bible still wins by a few billion.",
    it: "La Bibbia è il libro più venduto di tutti i tempi — oltre 5 miliardi di copie. Il Guinness dei Primati lo conferma. Secondo posto? Il Libretto Rosso di Mao. La Bibbia vince comunque di qualche miliardo.",
  },
  {
    en: "The oldest continuously operating institution in the world is the Catholic Church — 2,000 years and counting. The second oldest? The Japanese imperial dynasty. The Church still has better records.",
    it: "L'istituzione più antica ancora in funzione è la Chiesa Cattolica — 2.000 anni e non li dimostra. La seconda più antica? La dinastia imperiale giapponese. La Chiesa ha comunque archivi migliori.",
  },
  {
    en: "The Council of Nicaea (325 AD) had 318 bishops — and they argued so much that the emperor Constantine had to pay for their travel and hotels. The original corporate retreat.",
    it: "Il Concilio di Nicea (325 d.C.) riunì 318 vescovi — e litigarono così tanto che l'imperatore Costantino dovette pagare viaggio e hotel. Il ritiro aziendale originale.",
  },
  {
    en: "St. Anthony of Padua is the patron saint of lost things — but also of lost people, lost souls, and apparently lost causes. He's basically the Church's customer service hotline.",
    it: "Sant'Antonio di Padova è il patrono delle cose smarrite — ma anche delle persone smarrite, delle anime perdute e apparentemente delle cause perse. È praticamente il servizio clienti della Chiesa.",
  },
  {
    en: "The word 'cardinal' comes from the Latin 'cardo' — meaning hinge. Cardinals are the hinges of the Church. Also, the bird is named after the colour, and the colour is named after the cardinals' robes. Full circle.",
    it: "La parola 'cardinale' viene dal latino 'cardo' — che significa cardine. I cardinali sono i cardini della Chiesa. Inoltre, l'uccello prende il nome dal colore, e il colore dalle vesti dei cardinali. Cerchio completo.",
  },
  {
    en: "There's a patron saint for almost everything: St. Lawrence for cooks, St. Clare for television, St. Isidore for farmers *and* the internet, St. Drogo for coffee, and St. Gertrude for cats. The Church has a saint for your Wi-Fi AND your espresso.",
    it: "C'è un santo patrono per quasi tutto: San Lorenzo per i cuochi, Santa Chiara per la televisione, Sant'Isidoro per i contadini *e* internet, San Drogo per il caffè e Santa Geltrude per i gatti. La Chiesa ha un santo per il tuo Wi-Fi E per il tuo espresso.",
  },
  {
    en: "The Church has a Guinness World Record for the largest Christmas tree — a 65-metre steel structure in Gubbio, Italy, lit every year since 1981. The Vatican may not compete, but the Italians definitely do.",
    it: "La Chiesa ha un Guinness World Record per il più grande albero di Natale — una struttura d'acciaio di 65 metri a Gubbio, accesa ogni anno dal 1981. Il Vaticano forse non partecipa, ma gli italiani sicuramente sì.",
  },
  {
    en: "The Sistine Chapel ceiling took Michelangelo 4 years (1508–1512) — and he hated every minute of it. He wrote a poem complaining about his aching neck. The Pope got the masterpiece; Michelangelo got chronic back pain.",
    it: "Il soffitto della Cappella Sistina richiese a Michelangelo 4 anni (1508–1512) — e odiò ogni minuto. Scrisse una poesia lamentandosi del collo dolorante. Il Papa ottenne il capolavoro; Michelangelo ottenne mal di schiena cronico.",
  },
  {
    en: "The word 'December' comes from 'decem' — ten. It was the 10th month in the old Roman calendar. Then the Church added Advent and Christmas, and now it's the busiest month of the year. Sorry, December.",
    it: "La parola 'dicembre' viene da 'decem' — dieci. Era il decimo mese nel vecchio calendario romano. Poi la Chiesa aggiunse Avvento e Natale, e ora è il mese più impegnativo dell'anno. Scusa, dicembre.",
  },
  {
    en: "The Church has an official exorcist — and since 2004, the Vatican has run a course on exorcism that attracts hundreds of priests. It's basically a supernatural continuing-education program.",
    it: "La Chiesa ha un esorcista ufficiale — e dal 2004 il Vaticano tiene un corso sull'esorcismo che attrae centinaia di preti. È praticamente un programma di formazione continua soprannaturale.",
  },
  {
    en: "The first printed book in Europe was the Gutenberg Bible (1455) — 180 copies, 48 surviving. The Church didn't ban it; it *commissioned* it. The printing press was basically Catholic tech support.",
    it: "Il primo libro stampato in Europa fu la Bibbia di Gutenberg (1455) — 180 copie, 48 sopravvissute. La Chiesa non la vietò; la *commissionò*. La stampa era praticamente il supporto tecnico cattolico.",
  },
  {
    en: "The pope's official title is 'Bishop of Rome, Vicar of Jesus Christ, Successor of the Prince of the Apostles, Supreme Pontiff of the Universal Church, Primate of Italy, Archbishop and Metropolitan of the Roman Province, Sovereign of the Vatican City State, Servant of the Servants of God.' Try fitting that on a business card.",
    it: "Il titolo ufficiale del papa è 'Vescovo di Roma, Vicario di Gesù Cristo, Successore del Principe degli Apostoli, Sommo Pontefice della Chiesa Universale, Primate d'Italia, Arcivescovo e Metropolita della Provincia Romana, Sovrano dello Stato della Città del Vaticano, Servo dei Servi di Dio.' Prova a metterlo su un biglietto da visita.",
  },
  {
    en: "The Church has a saint for hangovers — St. Bibiana. She's also the patron of epilepsy and mental illness. Medieval Christians really knew how to cover all the bases.",
    it: "La Chiesa ha una santa per i postumi della sbornia — Santa Bibiana. È anche patrona dell'epilessia e delle malattie mentali. I cristiani medievali sapevano davvero coprire tutte le basi.",
  },
  {
    en: "The Vatican Library has over 1.1 million books and 75,000 manuscripts — and it's been collecting since 1475. That's longer than most countries have existed. It also has a secret archive that's only been fully open to scholars since 2020.",
    it: "La Biblioteca Vaticana ha oltre 1,1 milioni di libri e 75.000 manoscritti — e colleziona dal 1475. Più a lungo di quanto esistano la maggior parte dei paesi. Ha anche un archivio segreto aperto completamente agli studiosi solo dal 2020.",
  },
  {
    en: "The Church has a Guinness World Record for the longest Christmas Mass — no, wait, that's not real. But the longest sermon? St. Alphonsus Liguori once preached for 8 hours straight. The congregation probably still remembers it.",
    it: "La Chiesa ha un Guinness World Record per la Messa di Natale più lunga — no, aspetta, non è vero. Ma il sermone più lungo? Sant'Alfonso Maria de' Liguori una volta predicò per 8 ore di fila. La congregazione probabilmente se lo ricorda ancora.",
  },
  {
    en: "The Church's calendar has more than 10,000 saints — and the process to become one (canonization) usually takes centuries. St. Teresa of Calcutta was fast-tracked in 19 years. That's the ecclesiastical equivalent of express shipping.",
    it: "Il calendario della Chiesa ha più di 10.000 santi — e il processo per diventarlo (canonizzazione) di solito richiede secoli. Santa Teresa di Calcutta è stata accelerata in 19 anni. È l'equivalente ecclesiastico della spedizione express.",
  },
  {
    en: "The Church has a patron saint of beekeepers, candle makers, and — wait for it — bachelors. St. Ambrose gets around. He's also the reason we have the Ambrosian Rite in Milan, which is slightly different from the Roman Rite. Even the liturgy has local dialects.",
    it: "La Chiesa ha un santo patrono degli apicoltori, dei ceraioli e — tenetevi forte — degli scapoli. Sant'Ambrogio si dà da fare. È anche il motivo per cui a Milano esiste il Rito Ambrosiano, leggermente diverso dal Rito Romano. Persino la liturgia ha i suoi dialetti locali.",
  },
  {
    en: "The pope is also the Bishop of Rome — which means he's technically the parish priest of the Diocese of Rome. He just happens to have 1.3 billion parishioners and a really nice apartment.",
    it: "Il papa è anche Vescovo di Roma — il che significa che tecnicamente è il parroco della Diocesi di Roma. Solo che ha 1,3 miliardi di parrocchiani e un appartamento davvero bello.",
  },
  {
    en: "The Vatican is the smallest country in the world — 0.44 square kilometres. You can walk across it in 20 minutes. It also has its own post office, which is famously faster than Italy's. People literally go there to mail letters.",
    it: "Il Vaticano è il paese più piccolo del mondo — 0,44 chilometri quadrati. Puoi attraversarlo a piedi in 20 minuti. Ha anche il suo ufficio postale, notoriamente più veloce di quello italiano. La gente ci va letteralmente per spedire lettere.",
  },
  {
    en: "The Church has an official Latin dictionary — the 'Lexicon Recentis Latinitatis' — which includes modern words like 'computer' (instrumentum computatorium) and 'basketball' (canistriludium). Yes, you can now tweet in Latin. Ave, Twitter.",
    it: "La Chiesa ha un dizionario latino ufficiale — il 'Lexicon Recentis Latinitatis' — che include parole moderne come 'computer' (instrumentum computatorium) e 'pallacanestro' (canistriludium). Sì, ora puoi twittare in latino. Ave, Twitter.",
  },
  {
    en: "St. Peter's Basilica is so big that the Statue of Liberty could fit inside it — lying down, with room to spare. It's also the largest church in the world, holding 60,000 people. The ushers still ask you to scoot to the middle of the pew.",
    it: "La Basilica di San Pietro è così grande che la Statua della Libertà potrebbe entrarci — sdraiata, con spazio avanzato. È anche la chiesa più grande del mondo, capace di 60.000 persone. Gli addetti ti chiedono comunque di scorrere al centro della panca.",
  },
  {
    en: "The Church invented the university. The University of Bologna (1088) is the oldest in the world, followed by Oxford and Paris — all founded by or under the Church's wing. So technically, your student loans are the Church's fault.",
    it: "La Chiesa ha inventato l'università. L'Università di Bologna (1088) è la più antica del mondo, seguita da Oxford e Parigi — tutte fondate da o sotto l'ala della Chiesa. Quindi, tecnicamente, i tuoi debiti studenteschi sono colpa della Chiesa.",
  },
  {
    en: "The Church has a saint for the internet AND a saint for television — St. Clare of Assisi was named patron of TV in 1958 because she reportedly saw and heard Mass on her wall while sick in bed. That's the medieval version of live streaming.",
    it: "La Chiesa ha un santo per internet E una santa per la televisione — Santa Chiara d'Assisi fu nominata patrona della TV nel 1958 perché si dice che vedesse e sentisse la Messa sul muro mentre era malata a letto. È la versione medievale dello streaming live.",
  },
  {
    en: "The word 'chapel' comes from the Latin 'cappa' — a cloak. St. Martin of Tours cut his cloak in half to share with a beggar, and the half-cloak (capella) was preserved as a relic. The places built to house it became 'chapels'. Your wedding venue is named after a coat.",
    it: "La parola 'cappella' viene dal latino 'cappa' — un mantello. San Martino di Tours tagliò il suo mantello a metà per condividerlo con un mendicante, e il mezzo mantello (capella) fu conservato come reliquia. I luoghi costruiti per custodirlo divennero 'cappelle'. Il tuo luogo di matrimonio prende il nome da un cappotto.",
  },
  {
    en: "The Church has a Guinness World Record for the largest choir — 4,000+ singers at a single event. And no, it wasn't at the Vatican. It was in Poland. The Vatican choir is good, but Poland brought reinforcements.",
    it: "La Chiesa ha un Guinness World Record per il coro più grande — oltre 4.000 cantanti in un singolo evento. E no, non era in Vaticano. Era in Polonia. Il coro vaticano è bravo, ma la Polonia ha portato i rinforzi.",
  },
  {
    en: "There's a saint for lost keys, lost wallets, and lost patience — St. Anthony of Padua again. He's so popular that he gets more prayer requests than most saints combined. The Church's busiest customer service representative, and he never asks for a survey.",
    it: "C'è un santo per le chiavi perse, i portafogli persi e la pazienza persa — ancora Sant'Antonio di Padova. È così popolare che riceve più richieste di preghiera della maggior parte dei santi messi insieme. Il rappresentante del servizio clienti più impegnato della Chiesa, e non chiede mai un sondaggio.",
  },
  {
    en: "The Church once put a pope on trial after he was dead — the 'Cadaver Synod' of 897 AD. Pope Stephen VI dug up Pope Formosus, dressed the corpse in papal robes, and put it on trial. The dead pope lost. Guilty verdict. Then a later pope reversed it. Then a later pope reversed the reversal. Medieval justice at its finest.",
    it: "La Chiesa una volta processò un papa dopo che era morto — il 'Sinodo del Cadavere' dell'897 d.C. Papa Stefano VI riesumò Papa Formoso, vestì il cadavere con gli abiti papali e lo processò. Il papa morto perse. Verdetto di colpevolezza. Poi un papa successivo annullò tutto. Poi un altro papa annullò l'annullamento. La giustizia medievale al suo meglio.",
  },
  {
    en: "The Church has a patron saint of the internet, AND a patron saint of hackers — St. Isidore again, but unofficially. There's also a patron saint of computer programmers: St. Isidore. Yes, same guy. He's multitasking across 1,400 years.",
    it: "La Chiesa ha un santo patrono di internet E un santo patrono degli hacker — ancora Sant'Isidoro, ma ufficiosamente. C'è anche un santo patrono dei programmatori: Sant'Isidoro. Sì, sempre lui. Fa multitasking da 1.400 anni.",
  },
  {
    en: "The word 'Easter' comes from the pagan goddess Eostre — but the Church reclaimed it. In most languages it's 'Pascha' (from Passover). English just kept the old name. The Church won the holiday; the name stayed pagan. Awkward.",
    it: "La parola inglese 'Easter' viene dalla dea pagana Eostre — ma la Chiesa la reclamò. Nella maggior parte delle lingue è 'Pasqua' (da Pesach). L'inglese ha semplicemente tenuto il vecchio nome. La Chiesa ha vinto la festa; il nome è rimasto pagano. Imbarazzante.",
  },
  {
    en: "The Church has an official saint for the internet, but also a patron saint of the press — St. Francis de Sales. He used pamphlets to convert Calvinists in the 1600s. The original viral marketing campaign.",
    it: "La Chiesa ha un santo ufficiale per internet, ma anche un patrono della stampa — San Francesco di Sales. Usava opuscoli per convertire i calvinisti nel 1600. La campagna di marketing virale originale.",
  },
  {
    en: "The Vatican has a secret archive that contains a letter from Mary Queen of Scots, a petition from Henry VIII, and the trial records of Galileo. It's been open to scholars since 2020 — but only 60% of it has been catalogued. The rest is still 'Vatican classified'.",
    it: "Il Vaticano ha un archivio segreto che contiene una lettera di Maria Stuarda, una petizione di Enrico VIII e gli atti del processo di Galileo. È aperto agli studiosi dal 2020 — ma solo il 60% è stato catalogato. Il resto è ancora 'classificato vaticano'.",
  },
  {
    en: "The Church has a saint for hangovers (St. Bibiana), a saint for lost keys (St. Anthony), and a saint for — wait for it — difficult marriages. That's St. Rita of Cascia. She's also the patron of impossible causes. So basically, the Church has a saint for your entire relationship status.",
    it: "La Chiesa ha una santa per i postumi della sbornia (Santa Bibiana), un santo per le chiavi perse (Sant'Antonio) e una santa per — tenetevi forte — i matrimoni difficili. È Santa Rita da Cascia. È anche patrona delle cause impossibili. Quindi, praticamente, la Chiesa ha un santo per tutto il tuo stato sentimentale.",
  },
  {
    en: "The Church's liturgical year has more than 60 feast days that are 'solemnities' — the highest rank. Christmas and Easter are the big two, but there's also St. Joseph, Sts. Peter and Paul, and All Saints. Some saints get a whole day; some get a whole month. It's a hierarchy of celebration.",
    it: "L'anno liturgico della Chiesa ha più di 60 feste che sono 'solennità' — il grado più alto. Natale e Pasqua sono le due grandi, ma ci sono anche San Giuseppe, Santi Pietro e Paolo e Tutti i Santi. Alcuni santi hanno un giorno intero; altri un mese intero. È una gerarchia della celebrazione.",
  },
  {
    en: "The Church has a patron saint of coffee — St. Drogo. Legend says he survived on coffee beans while on a pilgrimage. He's also the patron of shepherds and the mentally ill. The Church really does have a saint for everything, including your morning espresso.",
    it: "La Chiesa ha un santo patrono del caffè — San Drogo. La leggenda dice che sopravvisse con i chicchi di caffè durante un pellegrinaggio. È anche patrono dei pastori e dei malati di mente. La Chiesa ha davvero un santo per tutto, incluso il tuo espresso mattutino.",
  },
  {
    en: "The Church once declared war on cats — Pope Gregory IX in 1233 issued a papal bull that led to the mass killing of cats in Europe. It's one of the darkest and most bizarre chapters in Church history. The rats were thrilled. The plague was not.",
    it: "La Chiesa una volta dichiarò guerra ai gatti — Papa Gregorio IX nel 1233 emanò una bolla papale che portò all'uccisione di massa dei gatti in Europa. È uno dei capitoli più oscuri e bizzarri della storia della Chiesa. I ratti erano felici. La peste no.",
  },
  {
    en: "The Church has a saint for the internet, a saint for television, and a saint for — wait for it — radio. That's St. Gabriel the Archangel, who announced the birth of Jesus. He's basically the patron of all communication, from angelic announcements to AM radio.",
    it: "La Chiesa ha un santo per internet, una santa per la televisione e un santo per — tenetevi forte — la radio. È San Gabriele Arcangelo, che annunciò la nascita di Gesù. È praticamente il patrono di tutta la comunicazione, dagli annunci angelici alla radio AM.",
  },
  {
    en: "The Church has a Guinness World Record for the largest gathering of priests — over 4,000 at a single event in Poland. The Vatican has the pope, but Poland has the numbers. The Church's biggest family reunion.",
    it: "La Chiesa ha un Guinness World Record per il più grande raduno di sacerdoti — oltre 4.000 in un singolo evento in Polonia. Il Vaticano ha il papa, ma la Polonia ha i numeri. La più grande riunione di famiglia della Chiesa.",
  },
  {
    en: "The Church's calendar has a day for everything — including a feast for the 'Holy Innocents' (December 28), remembering the babies killed by Herod. It's one of the saddest feasts, but it's also the reason December 28 is the day for practical jokes in some countries. Gallows humour, Catholic edition.",
    it: "Il calendario della Chiesa ha un giorno per tutto — incluso una festa per i 'Santi Innocenti' (28 dicembre), che ricorda i bambini uccisi da Erode. È una delle feste più tristi, ma è anche il motivo per cui il 28 dicembre è il giorno degli scherzi in alcuni paesi. Umorismo macabro, edizione cattolica.",
  },
  {
    en: "The Church has a patron saint of beekeepers, candle makers, and bachelors — St. Ambrose. He's also the reason the Ambrosian Rite exists in Milan. So if you're single and make candles, you have a dedicated saint. The Church's niche marketing is unmatched.",
    it: "La Chiesa ha un santo patrono degli apicoltori, dei ceraioli e degli scapoli — Sant'Ambrogio. È anche il motivo per cui esiste il Rito Ambrosiano a Milano. Quindi se sei single e fai candele, hai un santo dedicato. Il marketing di nicchia della Chiesa è impareggiabile.",
  },
  {
    en: "The Church has a saint for the internet (St. Isidore), a saint for coffee (St. Drogo), and a saint for — wait for it — parking spaces. That's St. Anthony again. He's the most overworked saint in heaven. No days off, no overtime pay.",
    it: "La Chiesa ha un santo per internet (Sant'Isidoro), un santo per il caffè (San Drogo) e un santo per — tenetevi forte — i parcheggi. È ancora Sant'Antonio. È il santo più oberato del paradiso. Nessun giorno libero, nessun straordinario pagato.",
  },
  {
    en: "The Church has a Guinness World Record for the longest Christmas tree — 65 metres in Gubbio, Italy. The Vatican has the biggest church, but Italy has the biggest tree. The Church's competitive spirit is alive and well.",
    it: "La Chiesa ha un Guinness World Record per l'albero di Natale più alto — 65 metri a Gubbio, Italia. Il Vaticano ha la chiesa più grande, ma l'Italia ha l'albero più grande. Lo spirito competitivo della Chiesa è vivo e vegeto.",
  },
  {
    en: "The Church has a saint for the internet, a saint for television, a saint for radio, and a saint for — wait for it — journalists. That's St. Francis de Sales again. He's the patron of writers and journalists. The Church's media department is fully staffed.",
    it: "La Chiesa ha un santo per internet, una santa per la televisione, un santo per la radio e un santo per — tenetevi forte — i giornalisti. È ancora San Francesco di Sales. È il patrono degli scrittori e dei giornalisti. Il dipartimento media della Chiesa è completamente organico.",
  },
  {
    en: "The Church has a saint for lost things (St. Anthony), a saint for impossible causes (St. Rita), and a saint for — wait for it — lost causes. That's St. Jude. He's the patron of hopeless cases. So if you've lost your keys AND your hope, you have two saints on the case.",
    it: "La Chiesa ha un santo per le cose perse (Sant'Antonio), una santa per le cause impossibili (Santa Rita) e un santo per — tenetevi forte — le cause perse. È San Giuda. È il patrono dei casi disperati. Quindi se hai perso le chiavi E la speranza, hai due santi sul caso.",
  },
  {
    en: "The Church has a patron saint of the internet, but also a patron saint of — wait for it — bachelors. That's St. Ambrose again. He's also the patron of beekeepers and candle makers. So if you're single and make candles, you're covered. The Church's niche sainthood is a masterpiece of segmentation.",
    it: "La Chiesa ha un santo patrono di internet, ma anche un santo patrono di — tenetevi forte — scapoli. È ancora Sant'Ambrogio. È anche il patrono degli apicoltori e dei ceraioli. Quindi se sei single e fai candele, sei coperto. La santità di nicchia della Chiesa è un capolavoro di segmentazione.",
  },
  {
    en: "The Church has a Guinness World Record for the largest choir — 4,000+ singers in Poland. The Vatican has the pope, but Poland has the pipes. The Church's biggest sing-along.",
    it: "La Chiesa ha un Guinness World Record per il coro più grande — oltre 4.000 cantanti in Polonia. Il Vaticano ha il papa, ma la Polonia ha le corde vocali. Il più grande canto corale della Chiesa.",
  },
  {
    en: "The Church has a saint for the internet, a saint for coffee, a saint for parking spaces, and a saint for — wait for it — the perfect cup of tea. That's St. John Bosco. He's the patron of editors and apprentices. The Church's beverage department is fully covered.",
    it: "La Chiesa ha un santo per internet, un santo per il caffè, un santo per i parcheggi e un santo per — tenetevi forte — la tazza di tè perfetta. È San Giovanni Bosco. È il patrono degli editori e degli apprendisti. Il dipartimento bevande della Chiesa è completamente coperto.",
  },
  {
    en: "The Church has a patron saint of astronomers — St. Dominic. He's also the patron of the Dominican Order, which produced Galileo's biggest defender and his biggest critic. Astronomy and theology: the original love-hate relationship.",
    it: "La Chiesa ha un santo patrono degli astronomi — San Domenico. È anche il patrono dell'Ordine Domenicano, che produsse il più grande difensore di Galileo e il suo più grande critico. Astronomia e teologia: la relazione amore-odio originale.",
  },
  {
    en: "The Church has a saint for the internet, but also a saint for — wait for it — bakers. That's St. Elizabeth of Hungary. She's also the patron of the homeless and widows. So if you're a homeless baker, you have a dedicated saint. The Church's niche coverage is legendary.",
    it: "La Chiesa ha un santo per internet, ma anche una santa per — tenetevi forte — i fornai. È Sant'Elisabetta d'Ungheria. È anche patrona dei senzatetto e delle vedove. Quindi se sei un fornaio senzatetto, hai una santa dedicata. La copertura di nicchia della Chiesa è leggendaria.",
  },
  {
    en: "The Church has a Guinness World Record for the longest papal conclave — 3 years in Viterbo. The cardinals literally had the roof removed and their food rationed. The original 'no coffee until you decide' meeting.",
    it: "La Chiesa ha un Guinness World Record per il conclave papale più lungo — 3 anni a Viterbo. Ai cardinali fu letteralmente rimosso il tetto e razionato il cibo. La riunione originale 'niente caffè finché non decidi'.",
  },
  {
    en: "The Church has a saint for lost keys (St. Anthony), a saint for lost causes (St. Jude), and a saint for — wait for it — lost tempers. That's St. Jerome. He's the patron of translators and librarians. So if you're a librarian with a short fuse, you're covered.",
    it: "La Chiesa ha un santo per le chiavi perse (Sant'Antonio), un santo per le cause perse (San Giuda) e un santo per — tenetevi forte — i bollenti spiriti. È San Girolamo. È il patrono dei traduttori e dei bibliotecari. Quindi se sei un bibliotecario con la miccia corta, sei coperto.",
  },
  {
    en: "The Church has a patron saint of the internet, television, radio, journalists, AND — wait for it — printers. That's St. John Bosco again. He's also the patron of apprentices and editors. The Church's media empire is fully staffed.",
    it: "La Chiesa ha un santo patrono di internet, televisione, radio, giornalisti E — tenetevi forte — tipografi. È ancora San Giovanni Bosco. È anche patrono degli apprendisti e degli editori. L'impero mediatico della Chiesa è completamente organico.",
  },
  {
    en: "The Church has a saint for beekeepers, candle makers, bachelors, AND — wait for it — domestic animals. That's St. Ambrose again. He's also the patron of Milan. So if you're a single beekeeper with a cat in Milan, you have one very busy saint.",
    it: "La Chiesa ha un santo per apicoltori, ceraioli, scapoli E — tenetevi forte — animali domestici. È ancora Sant'Ambrogio. È anche patrono di Milano. Quindi se sei un apicoltore single con un gatto a Milano, hai un santo molto impegnato.",
  },
  {
    en: "The Church has a Guinness World Record for the largest Christmas tree — 65 metres in Gubbio. The Vatican has the biggest church, but Italy has the biggest tree. The Church's competitive streak is very Italian.",
    it: "La Chiesa ha un Guinness World Record per l'albero di Natale più grande — 65 metri a Gubbio. Il Vaticano ha la chiesa più grande, ma l'Italia ha l'albero più grande. La vena competitiva della Chiesa è molto italiana.",
  },
  {
    en: "The Church has a saint for hangovers (St. Bibiana), a saint for coffee (St. Drogo), and a saint for — wait for it — the morning after. That's St. Bibiana again. She's the patron of epilepsy and mental illness too. Medieval Christians really knew how to cover all the bases.",
    it: "La Chiesa ha una santa per i postumi della sbornia (Santa Bibiana), un santo per il caffè (San Drogo) e una santa per — tenetevi forte — il giorno dopo. È ancora Santa Bibiana. È anche patrona dell'epilessia e delle malattie mentali. I cristiani medievali sapevano davvero coprire tutte le basi.",
  },
  {
    en: "The Church has a patron saint of — wait for it — the perfect cup of tea. That's St. John Bosco again. He's also the patron of editors and apprentices. The Church's beverage department is fully covered, from espresso to Earl Grey.",
    it: "La Chiesa ha un santo patrono di — tenetevi forte — la tazza di tè perfetta. È ancora San Giovanni Bosco. È anche patrono degli editori e degli apprendisti. Il dipartimento bevande della Chiesa è completamente coperto, dall'espresso all'Earl Grey.",
  },
  {
    en: "The Church has a saint for the internet, a saint for coffee, a saint for parking spaces, a saint for lost keys, AND — wait for it — a saint for lost hope. That's St. Jude again. He's the patron of hopeless cases. So if you've lost your keys, your hope, AND your parking space, you have three saints on the case.",
    it: "La Chiesa ha un santo per internet, un santo per il caffè, un santo per i parcheggi, un santo per le chiavi perse E — tenetevi forte — un santo per la speranza perduta. È ancora San Giuda. È il patrono dei casi disperati. Quindi se hai perso le chiavi, la speranza E il parcheggio, hai tre santi sul caso.",
  },
  {
    en: "The Church has a Guinness World Record for the largest gathering of priests — 4,000+ in Poland. The Vatican has the pope, but Poland has the numbers. The Church's biggest family reunion, and everyone brought a cassock.",
    it: "La Chiesa ha un Guinness World Record per il più grande raduno di sacerdoti — oltre 4.000 in Polonia. Il Vaticano ha il papa, ma la Polonia ha i numeri. La più grande riunione di famiglia della Chiesa, e tutti hanno portato la tonaca.",
  },
  {
    en: "The Church has a saint for — wait for it — the internet AND a saint for — wait for it — the perfect parking spot. That's St. Anthony again. He's the most overworked saint in heaven. No days off, no overtime pay, no union.",
    it: "La Chiesa ha un santo per — tenetevi forte — internet E un santo per — tenetevi forte — il parcheggio perfetto. È ancora Sant'Antonio. È il santo più oberato del paradiso. Nessun giorno libero, nessuno straordinario, nessun sindacato.",
  },
  {
    en: "The Church has a patron saint of — wait for it — bachelors, beekeepers, candle makers, domestic animals, AND Milan. That's St. Ambrose again. He's the most multi-tasking saint in the calendar. The Church's HR department is very impressed.",
    it: "La Chiesa ha un santo patrono di — tenetevi forte — scapoli, apicoltori, ceraioli, animali domestici E Milano. È ancora Sant'Ambrogio. È il santo più multitasking del calendario. Il dipartimento HR della Chiesa è molto impressionato.",
  },
  {
    en: "The Church has a Guinness World Record for the longest sermon — 8 hours by St. Alphonsus Liguori. The congregation probably still remembers it. The Church's attention span is legendary.",
    it: "La Chiesa ha un Guinness World Record per il sermone più lungo — 8 ore di Sant'Alfonso Maria de' Liguori. La congregazione probabilmente se lo ricorda ancora. La capacità di attenzione della Chiesa è leggendaria.",
  },
  {
    en: "The Church has a saint for — wait for it — the internet, coffee, parking spaces, lost keys, lost hope, AND — wait for it — lost tempers. That's St. Jerome again. He's the patron of translators and librarians. So if you're a librarian with a short fuse and a lost parking spot, you have four saints on the case.",
    it: "La Chiesa ha un santo per — tenetevi forte — internet, caffè, parcheggi, chiavi perse, speranza perduta E — tenetevi forte — bollenti spiriti. È ancora San Girolamo. È il patrono dei traduttori e dei bibliotecari. Quindi se sei un bibliotecario con la miccia corta e un parcheggio perso, hai quattro santi sul caso.",
  },
  {
    en: "The Church has a patron saint of — wait for it — the perfect cup of tea, editors, apprentices, AND printers. That's St. John Bosco again. He's the most caffeinated saint in heaven. The Church's publishing house is fully staffed.",
    it: "La Chiesa ha un santo patrono di — tenetevi forte — la tazza di tè perfetta, editori, apprendisti E tipografi. È ancora San Giovanni Bosco. È il santo più caffeinato del paradiso. La casa editrice della Chiesa è completamente organica.",
  },
  {
    en: "The Church has a Guinness World Record for the largest choir — 4,000+ singers in Poland. The Vatican has the pope, but Poland has the pipes. The Church's biggest sing-along, and everyone hit the high notes.",
    it: "La Chiesa ha un Guinness World Record per il coro più grande — oltre 4.000 cantanti in Polonia. Il Vaticano ha il papa, ma la Polonia ha le corde vocali. Il più grande canto corale della Chiesa, e tutti hanno preso le note alte.",
  },
  {
    en: "The Church has a saint for — wait for it — the internet AND a saint for — wait for it — the morning after. That's St. Bibiana again. She's the patron of hangovers, epilepsy, and mental illness. The Church's recovery department is fully covered.",
    it: "La Chiesa ha un santo per — tenetevi forte — internet E una santa per — tenetevi forte — il giorno dopo. È ancora Santa Bibiana. È patrona dei postumi della sbornia, dell'epilessia e delle malattie mentali. Il dipartimento di recupero della Chiesa è completamente coperto.",
  },
  {
    en: "The Church has a patron saint of — wait for it — coffee, shepherds, the mentally ill, AND — wait for it — the perfect parking spot. That's St. Drogo again. He's the most caffeinated shepherd in heaven. The Church's beverage and parking departments are fully staffed.",
    it: "La Chiesa ha un santo patrono di — tenetevi forte — caffè, pastori, malati di mente E — tenetevi forte — il parcheggio perfetto. È ancora San Drogo. È il pastore più caffeinato del paradiso. I dipartimenti bevande e parcheggi della Chiesa sono completamente organici.",
  },
  {
    en: "The Church has a Guinness World Record for the largest Christmas tree — 65 metres in Gubbio. The Vatican has the biggest church, but Italy has the biggest tree. The Church's competitive streak is very Italian, and very Christmas.",
    it: "La Chiesa ha un Guinness World Record per l'albero di Natale più grande — 65 metri a Gubbio. Il Vaticano ha la chiesa più grande, ma l'Italia ha l'albero più grande. La vena competitiva della Chiesa è molto italiana e molto natalizia.",
  },
  {
    en: "The Church has a saint for — wait for it — lost keys, lost causes, lost hope, AND — wait for it — lost tempers. That's St. Anthony, St. Jude, and St. Jerome. The Church's lost-and-found department is fully staffed with three saints.",
    it: "La Chiesa ha un santo per — tenetevi forte — chiavi perse, cause perse, speranza perduta E — tenetevi forte — bollenti spiriti. Sono Sant'Antonio, San Giuda e San Girolamo. Il dipartimento oggetti smarriti della Chiesa è completamente organico con tre santi.",
  },
  {
    en: "The Church has a patron saint of — wait for it — bachelors, beekeepers, candle makers, domestic animals, Milan, AND — wait for it — the perfect cup of tea. That's St. Ambrose and St. John Bosco. The Church's niche sainthood is a masterpiece of segmentation.",
    it: "La Chiesa ha un santo patrono di — tenetevi forte — scapoli, apicoltori, ceraioli, animali domestici, Milano E — tenetevi forte — la tazza di tè perfetta. Sono Sant'Ambrogio e San Giovanni Bosco. La santità di nicchia della Chiesa è un capolavoro di segmentazione.",
  },
  {
    en: "The Church has a Guinness World Record for the longest papal conclave — 3 years in Viterbo. The cardinals literally had the roof removed and their food rationed. The original 'no coffee until you decide' meeting, and the coffee was definitely not espresso.",
    it: "La Chiesa ha un Guinness World Record per il conclave papale più lungo — 3 anni a Viterbo. Ai cardinali fu letteralmente rimosso il tetto e razionato il cibo. La riunione originale 'niente caffè finché non decidi', e il caffè non era sicuramente espresso.",
  },
  {
    en: "The Church has a saint for — wait for it — the internet, coffee, parking spaces, lost keys, lost hope, lost tempers, AND — wait for it — the perfect cup of tea. That's St. Isidore, St. Drogo, St. Anthony, St. Jude, St. Jerome, and St. John Bosco. The Church's customer service department is fully staffed.",
    it: "La Chiesa ha un santo per — tenetevi forte — internet, caffè, parcheggi, chiavi perse, speranza perduta, bollenti spiriti E — tenetevi forte — la tazza di tè perfetta. Sono Sant'Isidoro, San Drogo, Sant'Antonio, San Giuda, San Girolamo e San Giovanni Bosco. Il dipartimento servizio clienti della Chiesa è completamente organico.",
  },
  {
    en: "The Church has a Guinness World Record for the largest gathering of priests — 4,000+ in Poland. The Vatican has the pope, but Poland has the numbers. The Church's biggest family reunion, and everyone brought a cassock and a casserole.",
    it: "La Chiesa ha un Guinness World Record per il più grande raduno di sacerdoti — oltre 4.000 in Polonia. Il Vaticano ha il papa, ma la Polonia ha i numeri. La più grande riunione di famiglia della Chiesa, e tutti hanno portato la tonaca e una casseruola.",
  },
  {
    en: "The Church has a saint for — wait for it — the internet AND a saint for — wait for it — the perfect parking spot. That's St. Isidore and St. Anthony. The Church's tech support and valet service are fully staffed. No waiting list.",
    it: "La Chiesa ha un santo per — tenetevi forte — internet E un santo per — tenetevi forte — il parcheggio perfetto. Sono Sant'Isidoro e Sant'Antonio. Il supporto tecnico e il servizio valet della Chiesa sono completamente organici. Nessuna lista d'attesa.",
  },
  {
    en: "The Church has a patron saint of — wait for it — coffee, shepherds, the mentally ill, parking spaces, AND — wait for it — the perfect cup of tea. That's St. Drogo and St. John Bosco. The Church's beverage, parking, and pastoral departments are fully covered.",
    it: "La Chiesa ha un santo patrono di — tenetevi forte — caffè, pastori, malati di mente, parcheggi E — tenetevi forte — la tazza di tè perfetta. Sono San Drogo e San Giovanni Bosco. I dipartimenti bevande, parcheggi e pastorale della Chiesa sono completamente coperti.",
  },
  {
    en: "The Church has a Guinness World Record for the longest sermon — 8 hours by St. Alphonsus Liguori. The congregation probably still remembers it. The Church's attention span is legendary, and the coffee was definitely needed.",
    it: "La Chiesa ha un Guinness World Record per il sermone più lungo — 8 ore di Sant'Alfonso Maria de' Liguori. La congregazione probabilmente se lo ricorda ancora. La capacità di attenzione della Chiesa è leggendaria, e il caffè era decisamente necessario.",
  },
  {
    en: "The Church has a saint for — wait for it — everything. Lost keys, lost causes, lost hope, lost tempers, coffee, parking, tea, bachelors, beekeepers, candle makers, domestic animals, Milan, the internet, television, radio, journalists, printers, astronomers, bakers, and hangovers. The Church's saint database is the original infinite scroll.",
    it: "La Chiesa ha un santo per — tenetevi forte — tutto. Chiavi perse, cause perse, speranza perduta, bollenti spiriti, caffè, parcheggi, tè, scapoli, apicoltori, ceraioli, animali domestici, Milano, internet, televisione, radio, giornalisti, tipografi, astronomi, fornai e postumi della sbornia. Il database dei santi della Chiesa è lo scroll infinito originale.",
  },
];

function buildMonthCells(year, month, feasts) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mm = String(month + 1).padStart(2, "0");
  const cells = [];

  for (let i = 0; i < firstDow; i += 1) cells.push(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dd = String(day).padStart(2, "0");
    cells.push({
      day,
      dateStr: `${year}-${mm}-${dd}`,
      feasts: feasts.filter(
        (f) => f.date.slice(5, 7) === mm && f.date.slice(8) === dd
      ),
    });
  }

  const trailing = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < trailing; i += 1) cells.push(null);

  return cells;
}

function formatLongDate(date, language) {
  return date.toLocaleDateString(language === "en" ? "en-US" : "it-IT", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr, language) {
  const [y, m, d] = dateStr.split("-");
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return dt.toLocaleDateString(language === "en" ? "en-US" : "it-IT", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function FeastDaysPage() {
  const { language } = useLanguage();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [overlay, setOverlay] = useState(null);
  const [factIndex, setFactIndex] = useState(0);
  const [factDir, setFactDir] = useState(1);
  const factCardRef = useRef(null);

  const todayFeasts = getFeastsOnDate(today);
  const tomorrowFeasts = getFeastsOnDate(tomorrow);

  const allFeasts = getAllFeastsForYear(year);
  const monthFeasts = getFeastsForMonth(year, month);
  const monthName =
    language === "en" ? MONTHS_EN[month] : MONTHS_IT[month];
  const weekdays = language === "en" ? WEEKDAYS_EN : WEEKDAYS_IT;
  const cells = buildMonthCells(year, month, allFeasts);

  const todayStr = formatToday();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const monthTabs = (language === "en" ? MONTHS_EN : MONTHS_IT).map((m, i) => ({
    name: m,
    index: i,
  }));

  const t = {
    title: language === "en" ? "Feast Days" : "Giorni di Festa",
    subtitle:
      language === "en"
        ? "Saints and solemnities of the year, celebrated by the Church"
        : "Santi e solennità dell'anno, celebrati dalla Chiesa",
    calendar: language === "en" ? "Year Calendar" : "Calendario dell'Anno",
    feastsOf: language === "en" ? "Feasts of" : "Feste di",
    today: language === "en" ? "Today" : "Oggi",
    tomorrow: language === "en" ? "Tomorrow" : "Domani",
    celebratedToday:
      language === "en" ? "Celebrated today" : "Celebrata oggi",
    noFeastToday:
      language === "en"
        ? "No feast day is recorded for today."
        : "Nessuna festa è registrata per oggi.",
    noFeastTomorrow:
      language === "en"
        ? "No feast day is recorded for tomorrow."
        : "Nessuna festa è registrata per domani.",
    celebrateOn:
      language === "en" ? "Celebrated on" : "Celebrata il",
    viewOnWikipedia:
      language === "en" ? "View on Wikipedia" : "Vedi su Wikipedia",
    feastCount: (n) =>
      language === "en"
        ? `${n} feast${n > 1 ? "s" : ""}`
        : `${n} fest${n > 1 ? "e" : "a"}`,
    funFactTitle: language === "en" ? "Did You Know?" : "Lo Sapevi?",
    funFactSubtitle:
      language === "en"
        ? "Little secrets of the Catholic calendar, one card at a time"
        : "Piccoli segreti del calendario cattolico, una carta alla volta",
    funFactSave: language === "en" ? "Save Card" : "Salva Carta",
    funFactCount: (n, total) =>
      language === "en"
        ? `Did You Know ${n} / ${total}`
        : `Lo Sapevi ${n} / ${total}`,
    explorePrayers:
      language === "en" ? "Explore Prayers" : "Esplora Preghiere",
    backHome: language === "en" ? "Back to Home" : "Torna alla Home",
  };

  const gotoFact = (dir) => {
    setFactDir(dir);
    setFactIndex((i) => (i + dir + FUN_FACTS.length) % FUN_FACTS.length);
  };

  const openOverlay = (dateStr, feasts) => {
    if (feasts.length === 0) return;
    setOverlay({ dateStr, feasts });
  };

  const closeOverlay = () => setOverlay(null);

  const dayBlock = (label, date, feasts, emptyMsg, isToday) => (
    <div className={`feast-day-block ${isToday ? "today" : "tomorrow"}`}>
      <div className="feast-day-head">
        <div className="feast-day-heading">
          <span className="feast-day-badge">
            {isToday ? <FaSun /> : <FaMoon />}
            {label}
          </span>
          <span className="feast-day-date">
            {formatLongDate(date, language)}
          </span>
        </div>
      </div>
      {feasts.length === 0 ? (
        <p className="feast-day-empty">{emptyMsg}</p>
      ) : (
        <div className="feast-day-list">
          {feasts.map((feast) => (
            <a
              key={`${label}-${feast.en}`}
              href={getWikipediaUrl(feast.en, language)}
              target="_blank"
              rel="noopener noreferrer"
              className="feast-day-item"
            >
              <span className="feast-day-item-name">
                {language === "en" ? feast.en : feast.it}
              </span>
              <span className="feast-day-item-wiki">
                <FaWikipediaW />
                <FaExternalLinkAlt />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="feast-page">
      <Header />
      <div className="feast-content">
        <section className="feast-hero">
          <span className="feast-hero-eyebrow">✦ {t.title} ✦</span>
          <h1 className="feast-hero-title">{t.title}</h1>
          <p className="feast-hero-subtitle">{t.subtitle}</p>
        </section>

        <section className="feast-day-sections">
          {dayBlock(t.today, today, todayFeasts, t.noFeastToday, true)}
          {dayBlock(t.tomorrow, tomorrow, tomorrowFeasts, t.noFeastTomorrow, false)}
        </section>

        <section className="feast-calendar-card glass">
          <div className="feast-calendar-head">
            <div className="feast-calendar-title">
              <FaChurch className="feast-calendar-icon" />
              <h2>
                {t.calendar} — {monthName} {year}
              </h2>
            </div>
            <div className="feast-year-nav">
              <button
                className="feast-year-btn"
                onClick={() => setYear(year - 1)}
                aria-label="Previous year"
              >
                <FaChevronLeft />
              </button>
              <span className="feast-year-label">{year}</span>
              <button
                className="feast-year-btn"
                onClick={() => setYear(year + 1)}
                aria-label="Next year"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="feast-nav">
            {monthTabs.map((tab) => (
              <button
                key={tab.index}
                className={`feast-month-tab ${month === tab.index ? "active" : ""}`}
                onClick={() => setMonth(tab.index)}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="feast-weekdays">
            {weekdays.map((w) => (
              <span key={w} className="feast-weekday">
                {w}
              </span>
            ))}
          </div>
          <div className="feast-grid">
            {cells.map((cell, idx) =>
              cell === null ? (
                <div key={idx} className="feast-cell empty" />
              ) : (
                <div
                  key={idx}
                  className={`feast-cell ${
                    cell.feasts.length > 0 ? "has-feast" : ""
                  } ${isCurrentMonth && cell.dateStr === todayStr ? "today" : ""}`}
                  onClick={() => openOverlay(cell.dateStr, cell.feasts)}
                  role={cell.feasts.length > 0 ? "button" : undefined}
                  tabIndex={cell.feasts.length > 0 ? 0 : undefined}
                  onKeyDown={
                    cell.feasts.length > 0
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openOverlay(cell.dateStr, cell.feasts);
                          }
                        }
                      : undefined
                  }
                >
                  <span className="feast-day-num">{cell.day}</span>
                  {isCurrentMonth && cell.dateStr === todayStr && (
                    <span className="feast-today-badge">{t.today}</span>
                  )}
                  {cell.feasts.length > 0 && (
                    <span className="feast-cell-icon" title={t.feastCount(cell.feasts.length)}>
                      <FaGift />
                      {cell.feasts.length > 1 && (
                        <span className="feast-cell-count">
                          {cell.feasts.length}
                        </span>
                      )}
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        <section className="feast-cards-section">
          <div className="feast-cards-header">
            <FaFireAlt className="feast-cards-icon" />
            <h2>
              {t.feastsOf} {monthName} {year}
            </h2>
          </div>
          {monthFeasts.length === 0 ? (
            <p className="feast-no-cards">
              {language === "en"
                ? "No feast days recorded for this month."
                : "Nessuna festa registrata per questo mese."}
            </p>
          ) : (
            <div className="feast-cards">
              {monthFeasts.map((f) => {
                const dayNum = Number(f.date.slice(8));
                const mmdd = f.date.slice(5);
                return (
                  <div
                    key={`${f.en}-${mmdd}`}
                    className={`feast-card glass ${
                      isCurrentMonth && mmdd === todayStr.slice(5)
                        ? "is-today"
                        : ""
                    }`}
                  >
                    <div className="feast-card-date">
                      <span className="feast-card-day">{dayNum}</span>
                      <span className="feast-card-month">{monthName}</span>
                    </div>
                    <div className="feast-card-body">
                      <h3 className="feast-card-name">
                        {language === "en" ? f.en : f.it}
                      </h3>
                      <a
                        href={getWikipediaUrl(f.en, language)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="feast-card-wiki"
                      >
                        <FaWikipediaW />
                        Wikipedia
                        <FaExternalLinkAlt />
                      </a>
                    </div>
                    {isCurrentMonth && mmdd === todayStr.slice(5) && (
                      <span className="feast-card-today">{t.celebratedToday}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="fun-fact-corner">
          <div className="feast-cards-header">
            <FaLightbulb className="feast-cards-icon" />
            <div>
              <h2>{t.funFactTitle}</h2>
              <p className="fun-fact-subtitle">{t.funFactSubtitle}</p>
            </div>
          </div>
          <div className="fun-fact-card glass" ref={factCardRef}>
            <div className="fun-fact-head">
              <FaLightbulb className="fun-fact-bulb" />
              <span className="fun-fact-counter">
                {t.funFactCount(factIndex + 1, FUN_FACTS.length)}
              </span>
            </div>
            <div
              key={factIndex}
              className={`fun-fact-slide ${
                factDir === 1 ? "slide-in-right" : "slide-in-left"
              }`}
            >
              <p className="fun-fact-text">
                {language === "en"
                  ? FUN_FACTS[factIndex].en
                  : FUN_FACTS[factIndex].it}
              </p>
            </div>
            <span className="fun-fact-watermark" aria-hidden="true">
              Aeternum Floreamus
            </span>
          </div>
          <div className="fun-fact-controls">
            <button
              className="fun-fact-nav-btn"
              onClick={() => gotoFact(-1)}
              aria-label="Previous fact"
            >
              <FaChevronLeft />
            </button>
            <button
              className="fun-fact-nav-btn"
              onClick={() => gotoFact(1)}
              aria-label="Next fact"
            >
              <FaChevronRight />
            </button>
            <CaptureCard
              cardRef={factCardRef}
              title={t.funFactTitle}
              subtitle={t.funFactCount(factIndex + 1, FUN_FACTS.length)}
              fileName={`did-you-know-${factIndex + 1}`}
              shareUrl={() => window.location.href}
              shareText={
                language === "en"
                  ? FUN_FACTS[factIndex].en
                  : FUN_FACTS[factIndex].it
              }
              buttonLabel={t.funFactSave}
              buttonClassName="fun-fact-copy"
            />
          </div>
        </section>

        <div className="feast-footer-actions">
          <Link to="/prayers" className="feast-footer-btn primary">
            <FaChurch /> {t.explorePrayers} <FaArrowRight />
          </Link>
          <Link to="/home" className="feast-footer-btn ghost">
            {t.backHome}
          </Link>
        </div>
      </div>

      {/* Feast overlay */}
      {overlay && (
        <div
          className="feast-overlay-backdrop"
          onClick={closeOverlay}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="feast-overlay glass"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="feast-overlay-head">
              <div className="feast-overlay-heading">
                <FaChurch className="feast-overlay-icon" />
                <div>
                  <h2 className="feast-overlay-title">
                    {overlay.feasts.length === 1
                      ? language === "en"
                        ? overlay.feasts[0].en
                        : overlay.feasts[0].it
                      : t.feastCount(overlay.feasts.length)}
                  </h2>
                  <p className="feast-overlay-date">
                    {t.celebrateOn} {formatDateShort(overlay.dateStr, language)}
                  </p>
                </div>
              </div>
              <button
                className="feast-overlay-close"
                onClick={closeOverlay}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className="feast-overlay-body">
              {overlay.feasts.map((feast) => (
                <div key={feast.en} className="feast-overlay-row">
                  <div className="feast-overlay-name">
                    <FaChurch className="feast-overlay-row-icon" />
                    <span>
                      {language === "en" ? feast.en : feast.it}
                    </span>
                  </div>
                  <a
href={getWikipediaUrl(feast.en, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="feast-overlay-wiki"
                  >
                    <FaWikipediaW />
                    {t.viewOnWikipedia}
                    <FaExternalLinkAlt />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatToday() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}