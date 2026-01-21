import { useContext } from "react";
import { LanguageContext } from "./anguageContext";

export const useLanguage = () => {
  return useContext(LanguageContext);
};
