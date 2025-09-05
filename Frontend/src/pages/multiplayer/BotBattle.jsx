// src/pages/multiplayer/BotBattle.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useMultiplayer } from "../../contexts/MultiplayerContext";

export default function BotBattle() {
  const { user } = useAuth();
  const { playWithBot } = useMultiplayer();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // al entrar, iniciar partida con el bot
  useEffect(() => {
    const start = async () => {
      if (!user?.uid) return;
      const res = await playWithBot(user.uid, 5);
      if (res.ok) {
        setQuestions(res.questions);
      }
    };
    start();
  }, [user, playWithBot]);

  const handleAnswer = (answer) => {
    const q = questions[current];
    const correct = q.answer === answer;

    if (correct) setMyScore((s) => s + 1);

    // el bot responde con 50% de probabilidad de acierto
    if (Math.random() > 0.5) setBotScore((s) => s + 1);

    const next = current + 1;
    if (next >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(next);
    }
  };

  if (!questions.length) return <p>⚡ Cargando partida con el bot...</p>;

  if (finished) {
    return (
      <div className="card">
        <h2>🏆 Resultado contra el Bot</h2>
        <p>Tu puntaje: {myScore}</p>
        <p>Puntaje del bot: {botScore}</p>
        <h3>
          {myScore > botScore
            ? "🎉 ¡Ganaste!"
            : myScore === botScore
            ? "🤝 Empate"
            : "😅 Perdiste contra el bot"}
        </h3>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="card">
      <h3>Pregunta {current + 1}</h3>
      <p>{q.question}</p>
      <div className="options-grid">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className="btn option"
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
