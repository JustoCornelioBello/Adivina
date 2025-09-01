from firebase_admin_init import db
from models import User
import datetime

COLLECTION = "users"

def get_all_users():
    docs = db.collection(COLLECTION).stream()
    return [ { "id": doc.id, **doc.to_dict() } for doc in docs ]

def get_user(user_id: str):
    doc = db.collection(COLLECTION).document(user_id).get()
    if doc.exists:
        return { "id": doc.id, **doc.to_dict() }
    return None

def create_user(user: User):
    ref = db.collection(COLLECTION).document()
    user_dict = user.dict()
    user_dict["lastLogin"] = datetime.datetime.utcnow()
    ref.set(user_dict)
    return { "id": ref.id, **user_dict }

def update_user(user_id: str, user: User):
    ref = db.collection(COLLECTION).document(user_id)
    ref.update(user.dict(exclude_unset=True))
    return get_user(user_id)

def delete_user(user_id: str):
    db.collection(COLLECTION).document(user_id).delete()
    return {"status": "deleted"}
