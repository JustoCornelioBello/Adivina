import React from "react";
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaGift,
  FaStore,
  FaHeart,
  FaTrophy,
  FaCrown,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="home-container">
      {/* HERO */}
      <header className="hero">
        <h1 className="hero-title">🎉 ¡Bienvenido a <span>Triviaventura</span>!</h1>
        <p className="hero-subtitle">
          Demuestra tu conocimiento, gana recompensas y escala en el ranking.
        </p>
      </header>

      {/* SECCIÓN: Guía */}
      <section className="tutorial-grid">
        <div className="tutorial-step">
          <FaBolt className="icon yellow" />
          <h5>Responde Preguntas</h5>
          <p>
            Elige la respuesta correcta y gana <b>XP</b> ⚡ y <b>monedas</b> 🪙
            en cada partida.
          </p>
        </div>

        <div className="tutorial-step">
          <FaHeart className="icon red" />
          <h5>Cuida tus Vidas</h5>
          <p>
            Empiezas con <b>5 corazones</b>. Pierdes uno al fallar y se recupera
            cada <b>15 min</b>.
          </p>
        </div>

        <div className="tutorial-step">
          <FaGift className="icon green" />
          <h5>Abre Cofres</h5>
          <p>
            Cada <b>5 niveles</b> recibes un cofre con recompensas únicas:
            monedas, vidas, multiplicadores.
          </p>
        </div>

        <div className="tutorial-step">
          <FaStore className="icon blue" />
          <h5>Visita la Tienda</h5>
          <p>
            Compra vidas extras, boosters de XP ⚡x2/x3/x5, pistas 💡 y skins
            exclusivos.
          </p>
        </div>

        <div className="tutorial-step">
          <FaTrophy className="icon gold" />
          <h5>Progresa</h5>
          <p>
            Mejora tu racha 🔥, sube de nivel y demuestra quién manda en Trivia
            Pro.
          </p>
        </div>
      </section>

      {/* SECCIÓN: Extras */}
      <section className="extras-grid">
        <div className="extra-card">
          <FaCrown className="icon purple" />
          <h5>Logros</h5>
          <p>
            Desbloquea insignias exclusivas al superar retos especiales y
            presume tu perfil.
          </p>
        </div>

        <div className="extra-card">
          <FaCalendarAlt className="icon orange" />
          <h5>Misiones Diarias</h5>
          <p>
            Completa retos diarios y gana recompensas adicionales cada día que
            juegues.
          </p>
        </div>

        <div className="extra-card">
          <FaUsers className="icon teal" />
          <h5>Ranking Global</h5>
          <p>
            Compite contra otros jugadores y sube posiciones en la clasificación
            mundial 🌍.
            (Proximamente)
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="actions-row mt-4">
        <Link to="/game" className="btn primary">
          🚀 ¡Comenzar Ahora!
        </Link>
        <Link to="/store" className="btn outline">
          🛒 Explorar la Tienda
        </Link>
      </div>
    </div>
  );
}
