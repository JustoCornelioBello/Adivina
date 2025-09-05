// src/pages/multiplayer/ChallengeLobby.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useMultiplayer } from "../../contexts/MultiplayerContext";
import axios from "axios";
import "./multiplayer.css";
import { Navigate } from "react-router-dom";   // 👈 IMPORTANTE


const API_URL = "http://localhost:8000";

export default function ChallengeLobby() {
  const { user } = useAuth();
  const { createChallenge, playWithBot, fetchHistory } = useMultiplayer();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);

  // cargar usuarios disponibles
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/multiplayer/users`);
        setUsers(res.data.filter((u) => u.id !== user?.uid));
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    };
    if (user?.uid) loadUsers();
  }, [user]);

  // historial de partidas
  useEffect(() => {
    const loadHistory = async () => {
      if (!user?.uid) return;
      const res = await fetchHistory(user.uid);
      if (res.ok) setHistory(res.history);
    };
    loadHistory();
  }, [user, fetchHistory]);

  // enviar reto
  const handleChallenge = async (rivalId, maxQuestions = 5) => {
    const res = await createChallenge(rivalId, maxQuestions);
    if (res.ok) {
      alert(`🚀 Reto enviado a ${rivalId}`);
    } else {
      alert("❌ Error al enviar reto");
    }
  };

 const handleBot = async () => {
    try {
      const res = await playWithBot(user.uid, 5); // ✅ usamos la función ya extraída
      if (res.ok) {
        alert("🤖 Juego contra bot iniciado");
        // opcional: redirigir a BotBattle
        Navigate("/multiplayer/botbattle");
      } else {
        alert("❌ Error al jugar contra el bot");
      }
    } catch (err) {
      console.error("Error contra bot:", err);
    }
  };


  return (
    <div className="card fade-in">
      <h2>⚔️ Multijugador</h2>

      {/* 🔹 jugadores */}
      <section>
        <h3>👥 Jugadores disponibles</h3>
        <input
          className="input"
          placeholder="🔍 Buscar jugador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="users-list">
          {users
            .filter(
              (u) =>
                u.username?.toLowerCase().includes(search.toLowerCase()) ||
                u.id.includes(search)
            )
            .map((u) => (
              <div key={u.id} className="user-card">
                <span>
                  👤 <b>{u.username}</b> | XP: {u.xp ?? 0}
                </span>
                <button
                  className="btn primary"
                  onClick={() => handleChallenge(u.id, 5)}
                >
                  🚀 Retar
                </button>
              </div>
            ))}
          {users.length === 0 && (
            <p className="muted">No hay jugadores disponibles.</p>
          )}
        </div>
      </section>

      <hr />

      {/* 🔹 historial */}
      <section>
        <h3>📜 Historial de partidas</h3>
        {history.length === 0 ? (
          <p className="muted">No tienes partidas registradas.</p>
        ) : (
          <ul className="history-list">
            {history.map((h) => (
              <li key={h.id}>
                {h.rival_id === "BOT" ? "🤖 Bot" : h.rival_id} - {h.status} (
                {h.max_questions} preguntas)
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      {/* 🔹 bot */}
      <section>
        <h3>🤖 Desafía al Bot</h3>
        <p>Si no hay jugadores conectados, puedes jugar contra el bot.</p>
        <button className="btn warning" onClick={handleBot}>
          🎮 Jugar contra Bot
        </button>
      </section>
    </div>
  );
}
