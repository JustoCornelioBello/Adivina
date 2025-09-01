from pydantic import BaseModel
from typing import Optional
import datetime

class User(BaseModel):
    id: Optional[str]  # Firestore lo genera, pero también podemos usarlo como campo
    username: str
    role: str = "jugador"
    xp: int = 0
    coins: int = 0
    streak: int = 0
    lastLogin: Optional[datetime.datetime] = None
