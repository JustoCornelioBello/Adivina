import React, { useState } from "react";
import Terms from "./config/Terms";
import Account from "./config/Account";
import MyData from "./config/MyData";
import ProfileSettings from "./config/ProfileSettings";
import Support from "./config/Support";
import About from "./config/About";
import Languages from "./config/Languages"; // 👈 nuevo


const TABS = [
  { key: "profile", label: "Perfil" },
  { key: "account", label: "Cuenta" },
  { key: "data", label: "Mis datos" },
  { key: "support", label: "Soporte" },
  { key: "about", label: "Acerca" },
    { key: "languages", label: "Idiomas" }, // 👈 nuevo
  { key: "terms", label: "Términos" },
];

export default function ConfigTabs() {
  const [tab, setTab] = useState("profile");
  return (
    <div className="card game-card white">
      <h2 className="mb-2">Ajustes</h2>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === "profile" && <ProfileSettings />}
        {tab === "account" && <Account />}
        {tab === "data" && <MyData />}
        {tab === "support" && <Support />}
        {tab === "about" && <About />}
        {tab === "terms" && <Terms />}
        {tab === "languages" && <Languages />} {/* 👈 nuevo */}
      </div>
    </div>
  );
}
