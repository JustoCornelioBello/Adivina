// src/pages/admin/Reports.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaFileCsv, FaFileCode, FaGlobe } from "react-icons/fa";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./Reports.css";

export default function Reports() {
  const [report, setReport] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setReport(users);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = report.filter((r) =>
    r.username?.toLowerCase().includes(filter.toLowerCase())
  );

  // Export CSV
  const exportCSV = () => {
    const headers = ["Usuario", "XP", "Monedas", "Racha"];
    const rows = filtered.map((r) => [r.username, r.xp || 0, r.coins || 0, r.streak || 0]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reportes.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reportes.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // Export HTML
  const exportHTML = () => {
    const html = `
      <html>
        <head><title>Reporte Usuarios</title></head>
        <body>
          <h2>Reporte de Usuarios</h2>
          <table border="1" cellspacing="0" cellpadding="5">
            <tr><th>Usuario</th><th>XP</th><th>Monedas</th><th>Racha</th></tr>
            ${filtered.map(r => `
              <tr>
                <td>${r.username}</td>
                <td>${r.xp || 0}</td>
                <td>${r.coins || 0}</td>
                <td>${r.streak || 0} 🔥</td>
              </tr>
            `).join("")}
          </table>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reportes.html"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <h2>Reportes de Usuarios</h2>
        <div className="search-box">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Export buttons */}
      <div className="export-buttons">
        <button onClick={exportCSV}><FaFileCsv /> CSV</button>
        <button onClick={exportJSON}><FaFileCode /> JSON</button>
        <button onClick={exportHTML}><FaGlobe /> HTML</button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">Cargando reportes...</div>
      ) : (
        <div className="table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>XP</th>
                <th>Monedas</th>
                <th>Racha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r, i) => (
                  <tr key={i}>
                    <td>{r.username}</td>
                    <td>{r.xp || 0}</td>
                    <td>{r.coins || 0}</td>
                    <td>{r.streak || 0} 🔥</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No se encontraron usuarios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
