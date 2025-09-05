import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import "./multiplayer.css";

const API_URL = "http://localhost:8000/multiplayer";

export default function MatchHistory() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/history/${user.uid}`);
        setMatches(res.data || []);
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    };
    load();
  }, [user]);

  return (
    <div className="card fade-in">
      <h2>📜 Historial de Partidas</h2>
      {matches.length === 0 ? (
        <p className="muted">No tienes partidas registradas todavía.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Rival</th>
              <th>Preguntas</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m, i) => (
              <tr key={i}>
                <td>{new Date(m.timestamp).toLocaleString()}</td>
                <td>{m.rival_name || m.rival_id}</td>
                <td>{m.max_questions}</td>
                <td>
                  {m.result === "win" ? "🏆 Victoria" :
                   m.result === "lose" ? "❌ Derrota" : "🤝 Empate"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
