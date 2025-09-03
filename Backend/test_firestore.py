from firebase_config import db

def test_firestore():
    # Referencia a la colección "test"
    doc_ref = db.collection("test").document("ping")

    # Guardamos un documento
    doc_ref.set({
        "status": "ok",
        "message": "Conexión Firestore funcionando 🚀"
    })

    # Lo leemos de nuevo
    doc = doc_ref.get()
    if doc.exists:
        print("✅ Firestore dice:", doc.to_dict())
    else:
        print("❌ No se encontró el documento.")

if __name__ == "__main__":
    test_firestore()
