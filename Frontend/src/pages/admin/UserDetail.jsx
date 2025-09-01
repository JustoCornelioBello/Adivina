// src/pages/admin/UserDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    setUser(users.find(u => String(u.id) === String(id)));
  }, [id]);

  if (!user) return <p>Usuario no encontrado</p>;

  const resetXP = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = users.map(u => u.id === user.id ? { ...u, xp: 0 } : u);
    localStorage.setItem("users", JSON.stringify(updated));
    setUser({ ...user, xp: 0 });
  };

  return (
    <div className="admin-user-detail">
      <h2>👤 Detalles de {user.username}</h2>
      <p><b>ID:</b> {user.id}</p>
      <p><b>XP:</b> {user.xp}</p>
      <p><b>Monedas:</b> {user.coins}</p>
      <p><b>Rol:</b> {user.role}</p>
      <p><b>Último login:</b> {user.lastLogin || "N/A"}</p>

      <button className="btn" onClick={resetXP}>♻️ Resetear XP</button>
      <button className="btn danger" onClick={() => navigate("/admin/users")}>⬅ Volver</button>
    </div>
  );
}
