import os
import json
import time
from fastapi import APIRouter, Depends, Request
from typing import List
from app.api import deps

AUDIT_LOG_FILE = "/var/log/sandricktechpanel/audit.log"
os.makedirs(os.path.dirname(AUDIT_LOG_FILE), exist_ok=True)

router = APIRouter()

def log_audit(event: dict):
    with open(AUDIT_LOG_FILE, "a") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

@router.get("/")
def get_audit(
    user: str = "",
    action: str = "",
    after: float = 0,
    before: float = time.time(),
    current_user=Depends(deps.get_current_active_superuser)
):
    logs = []
    if not os.path.exists(AUDIT_LOG_FILE):
        return []
    with open(AUDIT_LOG_FILE) as f:
        for line in f:
            try:
                event = json.loads(line)
                if user and event.get("user") != user:
                    continue
                if action and event.get("action") != action:
                    continue
                ts = event.get("ts", 0)
                if ts < after or ts > before:
                    continue
                logs.append(event)
            except Exception:
                continue
    return logs[::-1]  # newest first

# Пример вызова аудита внутри действий API:
# log_audit({"ts": time.time(), "user": user.username, "action": "create_user", "details": {"username": ...}})
