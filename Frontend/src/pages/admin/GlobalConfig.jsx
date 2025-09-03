import React, { useState, useEffect } from "react";
import "./admin.css";
import axios from "axios";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const API_URL = "http://localhost:8000"; // 👈 cámbialo en producción

export default function GlobalConfig() {
  const [maintenance, setMaintenance] = useState(false);
  const [msg, setMsg] = useState("");
  const [economy, setEconomy] = useState({ coinRate: 1, xpRate: 1 });
  const [logs, setLogs] = useState([]);
  const [backup, setBackup] = useState(null);

  // 🔹 Cargar mensajes guardados al inicio
  useEffect(() => {
    const fetchLogs = async () => {
      const snap = await getDocs(collection(db, "global_messages"));
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLogs(msgs.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    };
    fetchLogs();
  }, []);

  // ✅ Enviar notificación global
  const sendGlobalNotification = async () => {
    if (!msg.trim()) return alert("⚠️ El mensaje no puede estar vacío");
    try {
      // 1. Enviar al backend (notifica a usuarios)
      await axios.post(`${API_URL}/users/notify_all`, {
        title: "📢 Anuncio Global",
        message: msg,
        level: "info",
      });

      // 2. Guardar en Firestore
      await addDoc(collection(db, "global_messages"), {
        message: msg,
        timestamp: serverTimestamp(),
      });

      // 3. Actualizar estado local
      setLogs((prev) => [
        { message: msg, timestamp: { seconds: Date.now() / 1000 } },
        ...prev,
      ]);

      alert("✅ Notificación global enviada 🚀");
      setMsg("");
    } catch (err) {
      console.error("Error al enviar notificación:", err);
      alert("❌ Error al enviar la notificación");
    }
  };

  // ✅ Descargar historial en JSON
  const downloadLogs = () => {
    if (logs.length === 0) return alert("No hay mensajes para descargar");
    const data = logs.map((l) => ({
      message: l.message,
      fecha: l.timestamp
        ? new Date(l.timestamp.seconds * 1000).toLocaleString()
        : "N/D",
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mensajes_globales.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Simular backup
  const handleBackup = () => {
    const fakeBackup = {
      timestamp: new Date().toISOString(),
      config: { maintenance, economy },
    };
    setBackup(fakeBackup);
    alert("📦 Backup generado correctamente");
  };

  return (
    <div className="card fade-in">
      <h2>⚙️ Configuración Global del Sistema</h2>
      <p className="muted">
        Administra el comportamiento general del sistema: modo mantenimiento, economía,
        seguridad, notificaciones y más.
      </p>

      {/* ================= */}
      {/* 🛠 Mantenimiento */}
      {/* ================= */}
      <section className="admin-section">
        <h3>🛠 Modo Mantenimiento</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={maintenance}
            onChange={() => setMaintenance(!maintenance)}
          />
          <span className="slider"></span>
        </label>
        <p>
          {maintenance
            ? "⚠️ El sistema está en mantenimiento. Solo los administradores tienen acceso."
            : "✅ Sistema activo y disponible para todos los usuarios."}
        </p>
      </section>

      <hr />

      {/* ================= */}
      {/* 💰 Economía */}
      {/* ================= */}
      <section className="admin-section">
        <h3>💰 Configuración de Economía</h3>
        <div className="form-grid">
          <label>
            Ratio de Monedas:
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={economy.coinRate}
              onChange={(e) =>
                setEconomy({ ...economy, coinRate: parseFloat(e.target.value) })
              }
            />
          </label>
          <label>
            Ratio de XP:
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={economy.xpRate}
              onChange={(e) =>
                setEconomy({ ...economy, xpRate: parseFloat(e.target.value) })
              }
            />
          </label>
        </div>
        <p>
          ⚡ Estos ratios multiplican las recompensas que reciben los jugadores
          (ej: XP x{economy.xpRate}, Monedas x{economy.coinRate}).
        </p>
      </section>

      <hr />

      {/* ================= */}
      {/* 📢 Notificación Global */}
      {/* ================= */}
      <section className="admin-section">
        <h3>📢 Notificación Global</h3>
        <textarea
          placeholder="Escribe un anuncio para todos los usuarios..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="actions-row">
          <button className="btn success" onClick={sendGlobalNotification}>
            🚀 Enviar anuncio
          </button>
          <button className="btn outline" onClick={downloadLogs}>
            ⬇️ Descargar historial
          </button>
        </div>
      </section>

      <hr />

      {/* ================= */}
      {/* 📊 Logs */}
      {/* ================= */}
      <section className="admin-section">
        <h3>📊 Historial de Anuncios</h3>
        {logs.length === 0 ? (
          <p className="muted">No hay mensajes enviados.</p>
        ) : (
          <ul className="logs-list">
            {logs.map((log, i) => (
              <li key={i}>
                <b>{log.message}</b> —{" "}
                {log.timestamp
                  ? new Date(log.timestamp.seconds * 1000).toLocaleString()
                  : "N/D"}
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      {/* ================= */}
      {/* 📦 Backups */}
      {/* ================= */}
      <section className="admin-section">
        <h3>📦 Backups & Restauración</h3>
        <button className="btn success" onClick={handleBackup}>
          💾 Generar Backup
        </button>
        {backup && (
          <p>
            Último backup:{" "}
            <b>{new Date(backup.timestamp).toLocaleString()}</b>
          </p>
        )}
      </section>
    </div>
  );
}
