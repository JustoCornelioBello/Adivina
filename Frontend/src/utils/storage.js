// Helpers seguros para localStorage (JSON)
export const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// Claves
export const KEYS = {
  XP: "game_xp",
  COINS: "game_coins",
  DIAMONDS: "game_diamonds",
  LIVES: "game_lives",                // <- ahora es array de timestamps/null
  NEXT_LIFE_AT: "game_next_life_at",  // legacy (global), lo limpiamos en migración
  HINTS: "game_hints",
  STREAK: "game_streak",
  SCORE: "game_score",
  CURRENT_Q: "game_current_index",
  MULTIPLIER: "game_xp_multiplier",   // {value, expiresAt}
  INVENTORY: "game_inventory",
  SCHEMA: "game_schema_version",      // para futuras migraciones
  MISSIONS_DAILY: "missions_daily",
  MISSIONS_WEEKLY: "missions_weekly",
};

const SCHEMA_VERSION = 2; // 1: vidas=numero | 2: vidas=array

/** Normaliza cualquier valor a un array de "max" elementos (null=tiene vida, number=timestamp de regreso) */
export const normalizeLives = (val, max = 5) => {
  if (Array.isArray(val)) {
    // recorta o completa
    const arr = val.slice(0, max);
    while (arr.length < max) arr.push(null);
    // coerciona cada celda a null|number
    return arr.map(v => (typeof v === "number" ? v : null));
  }
  if (typeof val === "number") {
    // esquema viejo: val = #vidas disponibles
    const n = Math.max(0, Math.min(max, val));
    const arr = Array(max).fill(null);
    // si val<max, las “faltantes” también irán como null (no penalizamos)
    // si prefieres respetar cooldown viejo global, podrías mirar KEYS.NEXT_LIFE_AT aquí
    return arr.map((_, i) => (i < n ? null : null));
  }
  // sin datos previos → full vidas
  return Array(max).fill(null);
};

/** Migración: vidas número → array; limpia NEXT_LIFE_AT legacy. */
export const migrateLivesSchema = (max = 5) => {
  const schema = load(KEYS.SCHEMA, 1);
  if (schema >= SCHEMA_VERSION) return;

  const oldLives = load(KEYS.LIVES, null);
  const newLives = normalizeLives(oldLives, max);
  save(KEYS.LIVES, newLives);

  // limpiamos el cooldown global legacy
  save(KEYS.NEXT_LIFE_AT, null);

  save(KEYS.SCHEMA, SCHEMA_VERSION);
};

/** Inicializa vidas asegurando array correcto y aplicando migración si hace falta. */
export const initLives = (max = 5) => {
  migrateLivesSchema(max);
  const lives = load(KEYS.LIVES, null);
  const norm = normalizeLives(lives, max);
  save(KEYS.LIVES, norm);
  return norm;
};

/** Pierde 1 vida: marca el primer slot libre con timestamp de recuperación. */
export const loseLife = (lives, cooldownMs = 15 * 60 * 1000, max = 5) => {
  const arr = normalizeLives(lives, max);
  const idx = arr.findIndex(l => l === null);
  if (idx === -1) return arr; // no hay libres
  const newArr = [...arr];
  newArr[idx] = Date.now() + cooldownMs;
  save(KEYS.LIVES, newArr);
  return newArr;
};

/** Restaura automáticamente vidas cuyo timestamp ya venció. */
export const restoreExpiredLives = (lives, max = 5) => {
  const arr = normalizeLives(lives, max);
  const now = Date.now();
  const newArr = arr.map(l => (typeof l === "number" && l <= now ? null : l));
  save(KEYS.LIVES, newArr);
  return newArr;
};

/** Devuelve cuántas vidas disponibles hay (null = disponible). */
export const countAvailableLives = (lives, max = 5) =>
  normalizeLives(lives, max).filter(l => l === null).length;

/** Devuelve el tiempo restante (ms) de la próxima vida que se va a restaurar (o 0 si no hay cooldowns). */
export const nextLifeRemainingMs = (lives, max = 5) => {
  const arr = normalizeLives(lives, max);
  const pending = arr.filter(l => typeof l === "number");
  if (!pending.length) return 0;
  const minTs = Math.min(...pending);
  return Math.max(0, minTs - Date.now());
};
