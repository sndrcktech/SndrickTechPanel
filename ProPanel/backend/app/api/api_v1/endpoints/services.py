import subprocess
from fastapi import APIRouter, Depends
from typing import List, Dict
from app.api import deps
from app.core.telegram import send_telegram_message


router = APIRouter()

SYSTEM_SERVICES = [
    "nginx",
    "postgresql",
    "docker",
    "postfix",
    "dovecot",
    # Добавь сюда любые другие сервисы, которые нужны в панели
]

def check_service_status(service: str) -> Dict:
    try:
        result = subprocess.run(
            ["systemctl", "is-active", service],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        active = result.stdout.strip() == "active"
    except Exception as e:
        active = False
    return {"name": service, "active": active}

@router.get("/", response_model=List[Dict])
def list_services(current_user=Depends(deps.get_current_active_user)):
    return [check_service_status(s) for s in SYSTEM_SERVICES]

@router.post("/restart/{service_name}")
def restart_service(service_name: str, current_user=Depends(deps.get_current_active_superuser)):

    if service_name not in SYSTEM_SERVICES:
        return {"error": "Unknown service"}
    try:
        subprocess.run(["systemctl", "restart", service_name], check=True)
        # Внутри restart_service:
        send_telegram_message(f"Сервис {service_name} был перезапущен пользователем {current_user.email}")
        return {"status": "restarted"}
    except Exception as e:
        return {"error": str(e)}
