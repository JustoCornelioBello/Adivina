// src/pages/admin/UserReports.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import "./admin.css";

export default function UserReports() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userData, setUserData] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const fetchUserData = async (id) => {
    const snap = await getDoc(doc(db, "users", id));
    if (snap.exists()) {
      setUserData({ id: snap.id, ...snap.data() });
      // 🔹 Simulación de reportes, podrías traerlos de otra colección
      setReports([
        { id: 1, reason: "Lenguaje inapropiado en el chat", date: "2025-08-01" },
        { id: 2, reason: "Desconexiones sospechosas", date: "2025-08-15" },
      ]);
    }
  };

  const suspendUser = async (id) => {
    await updateDoc(doc(db, "users", id), { status: "suspended" });
    alert(`🚫 Usuario ${id} suspendido`);
    fetchUserData(id);
  };

  const resetProgress = async (id) => {
    await updateDoc(doc(db, "users", id), { xp: 0, coins: 0, streak: 0 });
    alert(`🔄 Progreso del usuario ${id} reiniciado`);
    fetchUserData(id);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("⚠️ Esto eliminará TODOS los datos del usuario. ¿Seguro?")) return;
    await deleteDoc(doc(db, "users", id));
    alert(`❌ Usuario ${id} eliminado permanentemente`);
    setUsers(users.filter((u) => u.id !== id));
    setSelected(null);
    setUserData(null);
  };

  const downloadUserData = () => {
    if (!userData) return;
    const blob = new Blob([JSON.stringify(userData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user_${userData.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card fade-in">
      <h2>🚨 Reportes y Control de Usuarios</h2>
      <p className="muted">
        Gestiona usuarios problemáticos, revisa reportes y toma acciones críticas.
      </p>

      {/* Selector de usuario */}
      <select
        className="user-select"
        onChange={(e) => {
          setSelected(e.target.value);
          fetchUserData(e.target.value);
        }}
        value={selected || ""}
      >
        <option value="">Selecciona un usuario...</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username || "Sin nombre"} ({u.id})
          </option>
        ))}
      </select>

      {/* Datos del usuario */}
      {userData && (
        <div className="user-details">
          <h3>📊 Datos del usuario</h3>
          <ul>
            <li><b>ID:</b> {userData.id}</li>
            <li><b>Usuario:</b> {userData.username || "N/D"}</li>
            <li><b>Rol:</b> {userData.role || "jugador"}</li>
            <li><b>Estado:</b> {userData.status || "activo"} </li>
            <li><b>XP:</b> {userData.xp || 0}</li>
            <li><b>Monedas:</b> {userData.coins || 0} 🪙</li>
            <li><b>Racha:</b> {userData.streak || 0} 🔥</li>
            <li>
              <b>Último acceso:</b>{" "}
              {userData.lastLogin
                ? new Date(userData.lastLogin.seconds * 1000).toLocaleString()
                : "N/D"}
            </li>
          </ul>

          <button className="btn outline" onClick={downloadUserData}>
            ⬇️ Descargar datos
          </button>
        </div>
      )}

      {/* Historial de reportes */}
      {reports.length > 0 && (
        <div className="reports-section">
          <h3>📑 Historial de Reportes</h3>
          <ul className="reports-list">
            {reports.map((r) => (
              <li key={r.id}>
                <b>{r.date}:</b> {r.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Zona roja crítica */}
      {selected && (
        <div className="red-zone fade-in">
          <h3>⚠️ Acciones críticas</h3>
          <p>Estas acciones son irreversibles. Úsalas solo en casos justificados.</p>
          <div className="actions-row">
            <button className="btn warning" onClick={() => suspendUser(selected)}>
              🚫 Suspender cuenta
            </button>
            <button className="btn primary" onClick={() => resetProgress(selected)}>
              🔄 Reiniciar progreso
            </button>
            <button className="btn danger" onClick={() => deleteUser(selected)}>
              ❌ Eliminar usuario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
