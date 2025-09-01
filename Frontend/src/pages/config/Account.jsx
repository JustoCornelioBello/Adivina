import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { load, save } from "../../utils/storage";

const CODE_PREFIX = "pwd_reset_code:"; // por email

export default function Account(){
  const { user, updateProfile } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  // Restablecer por código (demo)
  const [emailReset, setEmailReset] = useState(user?.email || "");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");

  const changePassword = () => {
    if (!user) return alert("Inicia sesión.");
    if (user.isGuest) return alert("Los invitados no tienen contraseña.");
    if (next.length < 6) return alert("La contraseña nueva debe tener al menos 6 caracteres.");
    if (next !== confirm) return alert("Las contraseñas no coinciden.");
    if (current !== user.password) return alert("Contraseña actual incorrecta.");
    updateProfile({ password: next });
    setCurrent(""); setNext(""); setConfirm("");
    alert("Contraseña actualizada.");
  };

  const sendResetCode = () => {
    if (!emailReset) return alert("Ingresa tu correo.");
    // genera código 6 dígitos
    const code = String(Math.floor(100000 + Math.random()*900000));
    save(CODE_PREFIX + emailReset, { code, createdAt: Date.now() });
    setCodeSent(true);
    alert(`Código enviado (demo): ${code}`);
  };

  const applyResetByCode = () => {
    if (!emailReset || !code || newPass.length < 6) return alert("Completa todos los campos.");
    const rec = load(CODE_PREFIX + emailReset, null);
    if (!rec || rec.code !== code) return alert("Código inválido.");
    // expira a los 15 min
    if (Date.now() - rec.createdAt > 15 * 60 * 1000) return alert("Código expirado.");
    // actualiza en DB
    const db = load("game_users_db", []);
    const idx = db.findIndex(u => u.email === emailReset);
    if (idx < 0) return alert("Correo no registrado.");
    db[idx] = { ...db[idx], password: newPass };
    save("game_users_db", db);
    if (user && user.email === emailReset) {
      updateProfile({ password: newPass });
    }
    alert("Contraseña restablecida.");
    setCode(""); setNewPass("");
  };

  return (
    <div className="config-section">
      <h4>Cuenta y seguridad</h4>
      <div className="two-col">
        <div>
          <label>Contraseña actual</label>
          <input className="input" type="password" value={current} onChange={e=>setCurrent(e.target.value)} />
        </div>
        <div>
          <label>Nueva contraseña</label>
          <input className="input" type="password" value={next} onChange={e=>setNext(e.target.value)} />
        </div>
      </div>
      <label>Confirmar nueva contraseña</label>
      <input className="input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
      <button className="btn primary mt-1" onClick={changePassword}>Actualizar</button>

      <hr style={{margin:"14px 0", border:"none", borderTop:"1px solid var(--line)"}} />

      <h4>Restablecer contraseña (código)</h4>
      <label>Correo</label>
      <input className="input" type="email" value={emailReset} onChange={e=>setEmailReset(e.target.value)} />
      <div className="actions-row" style={{justifyContent:"flex-start"}}>
        <button className="btn outline" onClick={sendResetCode}>{codeSent ? "Reenviar código" : "Enviar código"}</button>
      </div>
      <div className="two-col">
        <div>
          <label>Código</label>
          <input className="input" value={code} onChange={e=>setCode(e.target.value)} />
        </div>
        <div>
          <label>Nueva contraseña</label>
          <input className="input" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} />
        </div>
      </div>
      <button className="btn primary" onClick={applyResetByCode}>Restablecer</button>
    </div>
  );
}
