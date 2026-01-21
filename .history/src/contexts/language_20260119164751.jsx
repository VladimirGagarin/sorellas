import { useContext, createContext } from "react";


const LanguageContext = createContext();
export function LanguageProvider({ children, value }) {
    return (