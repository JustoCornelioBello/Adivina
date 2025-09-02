import React from "react";

export default function Terms() {
  const APP_NAME = "Triviaventura"; 
  const CONTACT_EMAIL = "soporte@tujuego.com"; 
  const JURISDICTION = "República Dominicana"; 
  const LAST_UPDATE = "2025-08-30"; 
  const VERSION = "v1.2";

  return (
    <div className="terms-container">
      <div className="terms-card">
        <h2 className="terms-title">Términos y Condiciones</h2>
        <p className="terms-subtitle">
          Última actualización: {LAST_UPDATE} · {VERSION}
        </p>

        <div className="terms-list">
          <h4>1) Aceptación de los términos</h4>
          <p>
            Al acceder o utilizar <strong>{APP_NAME}</strong> (“el Juego”), aceptas
            estos Términos y Condiciones. Si no estás de acuerdo, por favor no
            utilices el Juego.
          </p>

          <h4>2) Elegibilidad</h4>
          <ul>
            <li>Debes tener al menos 13 años para usar el Juego.</li>
            <li>
              Si tienes entre 13 y 18 años, confirmas que cuentas con el
              consentimiento de tu madre/padre o tutor legal.
            </li>
          </ul>

          <h4>3) Licencia de uso</h4>
          <p>
            Te otorgamos una licencia limitada, no exclusiva e intransferible
            para acceder y usar el Juego con fines{" "}
            <strong>educativos y de entretenimiento</strong>. No puedes vender,
            sublicenciar o modificar el Juego salvo autorización expresa.
          </p>

          <h4>4) Datos, privacidad y almacenamiento local</h4>
          <ul>
            <li>
              <strong>Almacenamiento local:</strong> tu progreso se guarda en{" "}
              <code>localStorage</code>, sin enviarse a servidores externos.
            </li>
            <li>
              <strong>Datos personales:</strong> no pedimos información sensible.
              Si nos escribes, solo usaremos tu correo para responder.
            </li>
            <li>
              <strong>Cookies/analítica:</strong> actualmente no usamos
              analítica externa. Si cambia, te lo informaremos.
            </li>
          </ul>

          <h4>5) Contenido del juego</h4>
          <p>
            Las preguntas pueden contener información general, educativa y de
            cultura. Puede haber errores u omisiones, y nos reservamos el derecho
            de actualizar el contenido en cualquier momento.
          </p>

          <h4>6) Reglas de conducta</h4>
          <ul>
            <li>No manipular puntuaciones ni usar exploits.</li>
            <li>No intentar ingeniería inversa o extracción de datos.</li>
            <li>No usar bots ni automatizaciones que den ventaja injusta.</li>
          </ul>

          <h4>7) Propiedad intelectual</h4>
          <p>
            {APP_NAME}, su diseño, logotipos y código son de nuestra propiedad o
            de sus titulares. El uso no implica transferencia de derechos.
          </p>

          <h4>8) Progresión y recompensas</h4>
          <p>
            Los logros, puntos y recompensas no tienen valor monetario y pueden
            ser modificados por balance del Juego.
          </p>

          <h4>9) Disponibilidad</h4>
          <p>
            El Juego se ofrece “tal cual” y no garantizamos disponibilidad
            ininterrumpida.
          </p>

          <h4>10) Actualizaciones</h4>
          <p>
            Estos términos pueden cambiar. El uso continuado implica aceptación
            de las modificaciones.
          </p>

          <h4>11) Responsabilidad</h4>
          <p>
            No nos hacemos responsables por daños indirectos derivados del uso o
            mal uso del Juego.
          </p>

          <h4>12) Soporte y contacto</h4>
          <p>
            Para dudas:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <h4>13) Ley aplicable</h4>
          <p>
            Estos términos se rigen por las leyes de {JURISDICTION}. Cualquier
            disputa será resuelta por los tribunales competentes.
          </p>

          <h4>14) Aviso importante</h4>
          <p className="muted">
            Este documento tiene fines informativos y no constituye asesoría
            legal. Consulta con un profesional si necesitas certeza jurídica.
          </p>
        </div>
      </div>

      <style jsx>{`
        .terms-container {
          max-width: 850px;
          margin: 40px auto;
          padding: 20px;
        }

        .terms-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          line-height: 1.7;
        }

        .terms-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 8px;
          color: #222;
        }

        .terms-subtitle {
          font-size: 0.95rem;
          color: #666;
          margin-bottom: 25px;
        }

        .terms-list h4 {
          font-size: 1.15rem;
          color: #333;
          margin: 24px 0 8px;
        }

        .terms-list p,
        .terms-list li {
          color: #444;
          font-size: 0.97rem;
        }

        .terms-list ul {
          padding-left: 20px;
          margin: 8px 0 16px;
        }

        .terms-list li {
          margin-bottom: 6px;
        }

        .terms-list code {
          background: #f3f4f6;
          padding: 2px 5px;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .muted {
          color: #777;
          font-style: italic;
        }

        a {
          color: #2563eb;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
