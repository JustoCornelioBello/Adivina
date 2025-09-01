import React from "react";
import { useAuth } from "../../auth/AuthContext";

export default function MyData(){
  const { user, deleteAccount } = useAuth();

  const download = () => {
    const data = {};
    for (let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      try { data[k] = JSON.parse(localStorage.getItem(k)); }
      catch { data[k] = localStorage.getItem(k); }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "trivia_datos.json"; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (!window.confirm("¿Seguro que deseas reiniciar TODO tu progreso?")) return;
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
    window.location.href = "/";
  };

  const deleteAcc = () => {
    if (!user || user.isGuest) return alert("No hay cuenta registrada para borrar.");
    if (!window.confirm("Esto borrará tu cuenta local y progreso. ¿Continuar?")) return;
    const r = deleteAccount();
    if (!r.ok) return alert(r.msg || "No se pudo borrar la cuenta.");
    try { localStorage.clear(); } catch {}
    window.location.href = "/";
  };

  return (
    <div className="config-section">
      <h4>Mis datos</h4>
      <p className="muted">Exporta o elimina tu información guardada localmente.</p>
      <div className="actions-row" style={{justifyContent:"flex-start"}}>
        <button className="btn outline" onClick={download}>Descargar datos</button>
        <button className="btn danger" onClick={reset}>Reiniciar progreso</button>
        <button className="btn danger" onClick={deleteAcc} disabled={!user || user.isGuest}>Borrar cuenta</button>
      </div>
    </div>
  );
}
