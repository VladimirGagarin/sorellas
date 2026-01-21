import { useContext, createContext, useState } from "react";


const LanguageContext = createContext();
export function LanguageProvider({ children, value }) {
    const 
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}