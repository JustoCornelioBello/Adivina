import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import CurrencyBar from "../components/CurrencyBar";

export default function Layout({ coins, diamonds, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main-area">
        <div className="topbar">
          <button
            className="hamburger"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <CurrencyBar coins={coins} diamonds={diamonds} />
        </div>
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
}
