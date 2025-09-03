import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";

export default function MyData() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [modal, setModal] = useState({ open: false, action: null, title: "", msg: "" });
  const [infoModal, setInfoModal] = useState({ open: false, msg: "" });

  // =========================
  // Abrir y cerrar modales
  // =========================
  const openModal = (action, title, msg) => {
    setModal({ open: true, action, title, msg });
  };
  const closeModal = () => setModal({ ...modal, open: false });

  // =========================
  // Descargar datos locales + Firestore
  // =========================
  const download = async () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      try {
        data[`local_${k}`] = JSON.parse(localStorage.getItem(k));
      } catch {
        data[`local_${k}`] = localStorage.getItem(k);
      }
    }

    if (user?.uid) {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) data["firebase_user"] = snap.data();
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trivia_datos.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // =========================
  // Resetear progreso
  // =========================
  const resetProgress = async () => {
    try {
      if (user?.uid) {
        await updateDoc(doc(db, "users", user.uid), { xp: 0, coins: 0, streak: 0 });
      }
      localStorage.clear();
      sessionStorage.clear();
      setInfoModal({ open: true, msg: "✅ Tu progreso fue reiniciado" });
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      console.error("Error al resetear:", err);
    }
  };

  // =========================
  // Borrar cuenta
  // =========================
  const deleteAcc = async () => {
    try {
      if (user?.uid) {
        // 1. Borrar Firestore
        await deleteDoc(doc(db, "users", user.uid));
        // 2. Borrar Auth
        await deleteUser(auth.currentUser);
      }
      localStorage.clear();
      sessionStorage.clear();
      logout();

      setInfoModal({ open: true, msg: "🗑️ Tu cuenta fue eliminada." });

      setTimeout(() => {
        setInfoModal({ open: false, msg: "" });
        nav("/login"); // 👈 redirige al login
      }, 2000);
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      setInfoModal({ open: true, msg: "❌ No se pudo eliminar la cuenta." });
    }
  };

  // =========================
  // Ejecutar confirmación
  // =========================
  const handleConfirm = async () => {
    if (modal.action === "reset") await resetProgress();
    if (modal.action === "delete") await deleteAcc();
    closeModal();
  };

  return (
    <div className="config-section">
      <h4>Mis datos</h4>
      <p className="muted">Exporta o gestiona tu información guardada en la app.</p>

      <div className="actions-row" style={{ justifyContent: "flex-start", gap: "1rem" }}>
        <button className="btn outline" onClick={download}>
          ⬇️ Descargar datos
        </button>
        <button
          className="btn warning"
          onClick={() =>
            openModal("reset", "Reiniciar progreso", "¿Seguro que quieres reiniciar todo tu progreso?")
          }
        >
          🔄 Reiniciar progreso
        </button>
        <button
          className="btn danger"
          onClick={() =>
            openModal("delete", "Eliminar cuenta", "Esto eliminará tu cuenta y progreso. ¿Deseas continuar?")
          }
          disabled={!user || user.isGuest}
        >
          🗑️ Borrar cuenta
        </button>
      </div>

      {/* Modal confirmación */}
      <ConfirmModal
        open={modal.open}
        title={modal.title}
        message={modal.msg}
        type={modal.action === "delete" ? "danger" : "warning"}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />

      {/* Modal informativo */}
      {infoModal.open && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{infoModal.msg}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
