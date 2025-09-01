import React, { useEffect, useState } from "react";

/**
 * Globo motivador (emoji + texto) con fade/float.
 * Cambia `triggerKey` para relanzar la animación.
 */
export default function Motivator({ emoji = "🎉", text = "¡Excelente!", triggerKey }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!triggerKey) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!show) return null;

  return (
    <div className="motivator-bubble" role="status" aria-live="polite">
      <span className="mot-emoji">{emoji}</span>
      <span className="mot-text">{text}</span>
    </div>
  );
}
