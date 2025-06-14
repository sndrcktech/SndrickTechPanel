import os
import json
import time
from fastapi import APIRouter, Depends
from typing import List, Optional
from app.api import deps

AUDIT_LOG_FILE = "/var/log/sandricktechpanel/backup_audit.log"
os.makedirs(os.path.dirname(AUDIT_LOG_FILE), exist_ok=True)
router = APIRouter()

def log_backup(event: dict):
    event['ts'] = time.time()
    with open(AUDIT_LOG_FILE, "a") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

@router.get("/")
def get_audit_log(
    user: Optional[str] = None,
    action: Optional[str] = None,
    after: Optional[float] = None,
    before: Optional[float] = None,
    current_user=Depends(deps.get_current_active_superuser)
):
    if not os.path.exists(AUDIT_LOG_FILE):
        return []
    logs = []
    with open(AUDIT_LOG_FILE) as f:
        for line in f:
            try:
                event = json.loads(line)
                if user and event.get("user") != user:
                    continue
                if action and event.get("action") != action:
                    continue
                if after and event.get("ts", 0) < after:
                    continue
                if before and event.get("ts", 0) > before:
                    continue
                logs.append(event)
            except Exception:
                continue
    return logs[::-1]  # newest first
