import React from "react";
import { useLang } from "../../contexts/LangContext";

const LANGS = [
  { code: "es", label: "Español 🇪🇸" },
  { code: "en", label: "English 🇺🇸" },
  { code: "fr", label: "Français 🇫🇷" },
  { code: "pt", label: "Português 🇧🇷" },
];

export default function Languages() {
  const { lang, setLang } = useLang();

  return (
    <div className="config-section">
      <h4>Idioma</h4>
      <p className="muted">Selecciona el idioma de la aplicación.</p>
      <select
        className="input"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
