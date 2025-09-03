import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaGamepad, FaStore, FaUser, FaCog, FaCalendar } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import { useLang } from "../contexts/LangContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { t } = useLang();

  return (
    <>
      {/* Backdrop para móviles */}
      <div
        className={`sidebar-backdrop ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="brand">
          Trivia <span className="brand-dot">•</span> Ventura
        </div>

        <nav className="nav-col">
  <NavLink to="/" end className="nav-item" onClick={onClose}>
    <FaHome className="nav-ico home-ico" /> {t("home")}
  </NavLink>
  <NavLink to="/game" className="nav-item" onClick={onClose}>
    <FaGamepad className="nav-ico game-ico" /> {t("game")}
  </NavLink>
  <NavLink to="/store" className="nav-item" onClick={onClose}>
    <FaStore className="nav-ico store-ico" /> {t("store")}
  </NavLink>
  <NavLink to="/profile" className="nav-item" onClick={onClose}>
    <FaUser className="nav-ico profile-ico" /> {t("profile")}
  </NavLink>
  <NavLink to="/missions" className="nav-item" onClick={onClose}>
    <FaCalendar className="nav-ico mission-ico" /> Misiones
  </NavLink>

  <div className="nav-divider">{t("settings")}</div>
  <NavLink to="/config" className="nav-item" onClick={onClose}>
    <FaCog className="nav-ico config-ico" /> {t("settings")}
  </NavLink>
</nav>


        <div className="sidebar-footer">
          <div className="muted">v1.0 • aprecien mi trabajo prietos</div>

          {user ? (
            <button className="btn outline small mt-1" onClick={logout}>
              {t("logout")}
            </button>
          ) : (
            <NavLink to="/login" className="btn small mt-1" onClick={onClose}>
              {t("account")}
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
