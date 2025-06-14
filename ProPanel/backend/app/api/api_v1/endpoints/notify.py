from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.telegram import send_telegram_message
from app.api import deps

router = APIRouter()

class Notification(BaseModel):
    message: str

@router.post("/")
def notify_admin(
    body: Notification,
    current_user=Depends(deps.get_current_active_superuser)
):
    send_telegram_message(f"[SandrickTechPanel]\n{body.message}")
    return {"sent": True}
