// src/components/NotificationModal.jsx
import React from "react";
import "./NotificationModal.css";

export default function NotificationModal({ open, onClose, notification }) {
  if (!open || !notification) return null;

  return (
    <div className="notif-backdrop">
      <div className={`notif-box ${notification.level}`}>
        <h3>{notification.title}</h3>
        <p>{notification.message}</p>
        <small>📅 {new Date(notification.timestamp).toLocaleString()}</small>
        <div className="notif-actions">
          <button className="btn primary" onClick={onClose}>Entendido</button>
        </div>
      </div>
    </div>
  );
}
