import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./admin.css";

export default function DangerZone() {
  const [loading, setLoading] = useState(false);

  // Descargar todos los datos antes de borrarlos
  const backupData = async () => {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_users.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Resetear progreso de todos los usuarios
  const resetAllProgress = async () => {
    if (!window.confirm("⚠️ ¿Seguro que deseas reiniciar TODO el progreso de todos los usuarios?")) return;
    setLoading(true);
    const snap = await getDocs(collection(db, "users"));
    for (let d of snap.docs) {
      await updateDoc(doc(db, "users", d.id), { xp: 0, coins: 0, streak: 0 });
    }
    setLoading(false);
    alert("✅ Progreso global reiniciado");
  };

  // Eliminar todos los usuarios
  const deleteAll = async () => {
    if (!window.confirm("⚠️ Esto eliminará TODOS los datos del sistema. ¿Seguro?")) return;
    if (!window.confirm("❌ Esta acción es IRREVERSIBLE. ¿Confirmar?")) return;
    setLoading(true);
    const snap = await getDocs(collection(db, "users"));
    for (let d of snap.docs) {
      await deleteDoc(doc(db, "users", d.id));
    }
    setLoading(false);
    alert("❌ Todos los usuarios eliminados permanentemente");
  };

  return (
    <div className="card danger-zone fade-in">
      <h2 className="danger-title">🛑 Zona Roja de Administración</h2>
      <p className="muted">
        Acciones extremadamente peligrosas que <b>NO se pueden deshacer</b>.  
        Úsalas solo en emergencias absolutas.
      </p>

      <div className="danger-actions">
        <button className="btn warning" onClick={backupData}>
          📥 Descargar respaldo de usuarios
        </button>
        <button className="btn primary" onClick={resetAllProgress} disabled={loading}>
          🔄 Reiniciar progreso global
        </button>
        <button className="btn danger" onClick={deleteAll} disabled={loading}>
          🗑 Eliminar TODOS los usuarios
        </button>
      </div>

      {loading && <p className="loading-msg">⏳ Procesando acción, espera...</p>}
    </div>
  );
}
