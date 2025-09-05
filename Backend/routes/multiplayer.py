from fastapi import APIRouter, HTTPException, Body
from firebase_config import db
from datetime import datetime
import random

router = APIRouter()

@router.get("/users")
def list_users():
    """Lista usuarios disponibles"""
    users_ref = db.collection("users").stream()
    return [{"id": u.id, **u.to_dict()} for u in users_ref]



@router.post("/play_with_bot")
def play_with_bot(data: dict = Body(...)):
    """Juego contra el bot"""
    uid = data["user_id"]
    max_questions = data.get("max_questions", 5)

    # Preguntas de ejemplo
    questions = [
        {"question": "¿2+2?", "options": ["3","4","5"], "answer": "4"},
        {"question": "Capital de Francia?", "options": ["Roma","París","Madrid"], "answer": "París"},
        {"question": "5*3?", "options": ["15","10","20"], "answer": "15"},
    ]

    challenge = {
        "challenger_id": uid,
        "rival_id": "BOT",
        "max_questions": max_questions,
        "status": "bot_game",
        "created_at": datetime.utcnow().isoformat(),
    }
    doc_ref = db.collection("challenges").add(challenge)

    return {"ok": True, "challenge_id": doc_ref[1].id, "questions": questions[:max_questions]}



@router.post("/challenge")
def create_challenge(data: dict = Body(...)):
    """
    Crear reto a otro jugador
    data = { challenger_id, rival_id, max_questions }
    """
    challenger = db.collection("users").document(data["challenger_id"]).get()
    rival = db.collection("users").document(data["rival_id"]).get()
    if not challenger.exists or not rival.exists:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")

    challenge = {
        "challenger_id": data["challenger_id"],
        "rival_id": data["rival_id"],
        "max_questions": data.get("max_questions", 5),
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }
    doc_ref = db.collection("challenges").add(challenge)

    # notificar al rival
    notif = {
        "title": "Nuevo reto ⚔️",
        "message": f"Has sido retado por {challenger.to_dict().get('username')}",
        "level": "info",
        "timestamp": datetime.utcnow().isoformat(),
        "seen": False,
    }
    db.collection("users").document(data["rival_id"]).collection("notifications").add(notif)

    return {"ok": True, "challenge_id": doc_ref[1].id}

@router.post("/challenge/{challenge_id}/respond")
def respond_challenge(challenge_id: str, data: dict = Body(...)):
    """Aceptar o rechazar reto"""
    ref = db.collection("challenges").document(challenge_id)
    snap = ref.get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Reto no encontrado")

    status = data.get("status")
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Estado inválido")

    ref.update({"status": status})
    return {"ok": True, "msg": f"Reto {status}"}



@router.get("/history/{user_id}")
def get_history(user_id: str):
    """Historial de partidas del usuario"""
    snaps = db.collection("challenges").where("challenger_id", "==", user_id).stream()
    snaps2 = db.collection("challenges").where("rival_id", "==", user_id).stream()
    history = [{"id": d.id, **d.to_dict()} for d in snaps] + [{"id": d.id, **d.to_dict()} for d in snaps2]
    return {"ok": True, "history": sorted(history, key=lambda x: x["created_at"], reverse=True)}
