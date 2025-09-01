import React, { useState, useEffect } from "react";
import { load, save } from "../../utils/storage";

const LANGS = [
  { code: "es", label: "Español 🇪🇸" },
  { code: "en", label: "English 🇺🇸" },
  { code: "fr", label: "Français 🇫🇷" },
  { code: "pt", label: "Português 🇧🇷" },
];

export default function Languages() {
  const [lang, setLang] = useState(load("ui_lang", "es"));

  useEffect(() => {
    document.documentElement.lang = lang;
    save("ui_lang", lang);
  }, [lang]);

  return (
    <div className="config-section">
      <h4>Idioma</h4>
      <p className="muted">Selecciona el idioma de la aplicación.</p>
      <div className="two-col">
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
      <p className="muted mt-2">
        El idioma elegido se recordará para futuras sesiones.
      </p>
    </div>
  );
}
