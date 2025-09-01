import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { load, save } from "../../utils/storage";

const isEmail = (v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isUrl = (v)=>!v || /^(https?:\/\/|data:)/i.test(v);

export default function ProfileSettings(){
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [bio, setBio] = useState(load("profile_bio",""));
  const [country, setCountry] = useState(load("profile_country",""));
  const [theme, setTheme] = useState(load("ui_theme","light"));
  const [notify, setNotify] = useState(load("ui_notify", true));

  const onUploadAvatar = (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const rd = new FileReader(); rd.onload = ()=> setAvatarUrl(rd.result); rd.readAsDataURL(f);
  };

  const saveAll = ()=>{
    if (!username || username.length<3) return alert("Nombre mínimo 3 caracteres.");
    if (email && !isEmail(email)) return alert("Correo inválido.");
    if (!isUrl(avatarUrl)) return alert("URL de avatar inválida.");
    updateProfile({ username, email, avatarUrl });
    save("profile_bio", bio);
    save("profile_country", country);
    save("ui_theme", theme);
    save("ui_notify", !!notify);
    document.documentElement.dataset.theme = theme;
    alert("Ajustes guardados.");
  };

  return (
    <div className="config-section">
      <h4>Perfil</h4>
      <div className="two-col">
        <div><label>Nombre</label><input className="input" value={username} onChange={e=>setUsername(e.target.value)} /></div>
        <div><label>Correo</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      </div>

      <label>Avatar (URL)</label>
      <input className="input" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />
      <label className="file-uploader">Subir imagen<input type="file" accept="image/*" hidden onChange={onUploadAvatar} /></label>

      <label>Bio</label>
      <textarea className="input" rows={3} value={bio} onChange={e=>setBio(e.target.value)} />

      <div className="two-col">
        <div><label>País</label><input className="input" value={country} onChange={e=>setCountry(e.target.value)} /></div>
        <div>
          <label>Tema</label>
          <select className="input" value={theme} onChange={e=>setTheme(e.target.value)}>
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
      </div>

      <label className="checkbox">
        <input type="checkbox" checked={!!notify} onChange={e=>setNotify(e.target.checked)} />
        Notificaciones locales
      </label>

      <div className="actions-row" style={{justifyContent:"flex-start"}}>
        <button className="btn primary" onClick={saveAll}>Guardar</button>
      </div>
    </div>
  );
}
