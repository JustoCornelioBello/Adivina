import React, { useState } from "react";
import { KEYS, save } from "../utils/storage";
import { useAudio } from "../contexts/AudioContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Config() {
  const [name, setName] = useState("Jugador");
  const [password, setPassword] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const { enabled, setEnabled, volume, setVolume } = useAudio();

  const handleSaveName = () => {
    save("username", name);
    toast.success("✅ Nombre guardado");
  };

  const handleChangePass = () => {
    if (newPass !== confirmPass) return toast.error("❌ Las contraseñas no coinciden");
    toast.success("🔒 Contraseña cambiada correctamente (demo).");
    setPassword(""); setNewPass(""); setConfirmPass("");
  };

  const handleRecoverAccount = () => {
    toast.info("📩 Te enviaremos un correo de recuperación (demo).");
  };

  const handleDownloadData = () => {
    const data = {};
    Object.keys(localStorage).forEach((k) => {
      try {
        data[k] = JSON.parse(localStorage.getItem(k));
      } catch {
        data[k] = localStorage.getItem(k);
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "trivia_progreso.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    if (!window.confirm("⚠️ ¿Seguro que quieres borrar todo el progreso?")) return;

    // 🔥 Limpieza TOTAL de progreso
    localStorage.clear();

    // 🔥 Reescribir valores iniciales
    save(KEYS.XP, 0);
    save(KEYS.COINS, 0);
    save(KEYS.DIAMONDS, 0);
    save(KEYS.STREAK, 0);
    save(KEYS.SCORE, 0);
    save(KEYS.CURRENT_Q, 0);
    save(KEYS.HINTS, 3);
    save(KEYS.LIVES, Array(5).fill(null));
    save(KEYS.MULTIPLIER, null);
    save(KEYS.MISSIONS_DAILY, null);
    save(KEYS.MISSIONS_WEEKLY, null);

    toast.success("🔥 Progreso reiniciado");
    setTimeout(() => window.location.reload(), 1500); // recarga para arrancar limpio
  };

  return (
    <div className="card game-card white">
      <h2 className="mb-3">⚙️ Configuración</h2>

      {/* Perfil */}
      <section className="config-section">
        <h4>Perfil</h4>
        <label>Nombre de usuario:</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn primary mt-2" onClick={handleSaveName}>
          Guardar nombre
        </button>
      </section>

      {/* Seguridad */}
      <section className="config-section">
        <h4>Seguridad</h4>
        <label>Contraseña actual:</label>
        <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label>Nueva contraseña:</label>
        <input type="password" className="input" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
        <label>Confirmar nueva contraseña:</label>
        <input type="password" className="input" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
        <button className="btn primary mt-2" onClick={handleChangePass}>Cambiar contraseña</button>
        <button className="btn outline mt-2" onClick={handleRecoverAccount}>Recuperar cuenta</button>
      </section>

      {/* Música */}
      <div className="config-section">
        <h4>Música de Fondo 🎶</h4>
        <label className="toggle">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          {enabled ? "Encendida" : "Apagada"}
        </label>
        <label>
          Volumen:
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
        </label>
      </div>

      {/* Datos */}
      <section className="config-section">
        <h4>Datos</h4>
        <button className="btn outline" onClick={handleDownloadData}>📥 Descargar progreso</button>
        <button className="btn danger mt-2" onClick={resetAll}>🗑️ Restablecer progreso</button>
      </section>
    </div>
  );
}
