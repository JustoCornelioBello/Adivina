import React, { useEffect, useState } from "react";

/**
 * Muestra un texto flotante temporal (e.g., "+100 XP") con animación CSS.
 * Cambia "triggerKey" para relanzar la animación.
 */
export default function FloatingXP({ text = "+100 XP", triggerKey }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!triggerKey) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!show) return null;
  return <div className="floating-xp">{text}</div>;
}
