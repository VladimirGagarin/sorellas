import { useContext, createContext, use } from "react";


const LanguageContext = createContext();
export function LanguageProvider({ children, value }) {
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}