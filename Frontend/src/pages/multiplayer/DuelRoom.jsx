import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DuelTimer from "../../components/DuelTimer";

const API_URL = "http://localhost:8000/multiplayer";

export default function DuelRoom() {
  const { challengeId } = useParams();
  const [question, setQuestion] = useState(null);
  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    // aquí deberías cargar preguntas reales de Firestore
    setQuestion({
      q: "¿Capital de Francia?",
      options: ["Madrid", "Roma", "París", "Lisboa"],
      answer: "París",
    });
  }, [idx]);

  const handleAnswer = async (opt) => {
    const correct = opt === question.answer;
    await axios.post(`${API_URL}/challenge/answer`, {
      challengeId,
      user: "YO", // 👈 pon user.uid real
      correct,
    });

    if (idx >= 4) {
      setFinished(true);
      await axios.post(`${API_URL}/challenge/finish`, { challengeId });
    } else {
      setIdx(idx + 1);
    }
  };

  if (finished) return <h3>🏆 Duelo finalizado</h3>;

  if (!question) return <p>Cargando pregunta...</p>;

  return (
    <div className="card">
      <h3>⚔️ Pregunta {idx + 1}</h3>
      <DuelTimer seconds={10} onTimeOut={() => handleAnswer(null)} />
      <p>{question.q}</p>
      <div className="options">
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
