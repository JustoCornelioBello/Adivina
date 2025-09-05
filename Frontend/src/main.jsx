import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { LangProvider } from "./contexts/LangContext";
import { AudioProvider } from "./contexts/AudioContext"; // 👈 IMPORTANTE
import 'bootstrap/dist/css/bootstrap.min.css';
import { MultiplayerProvider } from "./contexts/MultiplayerContext"; // 👈 ya corregido


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <LangProvider>
        <AudioProvider>   {/* 👈 ENVUELVE TODA LA APP */}
          <BrowserRouter>
          <MultiplayerProvider>
            <App />
            </MultiplayerProvider>
          </BrowserRouter>
        </AudioProvider>
      </LangProvider>
    </AuthProvider>
  </React.StrictMode>
);
