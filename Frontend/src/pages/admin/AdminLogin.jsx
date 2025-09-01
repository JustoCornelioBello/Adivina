// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const MASTER_KEY = "admin123"; // 🔑 clave única
    if (password === MASTER_KEY) {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("❌ Contraseña incorrecta");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">🔐 Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la clave"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
}
