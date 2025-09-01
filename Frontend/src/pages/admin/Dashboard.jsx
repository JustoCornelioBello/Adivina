import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // 👈 Asegúrate de tener configurado firebase.js
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalXP: 0,
    totalCoins: 0,
    activeToday: 0,
    users: []
  });

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  // 🔥 Obtener usuarios desde Firebase
  const fetchUsers = async () => {
    try {
      const querySnap = await getDocs(collection(db, "users"));
      let users = [];
      querySnap.forEach(doc => users.push({ id: doc.id, ...doc.data() }));

      // KPIs
      const totalXP = users.reduce((acc, u) => acc + (u.xp || 0), 0);
      const totalCoins = users.reduce((acc, u) => acc + (u.coins || 0), 0);
      const activeToday = users.filter(u =>
        u.lastLogin &&
        new Date(u.lastLogin).toDateString() === new Date().toDateString()
      ).length;

      setStats({ totalUsers: users.length, totalXP, totalCoins, activeToday, users });
    } catch (err) {
      console.error("Error cargando usuarios desde Firebase:", err);
    }
  };

  // 📊 Datos para los gráficos
  const xpData = stats.users.map(u => ({ name: u.username || "N/D", xp: u.xp || 0 }));
  const coinData = stats.users.map(u => ({ name: u.username || "N/D", coins: u.coins || 0 }));
  const streakData = stats.users.map(u => ({ name: u.username || "N/D", streak: u.streak || 0 }));

  const COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Panel de Administración</h1>

      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-card users"><h5>👥 Usuarios</h5><p>{stats.totalUsers}</p></div>
        <div className="kpi-card xp"><h5>⚡ XP Total</h5><p>{stats.totalXP}</p></div>
        <div className="kpi-card coins"><h5>🪙 Monedas</h5><p>{stats.totalCoins}</p></div>
        <div className="kpi-card active"><h5>🔥 Activos Hoy</h5><p>{stats.activeToday}</p></div>
      </div>

      {/* Charts fila 1 */}
      <div className="charts-row">
        <div className="chart-card">
          <h5>XP por Usuario</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/><YAxis/><Tooltip/>
              <Bar dataKey="xp" fill="#4e73df"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h5>Monedas por Usuario</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={coinData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/><YAxis/><Tooltip/>
              <Bar dataKey="coins" fill="#1cc88a"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts fila 2 */}
      <div className="charts-row">
        <div className="chart-card">
          <h5>🔥 Rachas</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={streakData} dataKey="streak" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {streakData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h5>📅 Actividad XP (Mock)</h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              {day:"Lun",xp:120},{day:"Mar",xp:200},{day:"Mié",xp:150},
              {day:"Jue",xp:300},{day:"Vie",xp:250},{day:"Sáb",xp:180},{day:"Dom",xp:100}
            ]}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="day"/><YAxis/><Tooltip/>
              <Line type="monotone" dataKey="xp" stroke="#e74a3b"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
