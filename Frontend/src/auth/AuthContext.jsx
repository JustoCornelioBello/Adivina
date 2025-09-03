// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as fbUpdateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vigilar cambios de sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userSnap.data(),
          });
        } else {
          // Si no existe el doc en Firestore, lo creamos
          await setDoc(userRef, {
            username: firebaseUser.displayName || "Jugador",
            email: firebaseUser.email,
            role: "jugador",
            xp: 0,
            coins: 0,
            streak: 0,
            lastLogin: serverTimestamp(),
          });
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.displayName || "Jugador",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ---- Métodos ----
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", res.user.uid);
      const snap = await getDoc(userRef);

      let userData = { uid: res.user.uid, email: res.user.email };
      if (snap.exists()) {
        userData = { ...userData, ...snap.data() };
      }

      setUser(userData);
      await updateDoc(userRef, { lastLogin: serverTimestamp() });

      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await fbUpdateProfile(res.user, { displayName: username });

      const userRef = doc(db, "users", res.user.uid);
      await setDoc(userRef, {
        username,
        email,
        role: "jugador",
        xp: 0,
        coins: 0,
        streak: 0,
        lastLogin: serverTimestamp(),
      });

      setUser({
        uid: res.user.uid,
        email: res.user.email,
        username,
        role: "jugador",
        xp: 0,
        coins: 0,
        streak: 0,
      });

      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.message };
    }
  };

  const logout = () => signOut(auth);

  const loginAsGuest = () =>
    setUser({ isGuest: true, username: "Invitado" });

  // 👉 Nueva función updateProfile (la que necesitas en ProfileSettings)
  const updateProfileData = async (updates) => {
    try {
      if (!user?.uid) throw new Error("No hay usuario logueado");

      // 1. Si hay username o avatar, actualizamos en Firebase Auth
      if (updates.username || updates.avatarUrl) {
        await fbUpdateProfile(auth.currentUser, {
          displayName: updates.username || user.username,
          photoURL: updates.avatarUrl || user.avatarUrl,
        });
      }

      // 2. Actualizamos Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...updates,
      });

      // 3. Actualizamos estado local
      const newUser = { ...user, ...updates };
      setUser(newUser);

      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loginAsGuest, updateProfile: updateProfileData }}
    >
      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <h3>Cargando tu aventura...</h3>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
