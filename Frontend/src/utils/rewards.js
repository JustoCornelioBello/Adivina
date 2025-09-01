// Recompensas aleatorias para cofres
export const rollChestReward = () => {
  // pesos simples: +200 XP (35%), +500 monedas (30%), +1 diamante (15%), x2 XP por 5 min (20%)
  const r = Math.random();
  if (r < 0.35) return { type: "xp", amount: 200, label: "+200 XP" };
  if (r < 0.65) return { type: "coins", amount: 500, label: "+500 monedas" };
  if (r < 0.80) return { type: "diamond", amount: 1, label: "+1 diamante" };
  return { type: "multiplier", value: 2, minutes: 5, label: "Multiplicador x2 (5 min)" };
};

// Cálculo de nivel: 1000 XP por nivel
export const getLevelFromXP = (xp) => Math.floor(xp / 1000);

// Multiplicador activo?
export const getActiveMultiplier = (mult) => {
  if (!mult) return 1;
  if (mult.expiresAt && Date.now() > mult.expiresAt) return 1;
  return mult.value || 1;
};
