import { useState } from "react";
import { getQuotes, resolvePrayerPhoto } from "../components/Utils.js";


export default function QuoteCard() {
    const [photoUrl, setPhotoUrl] = useState(undefined);
   
     const quotes = useMemo(
        () => getQuotes().map((q, i) => ({ ...q, _id: i })),
        []
    );

    const randomQuote = useMemo(
        for(let i = quotes.length - 1; i >0; i--) {
        
        }
    )
    useEffect(() => {
       let active = true;
       setPhotoUrl(undefined);
       if (!currentQuote) return undefined;
       const loader = resolvePrayerPhoto(currentQuote.photo);
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
     }, [currentQuote]);
    
    return (
        
                <article className="quotes-card" key={currentQuote._id}>
                  <div className="quotes-card-header">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={currentQuote.author}
                        className="quotes-photo"
                      />
                    ) : (
                      <div className="quotes-photo quotes-monogram">
                        {getInitials(currentQuote.author)}
                      </div>
                    )}
                    <div className="quotes-card-meta">
                      <cite className="quotes-author">
                        {currentQuote.author}
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