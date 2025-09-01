import React from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ open, onClose, title, message }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="btn primary mt-2" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}
