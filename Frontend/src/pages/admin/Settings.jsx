// src/pages/admin/Settings.jsx
import React, { useState } from "react";

export default function Settings() {
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="admin-settings">
      <h2>⚙️ Configuración del Sistema</h2>
      <label>
        <input
          type="checkbox"
          checked={maintenance}
          onChange={() => setMaintenance(!maintenance)}
        />
        Modo mantenimiento
      </label>
      <p>{maintenance ? "🛠 El sistema está en mantenimiento" : "✅ Sistema activo"}</p>
    </div>
  );
}
