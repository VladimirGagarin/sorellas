import { useState, useMemo } from "react";
import { getQuotes, resolvePrayerPhoto } from "../components/Utils.js";


export default function QuoteCard() {
    const [photoUrl, setPhotoUrl] = useState(undefined);
   
     const quotes = useMemo(
        () => getQuotes().map((q, i) => ({ ...q, _id: i })),
        []
    );

    const randomQuote = () => {
        let arr = [...quotes]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]
        
        }
        // return 1 quote
        return arr[0]
    }

    useEffect(() => {
       let active = true;
       setPhotoUrl(undefined);
       if (!randomQuote) return undefined;
       const loader = resolvePrayerPhoto(randomQuote.photo);
       if (loader) {
         loader()
           .then((mod) => {
             if (active) setPhotoUrl(mod.default || mod);
           })
           .catch(() => {
             if (active) setPhotoUrl(null);
           });
       } else {
         setPhotoUrl(null);
       }
       return () => {
         active = false;
       };
    }, []);
    

    function getInitials(name) {
      const words = name.trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) return "☩";
      if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    
    return (
        
                <article className="quotes-card" key={randomQuote._id}>
                  <div className="quotes-card-header">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={randomQuote.author}
                        className="quotes-photo"
                      />
                    ) : (
                      <div className="quotes-photo quotes-monogram">
                        {getInitials(randomQuote.author)}
                      </div>
                    )}
                    <div className="quotes-card-meta">
                      <cite className="quotes-author">
                        {randomQuote.author}
                      </cite>
                      <span className="quotes-category-badge">
                        {catLabel.en} · {catLabel.it}
                      </span>
                    </div>
                  </div>
        
                  <div className="quotes-quote-body">
                    <FaQuoteLeft className="quotes-open-mark" />
                    <blockquote className="quotes-quote-text">{quoteText}</blockquote>
                    <FaQuoteRight className="quotes-close-mark" />
                  </div>
        
                  {otherText && (
                    <p className="quotes-other-lang">{otherText}</p>
                  )}
        
                  <div className="gold-rule" />
        
                  <div className="quotes-actions">
                    <button className="quotes-action listen" onClick={handleListen}>
                      <FaVolumeUp />
                      {t.listen}
                    </button>
                    <button className="quotes-action share" onClick={handleShare}>
                      <FaLink /> {copied ? t.copied : t.copyLink}
                    </button>
                  </div>
                </article>
        
    )
}