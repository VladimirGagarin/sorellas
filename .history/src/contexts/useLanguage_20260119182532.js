import { useContext } from "react";
import { LanguageContext } from "./language";

export const useLanguage = () => {
  return useContext(LanguageContext);
};
