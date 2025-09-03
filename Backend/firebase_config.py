import firebase_admin
from firebase_admin import credentials, firestore

# 🔹 Cargar credenciales desde el archivo descargado
cred = credentials.Certificate("serviceAccountKey.json")

# 🔹 Inicializar Firebase si no está inicializado
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# 🔹 Cliente de Firestore
db = firestore.client()

print("✅ Firebase conectado correctamente")
