import React, { useState } from "react";
import GlobalConfig from "./GlobalConfig";
import Stats from "./Stats";
import UsersManager from "./UsersManager";
import PlayerReport from "./PlayerReport";
import DangerZone from "./DangerZone";
import "./Settings.css";

export default function Settings() {
  const [tab, setTab] = useState("global");

  return (
    <div className="admin-dashboard">
      <h2>⚙️ Panel de Administración</h2>

      {/* Menú de navegación */}
      <div className="admin-tabs">
        <button className={tab==="global"?"active":""} onClick={()=>setTab("global")}>⚙️ Configuración</button>
        <button className={tab==="stats"?"active":""} onClick={()=>setTab("stats")}>📊 Estadísticas</button>
        <button className={tab==="users"?"active":""} onClick={()=>setTab("users")}>👥 Usuarios</button>
        <button className={tab==="report"?"active":""} onClick={()=>setTab("report")}>📑 Reportes</button>
        <button className={tab==="danger"?"active danger":""} onClick={()=>setTab("danger")}>🛑 Zona Roja</button>
      </div>

      {/* Contenido dinámico */}
      <div className="admin-content">
        {tab==="global" && <GlobalConfig />}
        {tab==="stats" && <Stats />}
        {tab==="users" && <UsersManager />}
        {tab==="report" && <PlayerReport />}
        {tab==="danger" && <DangerZone />}
      </div>
    </div>
  );
}
