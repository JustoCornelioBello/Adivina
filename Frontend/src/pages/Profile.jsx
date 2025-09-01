import React from "react";
import { useAuth } from "../auth/AuthContext";
import { KEYS, load } from "../utils/storage";
import { getLevelFromXP } from "../utils/rewards";

// Íconos de react-icons
import { FaMedal, FaFire, FaGem, FaCrown, FaCoins, FaStar, FaTrophy, FaLock } from "react-icons/fa";

export default function Profile() {
  const { user } = useAuth();
  const xp = load(KEYS.XP, 0);
  const coins = load(KEYS.COINS, 0);
  const diamonds = load(KEYS.DIAMONDS, 0);
  const bio = load("profile_bio", "");
  const avatarUrl = user?.avatarUrl || "";
  const country = load("profile_country", "No especificado");
  const theme = load("ui_theme", "light");
  const notify = load("ui_notify", true);
  const lang = load("ui_lang", "es");
  const streak = load(KEYS.STREAK, 0);

  const level = getLevelFromXP(xp);
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/D";

  // 🎖️ Lista de insignias
  const badges = [
    { id: "b1", name: "Novato", icon: <FaMedal />, unlocked: level >= 1 },
    { id: "b2", name: "Aprendiz", icon: <FaStar />, unlocked: level >= 5 },
    { id: "b3", name: "Experto", icon: <FaTrophy />, unlocked: level >= 10 },
    { id: "b4", name: "Maestro", icon: <FaCrown />, unlocked: level >= 20 },
    { id: "b5", name: "Racha 🔥", icon: <FaFire />, unlocked: streak >= 7 },
    { id: "b6", name: "Millonario", icon: <FaCoins />, unlocked: coins >= 1000 },
    { id: "b7", name: "Diamante raro", icon: <FaGem />, unlocked: diamonds >= 50 },
    { id: "b8", name: "Leyenda", icon: <FaCrown />, unlocked: level >= 50 },
    { id: "b9", name: "Constancia", icon: <FaStar />, unlocked: streak >= 30 },
    { id: "b10", name: "Riqueza", icon: <FaCoins />, unlocked: coins >= 10000 },
  ];

  return (
    <div className="card game-card white profile-card">
      <h2 className="mb-2">👤 Perfil del Jugador</h2>

      <div className="profile-grid">
        {/* Avatar */}
        <div className="avatar-col">
          <div className="avatar-frame">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>
          <div className="badge mt-2">
            {user?.isGuest ? "Invitado" : "Registrado"}
          </div>
        </div>

        {/* Info */}
        <div className="info-col">
          <div className="stats-grid">
            <div className="stat-card"><span>Usuario</span><b>{user?.username || "Invitado"}</b></div>
            <div className="stat-card"><span>Nivel</span><b>{level}</b></div>
            <div className="stat-card"><span>XP</span><b>{xp}</b></div>
            <div className="stat-card"><span>Racha</span><b>{streak} 🔥</b></div>
            <div className="stat-card"><span>Monedas</span><b>{coins} 🪙</b></div>
            <div className="stat-card"><span>Diamantes</span><b>{diamonds} 💎</b></div>
          </div>

          {bio && (
            <>
              <label className="mt-2">📜 Bio</label>
              <div className="input" style={{ whiteSpace: "pre-wrap" }}>
                {bio}
              </div>
            </>
          )}

          <div className="extra-info mt-2">
            <p><b>🌍 País:</b> {country}</p>
            <p><b>🌐 Idioma:</b> {lang === "es" ? "Español" : lang === "en" ? "Inglés" : lang}</p>
            <p><b>🎨 Tema:</b> {theme === "dark" ? "Oscuro 🌙" : "Claro ☀️"}</p>
            <p><b>🔔 Notificaciones:</b> {notify ? "Activadas ✅" : "Desactivadas 🚫"}</p>
            <p><b>📅 Fecha de ingreso:</b> {createdAt}</p>
          </div>
        </div>
      </div>

      {/* 🏅 Insignias */}
      <div className="badges-section mt-4">
        <h3>🏅 Insignias desbloqueables</h3>
        <div className="badges-grid">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`badge-card ${b.unlocked ? "unlocked" : "locked"}`}
            >
              <div className="badge-icon">
                {b.unlocked ? b.icon : <FaLock />}
              </div>
              <span className="badge-name">{b.name}</span>
            </div>
          ))}
        </div>
        <p className="muted mt-2">
          🔓 ¡Desbloquea más insignias avanzando de nivel, logrando rachas y acumulando riquezas!
        </p>
      </div>
    </div>
  );
}
