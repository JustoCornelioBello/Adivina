// src/components/ConfirmModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ConfirmModal.css";

export default function ConfirmModal({ open, type = "info", title, message, onConfirm, onCancel }) {
  if (!open) return null;

  // Iconos y colores según tipo
  const config = {
    info: { icon: "ℹ️", color: "#3498db" },
    success: { icon: "✅", color: "#2ecc71" },
    warning: { icon: "⚠️", color: "#f1c40f" },
    danger: { icon: "🗑️", color: "#e74c3c" },
  };

  const { icon, color } = config[type] || config.info;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="modal-icon" style={{ color }}>{icon}</div>
            <h3 className="modal-title">{title}</h3>
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
              {onCancel && (
                <button className="btn outline" onClick={onCancel}>
                  Cancelar
                </button>
              )}
              {onConfirm && (
                <button className={`btn ${type}`} onClick={onConfirm}>
                  Confirmar
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
