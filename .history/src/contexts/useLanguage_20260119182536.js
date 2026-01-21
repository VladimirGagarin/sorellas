import { useContext } from "react";
import { LanguageContext } from "./language.jsx";

export const useLanguage = () => {
  return useContext(LanguageContext);
};
