// src/pages/admin/Stats.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./admin.css";

export default function Stats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoins: 0,
    totalXP: 0,
    admins: 0,
    mods: 0,
    players: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const snap = await getDocs(collection(db, "users"));
      let totalCoins = 0;
      let totalXP = 0;
      let admins = 0,
        mods = 0,
        players = 0;
      snap.forEach((doc) => {
        const d = doc.data();
        totalCoins += d.coins || 0;
        totalXP += d.xp || 0;
        if (d.role === "admin") admins++;
        else if (d.role === "moderador") mods++;
        else players++;
      });
      setStats({
        totalUsers: snap.size,
        totalCoins,
        totalXP,
        admins,
        mods,
        players,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="card">
      <h3>📊 Estadísticas Generales</h3>
      <div className="stats-grid">
        <div className="stat-card">
          👥 <b>{stats.totalUsers}</b> Usuarios
        </div>
        <div className="stat-card">
          💰 <b>{stats.totalCoins}</b> Monedas
        </div>
        <div className="stat-card">
          ⚡ <b>{stats.totalXP}</b> XP Total
        </div>
        <div className="stat-card">
          🛡️ <b>{stats.admins}</b> Admins
        </div>
        <div className="stat-card">
          🎯 <b>{stats.mods}</b> Moderadores
        </div>
        <div className="stat-card">
          🎮 <b>{stats.players}</b> Jugadores
        </div>
      </div>
    </div>
  );
}
