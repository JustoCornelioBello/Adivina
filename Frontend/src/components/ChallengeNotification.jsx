import React from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/multiplayer";

export default function ChallengeNotification({ notif, onClose }) {
  if (!notif) return null;

  const respond = async (accept) => {
    await axios.post(`${API_URL}/challenge/respond`, {
      challengeId: notif.challengeId,
      accept,
    });
    onClose();
    if (accept) {
      window.location.href = `/multiplayer/duel/${notif.challengeId}`;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>⚔️ Desafío recibido</h3>
        <p>{notif.msg}</p>
        <div className="modal-actions">
          <button className="btn success" onClick={() => respond(true)}>
            ✅ Aceptar
          </button>
          <button className="btn danger" onClick={() => respond(false)}>
            ❌ Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
