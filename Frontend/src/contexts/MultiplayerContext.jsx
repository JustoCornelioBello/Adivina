// src/contexts/MultiplayerContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_URL = "http://localhost:8000"; // 👈 cambia en producción

const MultiplayerContext = createContext();
export const useMultiplayer = () => useContext(MultiplayerContext);

export function MultiplayerProvider({ children }) {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);

  // Crear desafío
  const createChallenge = async (rivalId, maxQuestions = 5) => {
    try {
      const res = await axios.post(`${API_URL}/multiplayer/challenge`, {
        challenger: user?.uid,
        rival: rivalId,
        maxQuestions,
      });
      if (res.data.ok) {
        setChallenges((prev) => [...prev, res.data.challenge]);
      }
      return res.data;
    } catch (err) {
      return { ok: false, msg: err.message };
    }
  };

  // Aceptar desafío
  const acceptChallenge = async (challengeId) => {
    try {
      const res = await axios.post(`${API_URL}/multiplayer/accept`, {
        challengeId,
        userId: user?.uid,
      });
      return res.data;
    } catch (err) {
      return { ok: false, msg: err.message };
    }
  };

  // Rechazar desafío
  const rejectChallenge = async (challengeId) => {
    try {
      const res = await axios.post(`${API_URL}/multiplayer/reject`, {
        challengeId,
        userId: user?.uid,
      });
      return res.data;
    } catch (err) {
      return { ok: false, msg: err.message };
    }
  };

  return (
    <MultiplayerContext.Provider
      value={{ challenges, createChallenge, acceptChallenge, rejectChallenge }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
}
