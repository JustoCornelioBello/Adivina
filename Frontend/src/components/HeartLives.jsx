import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function HeartLives({ lives = [] }) {
  const now = Date.now();

  return (
    <div className="lives-grid">
      {lives.map((life, i) =>
        life === null ? (
          <FaHeart key={i} className="heart-full heartbeat" size={22} />
        ) : (
          <div key={i} className="heart-timer">
            <FaRegHeart className="heart-empty" size={22} />
            <span className="timer-label">
              {/* muestra minutos restantes redondeados hacia arriba */}
              {Math.max(0, Math.ceil((life - now) / 1000 / 60))}m
            </span>
          </div>
        )
      )}
    </div>
  );
}
