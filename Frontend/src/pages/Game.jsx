// src/pages/Game.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import questions from "../data/questions";
import HeartLives from "../components/HeartLives";
import ProgressBarXP from "../components/ProgressBar";
import HintButton from "../components/HintButton";
import CooldownTimer from "../components/CooldownTimer";
import FloatingXP from "../components/FloatingXP";

import RewardModal from "../components/RewardModal";
import Motivator from "../components/Motivator";

import { useAudio } from "../contexts/AudioContext";

import { scopedLoad, scopedSave, KEYS } from "../utils/storageScoped";
import { getLevelFromXP, rollChestReward, getActiveMultiplier } from "../utils/rewards";

// 🔗 Importamos la conexión con Misiones
 import { updateMissionsProgress } from "../utils/missionsProgress";


import { updateUserStats } from "../utils/userStats";


// -------------------------------
// Helpers de vidas
// -------------------------------
const MAX_LIVES = 5;
const LIFE_COOLDOWN_MS = 15 * 60 * 1000;

const normalizeLives = (val) => {
  if (Array.isArray(val)) {
    const arr = val.slice(0, MAX_LIVES);
    while (arr.length < MAX_LIVES) arr.push(null);
    return arr.map((v) => (typeof v === "number" ? v : null));
  }
  return Array(MAX_LIVES).fill(null);
};

const initScopedLives = (user) => {
  const raw = scopedLoad(user, KEYS.LIVES, null);
  const norm = normalizeLives(raw);
  scopedSave(user, KEYS.LIVES, norm);
  return norm;
};

const loseLifeScoped = (user, lives) => {
  const arr = normalizeLives(lives);
  const idx = arr.findIndex((l) => l === null);
  if (idx === -1) return arr;
  const newArr = [...arr];
  newArr[idx] = Date.now() + LIFE_COOLDOWN_MS;
  scopedSave(user, KEYS.LIVES, newArr);
  return newArr;
};

// -------------------------------
// Componente principal
// -------------------------------
export default function Game(props) {
  const { coins: coinsProp, setCoins: setCoinsProp, diamonds: diamondsProp, setDiamonds: setDiamondsProp } = props || {};
  const { user } = useAuth();
  const navigate = useNavigate();

  // Config
  const BASE_XP = 100;
  const COINS_PER_CORRECT = 50;

  // Estado persistente
  const [current, setCurrent] = useState(() => scopedLoad(user, KEYS.CURRENT_Q, 0));
  const [xp, setXp] = useState(() => scopedLoad(user, KEYS.XP, 0));
  const [score, setScore] = useState(() => scopedLoad(user, KEYS.SCORE, 0));
  const [streak, setStreak] = useState(() => scopedLoad(user, KEYS.STREAK, 0));
  const [hintsLeft, setHintsLeft] = useState(() => scopedLoad(user, KEYS.HINTS, 3));
  const [mult, setMult] = useState(() => scopedLoad(user, KEYS.MULTIPLIER, null));
  const [lives, setLives] = useState(() => initScopedLives(user));

  // UI
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [lastXpKey, setLastXpKey] = useState(0);

  // Cofres
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingReward, setPendingReward] = useState(null);

  // Motivador
  const [motKey, setMotKey] = useState(0);
  const motivatorPool = [
    { emoji: "🎯", text: "¡Tiro perfecto!" },
    { emoji: "🚀", text: "¡Vas con todo!" },
    { emoji: "🔥", text: "¡Racha encendida!" },
    { emoji: "💡", text: "¡Respuesta brillante!" },
    { emoji: "🏆", text: "¡Camino al récord!" },
  ];

  // Sonidos
  const sfx = useMemo(() => {
    const mk = (src, vol = 0.6) => {
      const a = new Audio(src);
      a.volume = vol;
      a.preload = "auto";
      return a;
    };
    return {
      correct: mk("/sounds/correct.mp3", 0.7),
      wrong: mk("/sounds/wrong.mp3", 0.7),
      reward: mk("/sounds/reward.mp3", 0.8),
      click: mk("/sounds/click.mp3", 0.4),
    };
  }, []);

  // Persistencia
  useEffect(() => scopedSave(user, KEYS.CURRENT_Q, current), [user, current]);
  useEffect(() => scopedSave(user, KEYS.XP, xp), [user, xp]);
  useEffect(() => scopedSave(user, KEYS.SCORE, score), [user, score]);
  useEffect(() => scopedSave(user, KEYS.STREAK, streak), [user, streak]);
  useEffect(() => scopedSave(user, KEYS.HINTS, hintsLeft), [user, hintsLeft]);
  useEffect(() => {
    if (mult?.expiresAt && Date.now() > mult.expiresAt) {
      setMult(null);
      scopedSave(user, KEYS.MULTIPLIER, null);
    } else {
      scopedSave(user, KEYS.MULTIPLIER, mult);
    }
  }, [user, mult]);

  // Restaurar vidas expiradas
  useEffect(() => {
    const id = setInterval(() => {
      setLives((prev) => {
        const now = Date.now();
        let changed = false;
        const next = normalizeLives(prev).map((v) => {
          if (typeof v === "number" && v <= now) {
            changed = true;
            return null;
          }
          return v;
        });
        if (changed) scopedSave(user, KEYS.LIVES, next);
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [user]);

  // Monedas/Diamantes
  const coins = coinsProp ?? scopedLoad(user, KEYS.COINS, 0);
  const diamonds = diamondsProp ?? scopedLoad(user, KEYS.DIAMONDS, 0);
  const updateCoins = (fnOrVal) => {
    const newVal = typeof fnOrVal === "function" ? fnOrVal(coins) : fnOrVal;
    if (setCoinsProp) setCoinsProp(newVal);
    scopedSave(user, KEYS.COINS, newVal);
  };
  const updateDiamonds = (fnOrVal) => {
    const newVal = typeof fnOrVal === "function" ? fnOrVal(diamonds) : fnOrVal;
    if (setDiamondsProp) setDiamondsProp(newVal);
    scopedSave(user, KEYS.DIAMONDS, newVal);
  };

  const level = getLevelFromXP(xp);
  const currentQ = questions[current] || questions[questions.length - 1];
  const baseOptions = filteredOptions.length ? filteredOptions : currentQ.options;
  const options = useMemo(() => baseOptions, [baseOptions]);

  const play = (a) => { try { a.currentTime = 0; a.play(); } catch {} };

  // -------------------------------
  // Responder
  // -------------------------------
 const handleAnswer = (opt) => {
  play(sfx.click);
  const isCorrect = opt === currentQ.answer;
  const activeMult = getActiveMultiplier(mult);

  if (isCorrect) {
    play(sfx.correct);

    const gainedXP = Math.round(BASE_XP * activeMult);
    const newXP = xp + gainedXP;
    const oldLevel = getLevelFromXP(xp);
    const newLevel = getLevelFromXP(newXP);

    const newScore = score + 1;
    const newStreak = streak + 1;
    const newCoins = coins + COINS_PER_CORRECT;

    // ⬇️ Estados locales
    setXp(newXP);
    setScore(newScore);
    setStreak(newStreak);
    setLastXpKey((k) => k + 1);
    setMotKey((k) => k + 1);
    updateCoins(newCoins);

    // ⬇️ Actualizar en Firebase
    if (user && user.uid) {
      updateUserStats(user.uid, {
        xp: newXP,
        coins: newCoins,
        streak: newStreak,
      });
    }

    // ⬇️ Misiones
    updateMissionsProgress(user, { type: "answered", amount: 1 });
    updateMissionsProgress(user, { type: "coins", amount: COINS_PER_CORRECT });
    updateMissionsProgress(user, { type: "streak", extra: { streak: newStreak } });
    if (newLevel > oldLevel) {
      updateMissionsProgress(user, { type: "level", extra: { level: newLevel } });
    }





    // 🔚 Feedback + avanzar
setFeedback("correct");
setTimeout(() => {
  setDisabledOptions(new Set());
  setFilteredOptions([]);
  setFeedback(null);

  const nextIndex = current + 1;
  const finished = nextIndex >= questions.length;
  if (finished) {
    navigate("/result", { state: { xp: newXP, score: newScore, total: questions.length } });
  } else {
    setCurrent(nextIndex);
  }
}, 300);


    // resto de tu lógica de cofres, feedback, navegación...
  } else {
    // lógica cuando falla la respuesta...

  // ❌ Respuesta incorrecta
    play(sfx.wrong);
    setFeedback("wrong");

    // Quitar una vida
    setLives((prev) => {
      const after = loseLifeScoped(user, prev); // usa tu helper
      const anyAvailable = after.some((l) => l === null);

      if (!anyAvailable) {
        // si no hay vidas, fin del juego
        setTimeout(() => {
          navigate("/result", { state: { xp, score, total: questions.length } });
        }, 500);
      }
      return after;
    });

    // Reiniciar racha
    setStreak(0);

    // Marcar la opción como deshabilitada
    setDisabledOptions((prev) => new Set(prev).add(opt));

    // Quitar feedback después de un tiempo
    setTimeout(() => setFeedback(null), 600);

    // 🔗 Actualizar en Firebase
    if (user && user.uid) {
      updateUserStats(user.uid, {
        xp,
        coins,
        streak: 0,
      });
    }


  }
};



  // -------------------------------
  // Recompensas de cofres
  // -------------------------------
 const claimPendingReward = () => {
  if (!pendingReward) { setModalOpen(false); return; }
  const rw = pendingReward;

  try { play(sfx.reward); } catch {}

  let newXP = xp;
  let newCoins = coins;
  let newDiamonds = diamonds;

  if (rw.type === "xp") {
    newXP = xp + rw.amount;
    setXp(newXP);
    setLastXpKey((k) => k + 1);
  }
  if (rw.type === "coins") {
    newCoins = coins + rw.amount;
    updateCoins(newCoins);
  }
  if (rw.type === "diamond") {
    newDiamonds = diamonds + rw.amount;
    updateDiamonds(newDiamonds);
  }
  if (rw.type === "multiplier") {
    const expiresAt = Date.now() + rw.minutes * 60 * 1000;
    setMult({ value: rw.value, expiresAt });
  }

  // 🔗 Actualizar Firestore
  if (user && user.uid) {
    updateUserStats(user.uid, {
      xp: newXP,
      coins: newCoins,
      streak,
    });
  }

  setPendingReward(null);
  setModalOpen(false);
};


  // -------------------------------
  // Usar pista
  // -------------------------------
 const useHint = () => {
  if (hintsLeft <= 0) return;
  setHintsLeft((h) => h - 1);
  updateMissionsProgress(user, { type: "hint", amount: 1 });

  // 🔗 Registrar en Firebase (opcional: si quieres guardar hints usados)
  if (user && user.uid) {
    updateUserStats(user.uid, {
      xp,
      coins,
      streak,
    });
  }

  const correct = currentQ.answer;
  const wrongs = currentQ.options.filter((o) => o !== correct);
  const remain = [correct, wrongs[0]];
  setFilteredOptions(remain.sort(() => Math.random() - 0.5));
  setDisabledOptions(new Set());
};


  // Cooldown vidas
  const nextLifeRemainingMs = (() => {
    const pending = lives.filter((l) => typeof l === "number");
    if (!pending.length) return 0;
    const minTs = Math.min(...pending);
    return Math.max(0, minTs - Date.now());
  })();

  const anyLifeAvailable = lives.some(l => l === null);

  const motIdx = ((motKey - 1) % motivatorPool.length + motivatorPool.length) % motivatorPool.length;
  const mot = motivatorPool[motIdx] || motivatorPool[0];

  // Re-render si mult está activo
  useEffect(() => {
    if (!mult || !mult.expiresAt) return;
    const id = setInterval(() => {
      setMult((prev) => (prev ? { ...prev } : null));
    }, 1000);
    return () => clearInterval(id);
  }, [mult]);

  const { enabled, setEnabled } = useAudio();

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="container py-3">
      <div className="hud white">
        <div className="hud-card white">
          <span className="hud-label">Nivel</span>
          <span className="hud-value">{level}</span>
        </div>
        <div className="hud-card white">
          <span className="hud-label">XP</span>
          <span className="hud-value">{xp}</span>
        </div>
        {mult && mult.expiresAt > Date.now() && (
          <div className="hud-card hud-mult">
            ⚡ x{mult.value}
            <small className="muted">
              {Math.max(0, Math.ceil((mult.expiresAt - Date.now()) / 60000))}m
            </small>
          </div>
        )}
        <div className="hud-card white hud-lives">
          <span className="hud-label">Vidas</span>
          <HeartLives lives={lives} />
        </div>
      </div>

      {nextLifeRemainingMs > 0 && (
        <CooldownTimer
          nextLifeAt={Date.now() + nextLifeRemainingMs}
          onRestore={() => {
            setLives((prev) => {
              const now = Date.now();
              const next = normalizeLives(prev).map((v) => (typeof v === "number" && v <= now ? null : v));
              scopedSave(user, KEYS.LIVES, next);
              return next;
            });
          }}
        />
      )}

      <div className="question-meta">
        <span className="q-chip">Pregunta {current + 1} / {questions.length}</span>
        <span className="q-chip subtle">Dif: {Math.min(1 + Math.floor(current / 10), 5)}</span>
        {getActiveMultiplier(mult) > 1 && (
          <span className="q-chip" title="Multiplicador activo">⚡ x{getActiveMultiplier(mult)}</span>
        )}
        <span className="q-chip subtle">+{COINS_PER_CORRECT} monedas por acierto</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className="btn-music"
          title={enabled ? "Apagar música" : "Encender música"}
        >
          {enabled ? "🎵" : "🔇"}
        </button>
      </div>

      {!anyLifeAvailable && (
        <>
          <div className="card game-card white">
            <h3 className="mb-1">Sin vidas</h3>
            <p className="muted">Debes esperar a que se recupere una vida para continuar.</p>
            <CooldownTimer
              nextLifeAt={Date.now() + nextLifeRemainingMs}
              onRestore={() => {
                setLives(prev => {
                  const now = Date.now();
                  const next = prev.map(v => (typeof v === "number" && v <= now ? null : v));
                  if (next.some((v, i) => v !== prev[i])) scopedSave(user, KEYS.LIVES, next);
                  return next;
                });
              }}
            />
          </div>
          <ProgressBarXP xp={xp} />
          <FloatingXP text="+XP" triggerKey={lastXpKey} />
          <Motivator emoji={mot.emoji} text={mot.text} triggerKey={motKey} />
          <RewardModal open={modalOpen} reward={pendingReward} onClaim={claimPendingReward} onClose={() => setModalOpen(false)} />
        </>
      )}

      {anyLifeAvailable && (
        <>
          <div className={`card game-card white ${feedback === "wrong" ? "shake" : ""}`}>
            <h4 className="mb-3">{currentQ.question}</h4>
            <div className="cards-grid">
              {options.map((opt, i) => {
                const isDisabled = disabledOptions.has(opt);
                return (
                  <button
                    key={i}
                    className={`option-card ${isDisabled ? "disabled" : ""}`}
                    onClick={() => (!isDisabled && handleAnswer(opt))}
                  >
                    <div className="option-bullet">{i + 1}</div>
                    <div className="option-text">{opt}</div>
                  </button>
                );
              })}
            </div>
            <div className="actions-row">
              <HintButton hintsLeft={hintsLeft} onHint={useHint} />
            </div>
          </div>
        </>
      )}

      <FloatingXP text="+XP" triggerKey={lastXpKey} />
      <Motivator emoji={mot.emoji} text={mot.text} triggerKey={motKey} />
      <RewardModal open={modalOpen} reward={pendingReward} onClaim={claimPendingReward} onClose={() => setModalOpen(false)} />
    </div>
  );
}
