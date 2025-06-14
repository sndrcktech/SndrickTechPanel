# backend/app/audit.py
from fastapi import APIRouter
import datetime

router = APIRouter()
LOG_PATH = "logs/audit.log"

def log_event(user, action, result="ok"):
    with open(LOG_PATH, "a") as f:
        f.write(f"{datetime.datetime.utcnow().isoformat()} | {user} | {action} | {result}\n")

@router.post("/api/audit")
def audit(user: str, action: str, result: str = "ok"):
    log_event(user, action, result)
    return {"status": "logged"}

@router.get("/api/audit")
def audit_log(lines: int = 100):
    with open(LOG_PATH) as f:
        return {"log": list(f)[-lines:]}
