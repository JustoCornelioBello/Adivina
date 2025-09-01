import React from "react";
import { FaLightbulb } from "react-icons/fa";

export default function HintButton({ hintsLeft, onHint }) {
  return (
    <button
      className={`hint-btn ${hintsLeft <= 0 ? "disabled" : ""}`}
      disabled={hintsLeft <= 0}
      onClick={onHint}
    >
      <FaLightbulb />
      Pista
      <span className="hint-counter">{hintsLeft}</span>
    </button>
  );
}
