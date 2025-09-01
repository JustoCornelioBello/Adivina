import React, { useEffect, useState } from "react";

export default function CountdownTimer({ targetTime }) {
  const [remaining, setRemaining] = useState(targetTime - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(targetTime - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  if (remaining <= 0) return <span>⏰ Reiniciando...</span>;

  const totalSec = Math.floor(remaining / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  return (
    <span className="countdown">
      ⏰ {days > 0 && `${days}d `}{hours}h {minutes}m {seconds}s
    </span>
  );
}
