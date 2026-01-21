import { useContext, createContext, useS } from "react";


const LanguageContext = createContext();
export function LanguageProvider({ children, value }) {
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}