import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserPlus, FaTrash, FaEdit, FaUserShield, FaSearch } from "react-icons/fa";
import "./Users.css";

const API_URL = "http://localhost:8000"; // backend FastAPI

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", role: "jugador" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username.trim()) return;
    try {
      await axios.post(`${API_URL}/users`, newUser);
      setNewUser({ username: "", role: "jugador" });
      fetchUsers();
    } catch (err) {
      console.error("Error al agregar usuario:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search)
  );

  return (
    <div className="users-container">
      <h2 className="title-users">👥 Gestión de Usuarios</h2>

      {/* 🔍 Barra de búsqueda */}
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por ID o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ➕ Formulario para nuevo usuario */}
      <div className="card user-form">
        <h3><FaUserPlus /> Agregar Nuevo Usuario</h3>
        <form className="form-grid" onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="jugador">Jugador</option>
            <option value="moderador">Moderador</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" className="btn-add">
            <FaUserPlus /> Agregar
          </button>
        </form>
      </div>

      {/* 📋 Tabla de usuarios */}
      <div className="card user-table">
        <h3><FaUserShield /> Lista de Usuarios</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>XP</th>
                <th>Monedas</th>
                <th>Racha</th>
                <th>Último acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>{u.xp || 0}</td>
                    <td>{u.coins || 0}</td>
                    <td>{u.streak || 0} 🔥</td>
                    <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "N/D"}</td>
                    <td>
                      <Link to={`/admin/users/${u.id}`} className="btn-edit">
                        <FaEdit /> Editar
                      </Link>
                      <button className="btn-delete" onClick={() => handleDelete(u.id)}>
                        <FaTrash /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">No hay usuarios registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
