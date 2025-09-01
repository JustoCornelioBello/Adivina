import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth

# 🔹 Cargar .env
load_dotenv()

firebase_project_id = os.getenv("FIREBASE_PROJECT_ID")
private_key_id = os.getenv("FIREBASE_PRIVATE_KEY_ID")
private_key = os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n")  # 👈 importante
client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
client_id = os.getenv("FIREBASE_CLIENT_ID")
auth_uri = os.getenv("FIREBASE_AUTH_URI")
token_uri = os.getenv("FIREBASE_TOKEN_URI")
auth_provider_cert_url = os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL")
client_cert_url = os.getenv("FIREBASE_CLIENT_CERT_URL")

# 🔹 Credenciales dinámicas
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": firebase_project_id,
    "private_key_id": private_key_id,
    "private_key": private_key,
    "client_email": client_email,
    "client_id": client_id,
    "auth_uri": auth_uri,
    "token_uri": token_uri,
    "auth_provider_x509_cert_url": auth_provider_cert_url,
    "client_x509_cert_url": client_cert_url,
})

# 🔹 Inicializar Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# 🔹 Firestore
db = firestore.client()
