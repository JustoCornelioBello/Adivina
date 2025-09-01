import React, { useState } from "react";

export default function Support(){
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!title || !desc) return alert("Completa título y descripción.");
    const reports = JSON.parse(localStorage.getItem("support_reports") || "[]");
    reports.push({ id: crypto.randomUUID(), title, desc, createdAt: Date.now() });
    localStorage.setItem("support_reports", JSON.stringify(reports));
    setTitle(""); setDesc("");
    alert("Reporte guardado localmente. ¡Gracias!");
  };

  const mail = () => {
    const subject = encodeURIComponent("[Trivia] Reporte de problema");
    const body = encodeURIComponent(`Título: ${title}\n\nDescripción:\n${desc}\n\n`);
    window.location.href = `mailto:soporte@tujuego.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="config-section">
      <h4>Soporte</h4>
      <label>Título</label>
      <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
      <label>Descripción</label>
      <textarea className="input" rows={4} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="¿Qué ocurrió? ¿Cómo reproducirlo?" />
      <div className="actions-row" style={{justifyContent:"flex-start"}}>
        <button className="btn primary" onClick={submit}>Guardar reporte</button>
        <button className="btn outline" onClick={mail}>Enviar por correo</button>
      </div>
    </div>
  );
}
