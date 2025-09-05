// src/contexts/MultiplayerContext.jsx
import React, { createContext, useContext } from "react";
import axios from "axios";

const MultiplayerContext = createContext();
const API_URL = "http://localhost:8000";

export function MultiplayerProvider({ children }) {
  const createChallenge = async (rivalId, maxQuestions = 5, userId) => {
    try {
      const res = await axios.post(`${API_URL}/multiplayer/challenge`, {
        challenger_id: userId,
        rival_id: rivalId,
        max_questions: maxQuestions,
      });
      return { ok: true, ...res.data };
    } catch (err) {
      console.error("Error creando challenge:", err);
      return { ok: false };
    }
  };

  const playWithBot = async (userId, maxQuestions = 5) => {
    try {
      const res = await axios.post(`${API_URL}/multiplayer/play_with_bot`, {
        user_id: userId,
        max_questions: maxQuestions,
      });
      return { ok: true, ...res.data };
    } catch (err) {
      console.error("Error jugando con bot:", err);
      return { ok: false };
    }
  };

  const fetchHistory = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/multiplayer/history/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Error cargando historial:", err);
      return { ok: false, history: [] };
    }
  };

  return (
    <MultiplayerContext.Provider
      value={{ createChallenge, playWithBot, fetchHistory }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
}

export const useMultiplayer = () => useContext(MultiplayerContext);
