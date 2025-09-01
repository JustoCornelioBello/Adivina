import React from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaGift, FaStore, FaHeart, FaTrophy } from "react-icons/fa";

export default function Home() {
  return (
    <div className="card game-card white">
      <h2 className="mb-2">🎉 ¡Bienvenido a Trivia Pro!</h2>
      <p className="muted">
        Responde preguntas, gana XP y monedas, abre cofres misteriosos y consigue recompensas.
        Aquí tienes una guía rápida para empezar:
      </p>

      {/* Guía en pasos */}
      <div className="tutorial-grid">
        <div className="tutorial-step">
          <FaBolt className="icon yellow" />
          <h5>Responde Preguntas</h5>
          <p>Elige la respuesta correcta y gana <b>XP</b> ⚡ y <b>monedas</b> 🪙.</p>
        </div>

        <div className="tutorial-step">
          <FaHeart className="icon red" />
          <h5>Cuida tus Vidas</h5>
          <p>Tienes <b>5 corazones</b>. Pierdes uno al fallar y se recupera cada 15 min.</p>
        </div>

        <div className="tutorial-step">
          <FaGift className="icon green" />
          <h5>Abre Cofres</h5>
          <p>Cada <b>5 niveles</b> recibes un cofre con recompensas aleatorias.</p>
        </div>

        <div className="tutorial-step">
          <FaStore className="icon blue" />
          <h5>Visita la Tienda</h5>
          <p>Compra vidas, multiplicadores de XP ⚡x2/x3/x5, pistas 💡 y más.</p>
        </div>

        <div className="tutorial-step">
          <FaTrophy className="icon gold" />
          <h5>Progresa</h5>
          <p>Sube de nivel, mejora tu racha 🔥 y demuestra quién manda en Trivia Pro.</p>
        </div>
      </div>

      {/* Botones principales */}
      <div className="actions-row mt-3">
        <Link to="/game" className="btn primary">🚀 Comenzar</Link>
        <Link to="/store" className="btn outline">🛒 Ir a la Tienda</Link>
      </div>
    </div>
  );
}
