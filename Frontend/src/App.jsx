import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Result from "./pages/Result.jsx";
import Store from "./pages/Store.jsx";
import Layout from "./pages/Layout.jsx";
import Missions from "./pages/Missions.jsx";

import Login from "./pages/Login.jsx"; // ✅ BIEN
import Profile from "./pages/Profile.jsx";
import Terms from "./pages/config/Terms.jsx";
import Account from "./pages/config/Account.jsx";
import MyData from "./pages/config/MyData.jsx";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import ConfigTabs from "./pages/ConfigTabs.jsx";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Dashboard from "./pages/admin/Dashboard.jsx";
import Users from "./pages/admin/Users.jsx";
import UserDetail from "./pages/admin/UserDetail.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Settings from "./pages/admin/Settings.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";


import AdminRoute from "./auth/AdminRoute"; // 👈 importa el protector

import BotBattle from "./pages/multiplayer/BotBattle";


// ⬇️ Páginas multijugador
import ChallengeLobby from "./pages/multiplayer/ChallengeLobby";
import DuelRoom from "./pages/multiplayer/DuelRoom";



import "./App.css";
import { KEYS, load, save } from "./utils/storage.js";

export default function App() {
  const [coins, setCoins] = useState(() => load(KEYS.COINS, 0));
  const [diamonds, setDiamonds] = useState(() => load(KEYS.DIAMONDS, 0));
  useEffect(() => save(KEYS.COINS, coins), [coins]);
  useEffect(() => save(KEYS.DIAMONDS, diamonds), [diamonds]);

  return (
    <AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        {/* ================== Rutas de Admin (sin Layout principal) ================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================== Rutas normales (con Layout principal) ================== */}
        <Route
          path="/*"
          element={
            <Layout coins={coins} diamonds={diamonds}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/game" element={
                  <ProtectedRoute>
                    <Game
                      coins={coins}
                      setCoins={setCoins}
                      diamonds={diamonds}
                      setDiamonds={setDiamonds}
                    />
                  </ProtectedRoute>
                } />
                <Route path="/multiplayer/botbattle" element={<BotBattle />} />


   {/* 🎮 Multijugador */}
              <Route
                path="/multiplayer"
                element={
                  <ProtectedRoute>
                    <ChallengeLobby />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/multiplayer/duel/:challengeId"
                element={
                  <ProtectedRoute>
                    <DuelRoom />
                  </ProtectedRoute>
                }
              />


                <Route path="/store" element={
                  <ProtectedRoute>
                    <Store
                      coins={coins}
                      setCoins={setCoins}
                      diamonds={diamonds}
                      setDiamonds={setDiamonds}
                    />
                  </ProtectedRoute>
                } />
                <Route path="/missions" element={<ProtectedRoute><Missions /></ProtectedRoute>} />
                <Route path="/config/terms" element={<Terms />} />
                <Route path="/config/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/config/data" element={<ProtectedRoute><MyData /></ProtectedRoute>} />
                <Route path="/config" element={<ProtectedRoute><ConfigTabs /></ProtectedRoute>} />
                <Route path="/result" element={<Result />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
