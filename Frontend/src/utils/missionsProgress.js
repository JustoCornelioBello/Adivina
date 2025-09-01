import { scopedLoad, scopedSave, KEYS } from "./storageScoped";

/**
 * Actualiza progreso de misiones (diarias y semanales)
 * @param {object} user - usuario actual
 * @param {object} options - { type, amount, extra }
 */
export function updateMissionsProgress(
  user,
  { type, amount = 1, extra = {} } = {}
) {
  if (!type) return;

  const daily = scopedLoad(user, KEYS.MISSIONS_DAILY, null);
  const weekly = scopedLoad(user, KEYS.MISSIONS_WEEKLY, null);

  console.log("🔄 updateMissionsProgress", { type, amount, extra });
  console.log("📂 Daily before:", daily);
  console.log("📂 Weekly before:", weekly);

  const update = (missions, key) => {
    if (!missions) return null;

    let changed = false;
    missions.missions = missions.missions.map((m) => {
      let newProgress = m.progress;

      switch (true) {
  // Misiones de responder preguntas
  case ["d1", "d2", "w1", "w2"].includes(m.id) && type === "answered":
    newProgress += amount;
    changed = true;
    break;

  // Usar pista
  case m.id === "d3" && type === "hint":
    newProgress += amount;
    changed = true;
    break;

  // Rachas
  case m.id === "d4" && type === "streak" && extra.streak >= m.target:
  case m.id === "w5" && type === "streak" && extra.streak >= m.target:
    newProgress = m.target;
    changed = true;
    break;

  // Monedas
  case m.id === "d5" && type === "coins":
    newProgress += amount;
    changed = true;
    break;

  // Niveles
  case ["w3", "w4"].includes(m.id) && type === "level" && extra.level >= m.target:
    newProgress = m.target;
    changed = true;
    break;
}


      return { ...m, progress: Math.min(newProgress, m.target) };
    });

   if (changed) {
  const copy = {
    ...missions,
    generatedAt: missions.generatedAt || Date.now(),
  };
  scopedSave(user, key, copy);
  return copy;
}


    return missions;
  };

  const d = update(daily, KEYS.MISSIONS_DAILY);
  const w = update(weekly, KEYS.MISSIONS_WEEKLY);

  return { daily: d, weekly: w };
}
