from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import stripe
import os, json
from dotenv import load_dotenv
from firebase_config import db
from pydantic import BaseModel
from fastapi import Body
from datetime import datetime

# ============================
# Cargar variables
# ============================
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

app = FastAPI()

# ============================
# CORS
# ============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ⚠️ en producción pon dominio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# MODELOS
# ============================
class UserUpdate(BaseModel):
    username: str | None = None
    role: str | None = None
    xp: int | None = None
    coins: int | None = None
    streak: int | None = None
    status: str | None = None  # activo/suspendido

# ============================
# USUARIOS
# ============================
@app.get("/users")
def get_users():
    """Obtener todos los usuarios"""
    users_ref = db.collection("users").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in users_ref]

@app.get("/users/{user_id}")
def get_user(user_id: str):
    """Obtener un usuario específico"""
    ref = db.collection("users").document(user_id)
    snap = ref.get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"id": snap.id, **snap.to_dict()}

@app.put("/users/{user_id}")
def update_user(user_id: str, data: UserUpdate):
    """Actualizar datos de usuario"""
    ref = db.collection("users").document(user_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    ref.update(update_data)
    return {"ok": True, "updated": update_data}

@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    """Eliminar usuario"""
    ref = db.collection("users").document(user_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    ref.delete()
    return {"ok": True, "msg": f"Usuario {user_id} eliminado"}

@app.post("/users/{user_id}/suspend")
def suspend_user(user_id: str):
    ref = db.collection("users").document(user_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    ref.update({"status": "suspended"})
    return {"ok": True, "msg": f"Usuario {user_id} suspendido"}

@app.post("/users/{user_id}/unsuspend")
def unsuspend_user(user_id: str):
    ref = db.collection("users").document(user_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    ref.update({"status": "active"})
    return {"ok": True, "msg": f"Usuario {user_id} reactivado"}

@app.post("/users/{user_id}/reset")
def reset_user(user_id: str):
    """Resetear progreso"""
    ref = db.collection("users").document(user_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    ref.update({"xp": 0, "coins": 0, "streak": 0})
    return {"ok": True, "msg": f"Progreso de {user_id} reiniciado"}

@app.get("/users/{user_id}/download")
def download_user(user_id: str):
    """Descargar datos del usuario en JSON"""
    ref = db.collection("users").document(user_id)
    snap = ref.get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    data = {"id": snap.id, **snap.to_dict()}
    return data

# ============================
# REPORTES GLOBALES
# ============================
@app.get("/reports/global")
def global_report():
    """Genera estadísticas globales del sistema"""
    users_ref = db.collection("users").stream()
    users = [doc.to_dict() for doc in users_ref]
    total_users = len(users)
    activos = sum(1 for u in users if u.get("status") != "suspended")
    suspendidos = sum(1 for u in users if u.get("status") == "suspended")
    xp_total = sum(u.get("xp", 0) for u in users)
    coins_total = sum(u.get("coins", 0) for u in users)
    top_user = max(users, key=lambda u: u.get("xp", 0), default=None)

    return {
        "total_users": total_users,
        "activos": activos,
        "suspendidos": suspendidos,
        "xp_total": xp_total,
        "coins_total": coins_total,
        "top_user": top_user
    }

# ============================
# ZONA ROJA
# ============================
@app.delete("/danger/delete_all")
def delete_all_users():
    """Eliminar TODOS los usuarios (acción crítica)"""
    users_ref = db.collection("users").stream()
    count = 0
    for docu in users_ref:
        db.collection("users").document(docu.id).delete()
        count += 1
    return {"ok": True, "msg": f"Se eliminaron {count} usuarios"}



@app.post("/users/{user_id}/notify")
def notify_user(user_id: str, data: dict = Body(...)):
    """
    Enviar notificación a un usuario
    data = { "title": "Suspensión", "message": "Tu cuenta fue suspendida", "level": "warning" }
    """
    ref = db.collection("users").document(user_id)
    if not ref.get().exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    notif = {
        "title": data.get("title", "Notificación"),
        "message": data.get("message", ""),
        "level": data.get("level", "info"),  # info, warning, danger
        "timestamp": datetime.utcnow().isoformat(),
        "read": False,
    }
    ref.collection("notifications").add(notif)
    return {"ok": True, "msg": f"Notificación enviada a {user_id}", "notif": notif}


@app.post("/users/notify_all")
def notify_all(data: dict = Body(...)):
    """Enviar notificación a TODOS los usuarios"""
    notif = {
        "title": data.get("title", "Aviso global"),
        "message": data.get("message", ""),
        "level": data.get("level", "info"),
        "timestamp": datetime.utcnow().isoformat(),
        "read": False,
    }
    users = db.collection("users").stream()
    for u in users:
        db.collection("users").document(u.id).collection("notifications").add(notif)
    return {"ok": True, "msg": "Notificación global enviada"}






# ============================
# STRIPE
# ============================
@app.post("/create-payment-intent")
async def create_payment_intent(data: dict):
    """Crear intent de pago en Stripe"""
    try:
        intent = stripe.PaymentIntent.create(
            amount=calculate_amount(data),
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def calculate_amount(data):
    """Convierte packs a precio en centavos"""
    price_map = {
        "coins500": 99,
        "coins1500": 199,
        "coins5000": 499,
        "diam50": 99,
        "diam150": 299,
        "diam500": 799,
    }
    return price_map.get(data.get("id"), 100) * 100
