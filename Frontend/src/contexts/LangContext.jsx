import React, { createContext, useContext, useState, useEffect } from "react";
import { load, save } from "../utils/storage";
import translations from "../i18n";

// Crear contexto
const LangContext = createContext();

// Proveedor de idioma
export function LangProvider({ children }) {
  const [lang, setLang] = useState(load("ui_lang", "es"));

  useEffect(() => {
    document.documentElement.lang = lang;
    save("ui_lang", lang);
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations["es"][key] || key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

// Hook para consumir idioma
export function useLang() {
  return useContext(LangContext);
}
