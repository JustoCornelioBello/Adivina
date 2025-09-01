import firebase_admin
from firebase_admin import credentials, firestore

# Cargar credenciales del service account
cred = credentials.Certificate("serviceAccountKey.json")

# Inicializar Firebase si no está inicializado
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()
