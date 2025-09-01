// src/utils/userStats.js
import { db } from "../firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Actualiza estadísticas del usuario en Firestore
 * @param {string} uid - ID del usuario (Firebase Auth UID)
 * @param {object} stats - { xp, coins, streak }
 */
export async function updateUserStats(uid, stats) {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      ...stats,
      lastLogin: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Error al actualizar Firestore:", err);
  }
}
