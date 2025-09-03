# ============================
# main.py - Backend FastAPI
# ============================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import stripe
import os
from dotenv import load_dotenv
from firebase_config import db   # 🔥 conexión a Firebase
from pydantic import BaseModel

# ============================
# 1. Variables de entorno
# ============================
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# ============================
# 2. Inicializar FastAPI
# ============================
app = FastAPI(title="Adivina Backend", version="1.0.0")

# Middleware CORS (para que frontend pueda llamar al backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👈 en producción pon tu dominio (ej: https://midominio.com)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# 3. Modelos
# ============================
class UserUpdate(BaseModel):
    username: str | None = None
    role: str | None = None
    xp: int | None = None
    coins: int | None = None
    streak: int | None = None

# ============================
# 4. Rutas de prueba
# ============================
@app.get("/")
def root():
    """Ruta base para probar el servidor"""
    return {"msg": "Servidor corriendo 🚀"}

# ============================
# 5. CRUD - Usuarios Firestore
# ============================

@app.get("/users")
def get_users():
    """Obtener todos los usuarios de Firestore"""
    users_ref = db.collection("users").stream()
    users = []
    for doc in users_ref:
        data = doc.to_dict()
        users.append({
            "id": doc.id,
            "username": data.get("username", ""),
            "role": data.get("role", "jugador"),
            "xp": data.get("xp", 0),
            "coins": data.get("coins", 0),
            "streak": data.get("streak", 0),
            "lastLogin": data.get("lastLogin", None)
        })
    return users


@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    """Eliminar un usuario de Firestore"""
    user_ref = db.collection("users").document(user_id)
    if not user_ref.get().exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user_ref.delete()
    return {"ok": True, "msg": f"Usuario {user_id} eliminado."}


@app.put("/users/{user_id}")
def update_user(user_id: str, data: UserUpdate):
    """Actualizar datos de un usuario"""
    user_ref = db.collection("users").document(user_id)
    snap = user_ref.get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")

    user_ref.update(update_data)
    return {"ok": True, "msg": f"Usuario {user_id} actualizado.", "data": update_data}

# ============================
# 6. Stripe - Pagos
# ============================

@app.post("/create-payment-intent")
async def create_payment_intent(data: dict):
    """Crear intent de pago en Stripe"""
    try:
        intent = stripe.PaymentIntent.create(
            amount=calculate_amount(data),  # en centavos
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def calculate_amount(data):
    """Convierte packs a precio en centavos"""
    price_map = {
        "coins500": 99,   # $0.99
        "coins1500": 199, # $1.99
        "coins5000": 499, # $4.99
        "diam50": 99,
        "diam150": 299,
        "diam500": 799,
    }
    return price_map.get(data.get("id"), 100) * 100
