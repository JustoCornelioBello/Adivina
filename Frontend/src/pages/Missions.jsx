// src/pages/Missions.jsx
import React, { useEffect, useState } from "react";
import { KEYS, scopedLoad, scopedSave } from "../utils/storageScoped";
import CountdownTimer from "../components/CountdownTimer";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

/* helpers */
function getEndOfDay() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}
function getEndOfWeek() {
  const now = new Date();
  const diff = (7 - now.getDay()) % 7;
  const end = new Date(now);
  end.setDate(now.getDate() + diff);
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}
function isToday(ts) {
  const d = new Date(ts), n = new Date();
  return d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear();
}
function getWeekNumber(d) {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
}
function isSameWeek(ts) {
  const now = new Date(), then = new Date(ts);
  return getWeekNumber(now) === getWeekNumber(then) &&
    now.getFullYear() === then.getFullYear();
}

/* =========================
   Inicializadores
   ========================= */
function initDailyMissions() {
  return {
    generatedAt: Date.now(),
    missions: [
      { id: "d1", title: "Responder 5 preguntas", target: 5, progress: 0, reward: { type: "xp", amount: 200, label: "+200 XP" }, claimed: false },
      { id: "d2", title: "Responder 10 preguntas", target: 10, progress: 0, reward: { type: "coins", amount: 300, label: "300 Monedas" }, claimed: false },
      { id: "d3", title: "Usar 1 pista", target: 1, progress: 0, reward: { type: "coins", amount: 100, label: "+100 Monedas" }, claimed: false },
      { id: "d4", title: "Responder 3 seguidas", target: 3, progress: 0, reward: { type: "coins", amount: 300, label: "+300 Monedas" }, claimed: false },
      { id: "d5", title: "Ganar 500 monedas", target: 500, progress: 0, reward: { type: "diamonds", amount: 5, label: "💎 5 Diamantes" }, claimed: false },
    ],
  };
}

function initWeeklyMissions() {
  return {
    generatedAt: Date.now(),
    missions: [
      { id: "w1", title: "Responder 50 preguntas", target: 50, progress: 0, reward: { type: "xp", amount: 2000, label: "+2000 XP" }, claimed: false },
      { id: "w2", title: "Responder 100 preguntas", target: 100, progress: 0, reward: { type: "coins", amount: 2000, label: "2000 Monedas" }, claimed: false },
      { id: "w3", title: "Alcanzar nivel 10", target: 10, progress: 0, reward: { type: "xp", amount: 1000, label: "+1000 XP" }, claimed: false },
      { id: "w4", title: "Alcanzar nivel 20", target: 20, progress: 0, reward: { type: "diamonds", amount: 10, label: "💎 10 Diamantes" }, claimed: false },
      { id: "w5", title: "15 correctas seguidas", target: 15, progress: 0, reward: { type: "xp", amount: 1500, label: "+1500 XP" }, claimed: false },
    ],
  };
}

/* =========================
   Componente principal
   ========================= */
export default function Missions() {
  const { user } = useAuth();

  const [daily, setDaily] = useState(() => {
    const stored = scopedLoad(user, KEYS.MISSIONS_DAILY, null);
    if (stored) return stored;
    const fresh = initDailyMissions();
    scopedSave(user, KEYS.MISSIONS_DAILY, fresh);
    return fresh;
  });

  const [weekly, setWeekly] = useState(() => {
    const stored = scopedLoad(user, KEYS.MISSIONS_WEEKLY, null);
    if (stored) return stored;
    const fresh = initWeeklyMissions();
    scopedSave(user, KEYS.MISSIONS_WEEKLY, fresh);
    return fresh;
  });

  // Reinicio diario/semanal
  useEffect(() => {
    if (!daily || !isToday(daily.generatedAt)) {
      const fresh = initDailyMissions();
      setDaily(fresh);
      scopedSave(user, KEYS.MISSIONS_DAILY, fresh);
    }
    if (!weekly || !isSameWeek(weekly.generatedAt)) {
      const fresh = initWeeklyMissions();
      setWeekly(fresh);
      scopedSave(user, KEYS.MISSIONS_WEEKLY, fresh);
    }
  }, [user]);

  // Refrescar cada segundo
  useEffect(() => {
    const id = setInterval(() => {
      setDaily(scopedLoad(user, KEYS.MISSIONS_DAILY, initDailyMissions()));
      setWeekly(scopedLoad(user, KEYS.MISSIONS_WEEKLY, initWeeklyMissions()));
    }, 1000);
    return () => clearInterval(id);
  }, [user]);

  /* -------------------------
     Reclamar misión
  ------------------------- */
  const claim = (mission, setMission, typeKey) => {
    if (mission.progress >= mission.target && !mission.claimed) {
      const updated = { ...mission, claimed: true };

      setMission((prev) => {
        const newMissions = prev.missions.map((m) =>
          m.id === mission.id ? updated : m
        );
        const copy = { ...prev, missions: newMissions, generatedAt: prev.generatedAt };
        scopedSave(user, typeKey, copy);
        return copy;
      });

      // 🔥 Aplica recompensa según el tipo
      if (mission.reward.type === "xp") {
        const xp = scopedLoad(user, KEYS.XP, 0) + mission.reward.amount;
        scopedSave(user, KEYS.XP, xp);
      }
      if (mission.reward.type === "coins") {
        const coins = scopedLoad(user, KEYS.COINS, 0) + mission.reward.amount;
        scopedSave(user, KEYS.COINS, coins);
      }
      if (mission.reward.type === "diamonds") {
        const diamonds = scopedLoad(user, KEYS.DIAMONDS, 0) + mission.reward.amount;
        scopedSave(user, KEYS.DIAMONDS, diamonds);
      }

      // 🎉 Toast bonito
      toast.success(`🎁 Recompensa obtenida: ${mission.reward.label}`, {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const renderMission = (m, setMission, typeKey) => {
    const percent = Math.min(100, (m.progress / m.target) * 100);
    return (
      <div key={m.id} className={`mission-card ${m.claimed ? "done" : ""}`}>
        <h5>{m.title}</h5>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <small>{m.progress} / {m.target}</small>
        <span className="reward">🎁 {m.reward.label}</span>
        <button
          className="btn small"
          disabled={m.claimed || m.progress < m.target}
          onClick={() => claim(m, setMission, typeKey)}
        >
          {m.claimed ? "Reclamado ✅" : "Reclamar"}
        </button>
      </div>
    );
  };

  return (
    <div className="card game-card white">
      <h2>📅 Misiones</h2>
      <p className="muted">Completa retos para obtener XP, monedas y diamantes.</p>

      <section>
        <h4>🌞 Misiones Diarias</h4>
        <CountdownTimer targetTime={getEndOfDay()} />
        <div className="missions-grid">
          {daily.missions.map((m) =>
            renderMission(m, setDaily, KEYS.MISSIONS_DAILY)
          )}
        </div>
      </section>

      <section>
        <h4>📆 Misiones Semanales</h4>
        <CountdownTimer targetTime={getEndOfWeek()} />
        <div className="missions-grid">
          {weekly.missions.map((m) =>
            renderMission(m, setWeekly, KEYS.MISSIONS_WEEKLY)
          )}
        </div>
      </section>
    </div>
  );
}
