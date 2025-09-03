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
  collection,
  onSnapshot,
} from "firebase/firestore";

import NotificationModal from "../components/NotificationModal";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📌 Notificaciones
  const [notif, setNotif] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  // 👉 Listener para notificaciones
useEffect(() => {
  if (user?.uid) {
    const unsub = onSnapshot(
      collection(db, "users", user.uid, "notifications"),
      (snap) => {
        snap.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const notifData = change.doc.data();

            // 👉 si ya fue vista, no la mostramos
            if (notifData.seen) return;

            // ✅ mostrarla solo una vez
            setNotif(notifData);
            setShowNotif(true);

            // 🔖 marcar como vista para que no vuelva a salir
            await updateDoc(change.doc.ref, { seen: true });
          }
        });
      }
    );
    return () => unsub();
  }
}, [user]);



  // 👉 Listener de sesión
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
          await setDoc(userRef, {
            username: firebaseUser.displayName || "Jugador",
            email: firebaseUser.email,
            role: "jugador",
            xp: 0,
            coins: 0,
            streak: 0,
            status: "active",
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

  // Métodos de autenticación
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
        status: "active",
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
        status: "active",
      });

      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.message };
    }
  };

  const logout = () => signOut(auth);

  const loginAsGuest = () =>
    setUser({ isGuest: true, username: "Invitado" });

  const updateProfileData = async (updates) => {
    try {
      if (!user?.uid) throw new Error("No hay usuario logueado");

      if (updates.username || updates.avatarUrl) {
        await fbUpdateProfile(auth.currentUser, {
          displayName: updates.username || user.username,
          photoURL: updates.avatarUrl || user.avatarUrl,
        });
      }

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, updates);

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

      <NotificationModal
        open={showNotif}
        onClose={() => setShowNotif(false)}
        notification={notif}
      />
    </AuthContext.Provider>
  );
}
