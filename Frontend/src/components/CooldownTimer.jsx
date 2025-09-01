import React, { useEffect, useState } from "react";

/**
 * Muestra el tiempo restante para recuperar las vidas.
 * Se activa cuando lives === 0 y existe nextLifeAt (timestamp).
 */
export default function CooldownTimer({ nextLifeAt, onRestore }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      if (!nextLifeAt) return setRemaining(0);
      const ms = Math.max(0, nextLifeAt - Date.now());
      setRemaining(ms);
      if (ms === 0 && onRestore) onRestore(); // restaura cuando llega a 0
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextLifeAt, onRestore]);

  if (!nextLifeAt || remaining <= 0) return null;

  const totalSec = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <div className="cooldown-pill">
      🕒 Recuperación de vidas en {mm}:{ss}
    </div>
  );
}
