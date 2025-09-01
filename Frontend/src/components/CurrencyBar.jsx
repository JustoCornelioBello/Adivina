import React from "react";
import { FaCoins, FaGem } from "react-icons/fa";

export default function CurrencyBar({ coins, diamonds }) {
  return (
    <div className="currency-bar">
      <div className="currency-chip coins">
        <FaCoins />
        <span>{coins}</span>
      </div>
      <div className="currency-chip diamonds">
        <FaGem />
        <span>{diamonds}</span>
      </div>
    </div>
  );
}
