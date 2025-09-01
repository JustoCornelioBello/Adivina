// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const minLen = (v, n) => (v?.length || 0) >= n;

export default function Login() {
  const { login, register, loginAsGuest } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (mode === "register" && !minLen(form.username, 3)) {
      e.username = "El nombre debe tener mínimo 3 caracteres.";
    }
    if (!isEmail(form.email)) {
      e.email = "Correo inválido.";
    }
    if (!minLen(form.password, 6)) {
      e.password = "La contraseña debe tener mínimo 6 caracteres.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    let r;
    if (mode === "login") {
      r = await login(form.email, form.password);
    } else {
      r = await register(form.username, form.email, form.password);
    }

    setLoading(false);

    if (!r.ok) {
      toast.error(r.msg || "Error al procesar la solicitud 🚫");
      return;
    }

    toast.success(
      mode === "login"
        ? "¡Bienvenido de nuevo! 🎉"
        : "Cuenta creada exitosamente 🚀"
    );
    nav("/profile");
  };

  return (
    <div
      className="card game-card white"
      style={{
        maxWidth: 520,
        margin: "40px auto",
        padding: "2rem",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        background: "#fff",
      }}
    >
      <h2 className="mb-3 text-center">
        {mode === "login" ? "🔑 Iniciar sesión" : "🆕 Crear cuenta"}
      </h2>
      <p className="muted text-center mb-4">
        Puedes jugar como invitado (no se guarda tu progreso permanente).
      </p>

      <form onSubmit={onSubmit} className="login-form">
        {mode === "register" && (
          <>
            <label>Nombre de usuario</label>
            <input
              className="input"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Ej: Justo"
            />
            {errors.username && (
              <small className="error-text text-danger">
                {errors.username}
              </small>
            )}
          </>
        )}

        <label>Correo</label>
        <input
          className="input"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="ejemplo@correo.com"
        />
        {errors.email && (
          <small className="error-text text-danger">{errors.email}</small>
        )}

        <label>Contraseña</label>
        <input
          className="input"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••"
        />
        {errors.password && (
          <small className="error-text text-danger">{errors.password}</small>
        )}

        {errors.form && (
          <div className="error-box text-danger text-center mt-2">
            {errors.form}
          </div>
        )}

        <button
          className="btn primary w-100 mt-3"
          type="submit"
          disabled={loading}
        >
          {loading
            ? mode === "login"
              ? "Entrando..."
              : "Creando..."
            : mode === "login"
            ? "Entrar"
            : "Registrarme"}
        </button>
      </form>

      {/* Cambiar modo */}
      <div className="switch-auth mt-4 text-center">
        {mode === "login" ? (
          <>
            <button
              className="btn outline w-100 mb-2"
              onClick={() => setMode("register")}
            >
              Crear cuenta
            </button>
            <button
              className="btn outline w-100"
              onClick={() => {
                loginAsGuest();
                nav("/game");
              }}
            >
              🎮 Jugar como invitado
            </button>
          </>
        ) : (
          <button
            className="btn outline w-100"
            onClick={() => setMode("login")}
          >
            Ya tengo cuenta
          </button>
        )}
      </div>
    </div>
  );
}
