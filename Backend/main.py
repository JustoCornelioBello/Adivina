from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import stripe
import os
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔒 pon tu dominio en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/create-payment-intent")
async def create_payment_intent(data: dict):
    try:
        intent = stripe.PaymentIntent.create(
            amount=calculate_amount(data),  # 👈 conviértelo a centavos
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )
        return {"clientSecret": intent.client_secret}
    except Exception as e:
        return {"error": str(e)}

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
    return price_map.get(data["id"], 100) * 100
