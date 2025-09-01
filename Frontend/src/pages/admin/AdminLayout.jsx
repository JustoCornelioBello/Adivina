// src/pages/admin/AdminLayout.jsx
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();



  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/users", label: "Usuarios", icon: <FaUsers /> },
    { path: "/admin/reports", label: "Reportes", icon: <FaFileAlt /> },
    { path: "/admin/settings", label: "Configuración", icon: <FaCog /> },
    
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="logo">⚙️ Admin</h3>
        <ul className="menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Salir</span>
        </button>
      </div>

      {/* Contenido */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
