// src/components/ConfirmModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ConfirmModal.css"; // 👈 tus estilos

export default function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-overlay" onClick={onClose}>
            <motion.div
              className="modal-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // 👈 evita cerrar al click dentro
            >
              <h3>{title}</h3>

              {/* 👇 antes usabas <p>, cámbialo a <div> */}
              <div className="modal-message">
                {typeof message === "string" ? <p>{message}</p> : message}
              </div>

              <div className="modal-actions">
                <button className="btn cancel" onClick={onClose}>
                  ❌ Cancelar
                </button>
                <button
                  className="btn confirm"
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    onClose(); // 👈 cierra el modal al confirmar
                  }}
                >
                  ✅ Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
