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
    <div className="d-flex flex-column flex-md-row admin-layout">
      {/* Sidebar */}
      <div className="sidebar bg-light p-3">
        <h3 className="logo">⚙️ Admin</h3>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <Link className="nav-link d-flex align-items-center" to={item.path}>
                {item.icon}
                <span className="ms-2">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button className="btn btn-danger logout-btn mt-3" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Salir</span>
        </button>
      </div>
      {/* Content */}
      <div className="content flex-fill p-3">
        <Outlet />
      </div>
    </div>
  );
}