// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userSnap.data() });
        } else {
          // si no existe doc, lo creamos
          await setDoc(userRef, {
            username: firebaseUser.displayName || "Jugador",
            email: firebaseUser.email,
            role: "jugador",
            xp: 0,
            coins: 0,
            streak: 0,
            lastLogin: serverTimestamp(),
          });
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, username: firebaseUser.displayName || "Jugador" });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

 const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);

    // traemos su doc en Firestore
    const userRef = doc(db, "users", res.user.uid);
    const snap = await getDoc(userRef);

    let userData = { uid: res.user.uid, email: res.user.email };
    if (snap.exists()) {
      userData = { ...userData, ...snap.data() };
    }

    setUser(userData); // 👈 lo seteamos inmediatamente
    await updateDoc(userRef, { lastLogin: serverTimestamp() });

    return { ok: true };
  } catch (err) {
    return { ok: false, msg: err.message };
  }
};


  const register = async (username, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: username });
    await setDoc(doc(db, "users", res.user.uid), {
      username,
      email,
      role: "jugador",
      xp: 0,
      coins: 0,
      streak: 0,
      lastLogin: serverTimestamp(),
    });
  };

  const logout = () => signOut(auth);

  const loginAsGuest = () => setUser({ isGuest: true, username: "Invitado" });

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginAsGuest }}>
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
