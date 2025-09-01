import React, { useEffect, useState } from "react";
import "./ChestModal.css"; // estilos que te paso abajo

export default function ChestModal({ open, onClose, reward }) {
  const [stage, setStage] = useState("closed");

  useEffect(() => {
    if (open) {
      setStage("opening");
      const t = setTimeout(() => setStage("opened"), 1500); // después de animación
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="chest-modal">
        <div className={`chest ${stage}`}>
          {stage === "opened" && (
            <div className="reward">
              <h3>🎉 ¡Ganaste!</h3>
              <p>{reward.label}</p>
              <button className="btn primary mt-2" onClick={onClose}>
                Reclamar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
