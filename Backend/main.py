from fastapi import FastAPI
from firebase_config import db

app = FastAPI()

@app.get("/users")
def get_users():
    users_ref = db.collection("users").stream()
    users = []
    for doc in users_ref:
        users.append({ "id": doc.id, **doc.to_dict() })
    return users
