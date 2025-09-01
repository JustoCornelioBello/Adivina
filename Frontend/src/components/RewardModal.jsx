import React from "react";

export default function RewardModal({ open, reward, onClaim, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="chest-anim" aria-hidden>🧰</div>
<h3>{reward?.chestType === "big" ? "🏆 Cofre Grande" : "🎁 Cofre Misterioso"}</h3>
        <p className="muted">Has alcanzado un hito. ¡Reclama tu premio!</p>

        <div className="reward-pill">
          {reward?.label ?? "Recompensa misteriosa"}
        </div>

        <div className="actions-row" style={{ marginTop: 10 }}>
          <button className="btn primary" onClick={onClaim}>Reclamar</button>
          <button className="btn outline" onClick={onClose}>Más tarde</button>
        </div>
      </div>
    </div>
  );
}
