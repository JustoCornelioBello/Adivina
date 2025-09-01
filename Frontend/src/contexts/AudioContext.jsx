import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioContextGame = createContext();

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(() => JSON.parse(localStorage.getItem("music_enabled") ?? "true"));
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem("music_volume") ?? "0.5"));

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/bg-music.mp3"); // 👈 el archivo debe estar en public/sounds/
      audioRef.current.loop = true;
    }
    audioRef.current.volume = volume;

    if (enabled) {
      audioRef.current.play().catch(() => {
        console.warn("El navegador bloqueó la reproducción automática hasta que haya interacción del usuario.");
      });
    } else {
      audioRef.current.pause();
    }

    localStorage.setItem("music_enabled", JSON.stringify(enabled));
    localStorage.setItem("music_volume", volume.toString());
  }, [enabled, volume]);

  return (
    <AudioContextGame.Provider value={{ enabled, setEnabled, volume, setVolume }}>
      {children}
    </AudioContextGame.Provider>
  );
}

export const useAudio = () => useContext(AudioContextGame);
