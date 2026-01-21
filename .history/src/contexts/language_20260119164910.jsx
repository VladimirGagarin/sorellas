import { useContext, createContext, useState } from "react";


const LanguageContext = createContext();
export function LanguageProvider({ children}) {
    const [language, setLanguage] = useState("it");
    
    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}