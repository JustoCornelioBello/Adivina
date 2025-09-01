import React from "react";

export default function ProgressBarXP({ xp }) {
  const level = Math.floor(xp / 1000);
  const progress = xp % 1000;
  const pct = Math.min(100, (progress / 1000) * 100);

  return (
    <div className="mt-3 text-start">
      <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 6 }}>
        Nivel {level} — {progress}/1000 XP
      </div>
      <div style={{
        background: "rgba(255,255,255,0.15)",
        borderRadius: 10,
        height: 12,
        overflow: "hidden"
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(90deg,#22c55e,#16a34a)",
          transition: "width .4s ease"
        }} />
      </div>
    </div>
  );
}
