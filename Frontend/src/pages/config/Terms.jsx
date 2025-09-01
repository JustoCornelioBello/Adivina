import React from "react";

export default function Terms() {
  return (
    <div className="card game-card white">
      <h2 className="mb-2">Términos y Condiciones</h2>
      <p className="muted">Última actualización: 2025-08-30</p>
      <div className="terms-list">
        <h4>1. Uso del servicio</h4>
        <p>Este juego es para fines educativos y de entretenimiento. No hay garantías de disponibilidad.</p>
        <h4>2. Datos del usuario</h4>
        <p>Los datos se almacenan localmente en tu navegador (localStorage). No se envían a servidores externos.</p>
        <h4>3. Contenido</h4>
        <p>Las preguntas pueden contener información general. No nos hacemos responsables por errores u omisiones.</p>
        <h4>4. Reglas de conducta</h4>
        <p>Prohibido cualquier uso que intente vulnerar la aplicación o manipular la puntuación de forma fraudulenta.</p>
        <h4>5. Cambios</h4>
        <p>Estos términos pueden cambiar. El uso continuado implica aceptación.</p>
      </div>
    </div>
  );
}
