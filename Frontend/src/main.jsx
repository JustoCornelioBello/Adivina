import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { LangProvider } from "./contexts/LangContext";
import { AudioProvider } from "./contexts/AudioContext"; // 👈 IMPORTANTE
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <LangProvider>
        <AudioProvider>   {/* 👈 ENVUELVE TODA LA APP */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AudioProvider>
      </LangProvider>
    </AuthProvider>
  </React.StrictMode>
);
