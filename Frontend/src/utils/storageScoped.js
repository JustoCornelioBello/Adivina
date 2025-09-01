import { load, save } from "./storage";
import { KEYS } from "./storage";

/** Lee/escribe en sessionStorage si es invitado; en localStorage si es usuario normal */
export const scopedLoad = (user, key, fallback) => {
  try {
    if (user?.isGuest) {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }
    return load(key, fallback);
  } catch { return fallback; }
};

export const scopedSave = (user, key, value) => {
  try {
    if (user?.isGuest) sessionStorage.setItem(key, JSON.stringify(value));
    else save(key, value);
  } catch {}
};

export { KEYS };
