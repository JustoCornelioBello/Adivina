import React, { useState } from "react";
import { load, save } from "../utils/storage";
import { KEYS } from "../utils/storage";
import { useAuth } from "../auth/AuthContext";
import ChestModal from "../components/ChestModal";
import { rollChestReward } from "../utils/rewards"; // función que ya usas en el juego
import ConfirmModal from "../components/ConfirmModal";


export default function Store() {
  const { user } = useAuth();



  // ...
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirmIcon, setConfirmIcon] = useState(null);


 const showConfirm = (title, msg, icon = "✅") => {
  setConfirmTitle(title);
  setConfirmMsg(msg);
  setConfirmIcon(icon);
  setConfirmOpen(true);
};






  const [modalOpen, setModalOpen] = useState(false);
  const [reward, setReward] = useState(null);

  const openChest = () => {
    const rw = rollChestReward();
    setReward(rw);
    setModalOpen(true);
  };




  // Monedas y diamantes actuales
  const [coins, setCoins] = useState(load(KEYS.COINS, 500));
  const [diamonds, setDiamonds] = useState(load(KEYS.DIAMONDS, 50));
  const [lives, setLives] = useState(load(KEYS.LIVES, Array(5).fill(null)));

  // Helpers
  const updateCoins = (val) => { setCoins(val); save(KEYS.COINS, val); };
  const updateDiamonds = (val) => { setDiamonds(val); save(KEYS.DIAMONDS, val); };
  const updateLives = (arr) => { setLives(arr); save(KEYS.LIVES, arr); };
  const updateMultiplier = (mult, minutes) => {
    const expiresAt = Date.now() + minutes * 60 * 1000;
    save(KEYS.MULTIPLIER, { value: mult, expiresAt });
  };

  // Compra con monedas
  const buyWithCoins = (cost, onSuccess) => {
    if (coins < cost) return alert("No tienes suficientes monedas 🪙");
    updateCoins(coins - cost);
    onSuccess();
  };

  // Compra con diamantes
  const buyWithDiamonds = (cost, onSuccess) => {
    if (diamonds < cost) return alert("No tienes suficientes diamantes 💎");
    updateDiamonds(diamonds - cost);
    onSuccess();
  };

  // ============================
  // ARTÍCULOS
  // ============================
  const items = [
    {
      id: "life",
      name: "❤️ Vida Extra",
      desc: "Recupera inmediatamente una vida.",
      cost: { coins: 150 },
      effect: () => {
        const arr = [...lives];
        const idx = arr.findIndex((l) => l !== null);
        if (idx !== -1) arr[idx] = null;
        else arr[0] = null;
        updateLives(arr);
      },
    },
    {
      id: "xp2",
      name: "⚡ Multiplicador XP x2 (15m)",
      desc: "Duplica tu XP por 15 minutos.",
      cost: { diamonds: 120 },
      effect: () => updateMultiplier(2, 15),
    },
    {
      id: "xp3",
      name: "⚡ Multiplicador XP x3 (30m)",
      desc: "Triplica tu XP por 30 minutos.",
      cost: { diamonds: 200 },
      effect: () => updateMultiplier(3, 30),
    },
    {
      id: "xp5",
      name: "⚡ Multiplicador XP x5 (10m)",
      desc: "XP al máximo por 10 minutos.",
      cost: { diamonds: 300 },
      effect: () => updateMultiplier(5, 10),
    },
    {
      id: "cofre",
      name: "🎁 Cofre Misterioso",
      desc: "Recompensas aleatorias (XP, monedas o diamantes).",
      cost: { coins: 250, diamonds: 90 },
      effect: () => openChest(),
    },
    {
      id: "boost",
      name: "🔥 Booster de Racha",
      desc: "Mantén tu racha aunque falles una vez.",
      cost: { diamonds: 180 },
      effect: () => alert("🔥 Booster de racha activado."),
    },
    {
      id: "skip",
      name: "⏭️ Saltar Pregunta",
      desc: "Sáltate una pregunta difícil sin perder vidas.",
      cost: { coins: 100 },
      effect: () => alert("⏭️ Puedes saltar una pregunta."),
    },
    {
      id: "hints",
      name: "💡 Pack de Pistas (x3)",
      desc: "Agrega 3 pistas adicionales.",
      cost: { coins: 120, diamonds: 50 },
      effect: () => {
        const hints = load(KEYS.HINTS, 3) + 3;
        save(KEYS.HINTS, hints);
      },
    },
  ];

  // ============================
  // PACKS (dinero real)
  // ============================
  const packs = [
    { id: "coins500", type: "coins", amount: 500, price: "$0.99" },
    { id: "coins1500", type: "coins", amount: 1500, price: "$1.99" },
    { id: "coins5000", type: "coins", amount: 5000, price: "$4.99" },
    { id: "diam50", type: "diamonds", amount: 50, price: "$0.99" },
    { id: "diam150", type: "diamonds", amount: 150, price: "$2.99" },
    { id: "diam500", type: "diamonds", amount: 500, price: "$7.99" },
  ];

  const buyItem = (item) => {
    if (item.cost.coins) {
      buyWithCoins(item.cost.coins, () => {
        item.effect();
        showConfirm("Compra exitosa", `✅ Compraste: ${item.name}`);
      });
    } else if (item.cost.diamonds) {
      buyWithDiamonds(item.cost.diamonds, () => {
        item.effect();
        showConfirm("Compra exitosa", `✅ Compraste: ${item.name}`);
      });
    }
  };

  const buyPack = (pack) => {
    // Simulación de compra real
    if (pack.type === "coins") {
      updateCoins(coins + pack.amount);
    } else {
      updateDiamonds(diamonds + pack.amount);
    }
    showConfirm(
  "Compra exitosa",
  `Compraste ${pack.amount} ${pack.type === "coins" ? "monedas 🪙" : "diamantes 💎"} (${pack.price})`,
  pack.type === "coins" ? "🪙" : "💎"
);

  };

  // ============================
  // TRUEQUE
  // ============================
  const tradeCoinsForDiamonds = () => {
    if (coins < 500) return alert("Necesitas al menos 500 monedas.");
    updateCoins(coins - 500);
    updateDiamonds(diamonds + 20);
    showConfirm("Trueque realizado", "✅ 500 monedas → 20 diamantes");
  };

  const tradeDiamondsForCoins = () => {
    if (diamonds < 20) return alert("Necesitas al menos 20 diamantes.");
    updateDiamonds(diamonds - 20);
    updateCoins(coins + 400);
    showConfirm("Trueque realizado", "✅ 20 diamantes → 400 monedas");

  };

  return (
    <div className="card game-card white">
      <h2 className="mb-3">🛒 Tienda</h2>

      {/* Monedas actuales */}
      <div className="stats-grid mb-3">
        <div className="stat-card"><span>Oro</span><b>{coins} 🪙</b></div>
        <div className="stat-card"><span>Diamantes</span><b>{diamonds} 💎</b></div>
      </div>

      {/* ARTÍCULOS */}
      <h4>🎁 Artículos Especiales</h4>
      <div className="store-grid">
        {items.map((item) => (
          <div key={item.id} className="store-card">
            <h5>{item.name}</h5>
            <p>{item.desc}</p>
            <div className="cost">
              {item.cost.coins && <span className="cost-coins">{item.cost.coins} 🪙</span>}
              {item.cost.diamonds && <span className="cost-diamonds">{item.cost.diamonds} 💎</span>}
            </div>
            <button className="btn-buy" onClick={() => buyItem(item)}>Comprar</button>
          </div>
        ))}
      </div>

      {/* TRUEQUE */}
      <h4 className="mt-4">🔄 Trueque</h4>
      <div className="store-grid">
        <div className="store-card">
          <h5>500 🪙 → 20 💎</h5>
          <p>Cambia tus monedas por diamantes.</p>
          <button className="btn-buy" onClick={tradeCoinsForDiamonds}>Intercambiar</button>
        </div>
        <div className="store-card">
          <h5>20 💎 → 400 🪙</h5>
          <p>Cambia tus diamantes por monedas.</p>
          <button className="btn-buy" onClick={tradeDiamondsForCoins}>Intercambiar</button>
        </div>
      </div>

      {/* COMPRAR CON DINERO */}
      <h4 className="mt-4">💳 Comprar Monedas/Diamantes</h4>
      <div className="store-grid">
        {packs.map((pack) => (
          <div key={pack.id} className="store-card premium">
            <h5>
              {pack.amount} {pack.type === "coins" ? "🪙 Oro" : "💎 Diamantes"}
            </h5>
            <p>Compra con dinero real</p>
            <span className="price">{pack.price}</span>
            <button className="btn-buy success" onClick={() => buyPack(pack)}>
              Comprar
            </button>
          </div>
        ))}
      </div>

      <ChestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        reward={reward}
      />
      <ConfirmModal
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title={confirmTitle}
  message={
    <>
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>
        {confirmIcon}
      </div>
      <p>{confirmMsg}</p>
    </>
  }
/>




    </div>
  );
}
