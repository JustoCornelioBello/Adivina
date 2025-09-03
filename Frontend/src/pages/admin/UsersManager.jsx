import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import axios from "axios";
import "./admin.css";

const API_URL = "http://localhost:8000"; // backend FastAPI

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [suspended, setSuspended] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setUsers(data.filter((u) => u.status !== "suspended"));
    setSuspended(data.filter((u) => u.status === "suspended"));
  };

  const changeRole = async (id, role) => {
    await updateDoc(doc(db, "users", id), { role });
    fetchUsers();
  };

  const suspendUser = async (id) => {
    await updateDoc(doc(db, "users", id), { status: "suspended" });
    fetchUsers();
  };

  const unsuspendUser = async (id) => {
    await updateDoc(doc(db, "users", id), { status: "active" });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("⚠️ Esto eliminará la cuenta permanentemente.")) return;
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  const notifyUser = async (id) => {
    const title = prompt("Título de la notificación:");
    const message = prompt("Mensaje:");
    if (!title || !message) return;
    await axios.post(`${API_URL}/users/${id}/notify`, {
      title,
      message,
      level: "info",
    });
    alert("📨 Notificación enviada");
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(filter.toLowerCase()) ||
      u.id.includes(filter)
  );

  return (
    <div className="card users-manager">
      <h3>👥 Gestión de Usuarios</h3>
      <input
        className="input"
        placeholder="Buscar usuario por nombre o ID..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {/* Usuarios activos */}
      <h4>Usuarios Activos</h4>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>XP</th>
            <th>Monedas</th>
            <th>Racha</th>
            <th>Último login</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>
                <span className={`role-badge ${u.role}`}>{u.role}</span>
                <select
                  value={u.role || "jugador"}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option value="jugador">Jugador</option>
                  <option value="moderador">Moderador</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>{u.xp || 0}</td>
              <td>{u.coins || 0}</td>
              <td>{u.streak || 0} 🔥</td>
              <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "N/D"}</td>
              <td>
                <button className="btn" onClick={() => notifyUser(u.id)}>📩 Notificar</button>
                <button className="btn warn" onClick={() => suspendUser(u.id)}>🚫 Suspender</button>
                <button className="btn danger" onClick={() => deleteUser(u.id)}>❌ Eliminar</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="8">No hay usuarios activos</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Usuarios suspendidos */}
      <h4>Usuarios Suspendidos</h4>
      <table className="admin-table suspended">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suspended.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
              <td>
                <button className="btn success" onClick={() => unsuspendUser(u.id)}>✅ Rehabilitar</button>
                <button className="btn danger" onClick={() => deleteUser(u.id)}>❌ Eliminar</button>
              </td>
            </tr>
          ))}
          {suspended.length === 0 && (
            <tr>
              <td colSpan="4">No hay usuarios suspendidos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
