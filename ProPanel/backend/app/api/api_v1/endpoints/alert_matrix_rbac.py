import os
import json
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List, Optional
from app.api import deps

MATRIX_RBAC_FILE = "/etc/sandricktechpanel/alert_matrix_rbac.json"
os.makedirs(os.path.dirname(MATRIX_RBAC_FILE), exist_ok=True)

router = APIRouter()

DEFAULT_MATRIX = {
    "global": {
        "cert_expiry": ["email"],
        "backup_fail": ["telegram", "push"],
        "system_critical": ["email", "telegram", "push"],
    },
    "users": {},
    "groups": {},
    "roles": {}
}

def load_matrix():
    if not os.path.exists(MATRIX_RBAC_FILE):
        return DEFAULT_MATRIX.copy()
    with open(MATRIX_RBAC_FILE) as f:
        return json.load(f)

def save_matrix(matrix):
    with open(MATRIX_RBAC_FILE, "w") as f:
        json.dump(matrix, f, indent=2)

@router.get("/")
def get_alert_matrix_rbac(current_user=Depends(deps.get_current_active_superuser)):
    return load_matrix()

@router.post("/")
def set_alert_matrix_rbac(matrix: dict, current_user=Depends(deps.get_current_active_superuser)):
    save_matrix(matrix)
    return {"ok": True}

@router.post("/mute")
def mute_alert(
    user: Optional[str] = None,
    group: Optional[str] = None,
    role: Optional[str] = None,
    event: Optional[str] = None,
    channel: Optional[str] = None,
    until: Optional[float] = None,  # timestamp
    current_user=Depends(deps.get_current_active_superuser)
):
    matrix = load_matrix()
    mute = {"event": event, "channel": channel, "until": until}
    target = None
    if user:
        target = matrix.setdefault("users", {}).setdefault(user, {})
    elif group:
        target = matrix.setdefault("groups", {}).setdefault(group, {})
    elif role:
        target = matrix.setdefault("roles", {}).setdefault(role, {})
    else:
        raise HTTPException(400, "Не указана цель mute")
    muted = target.setdefault("mute", [])
    muted.append(mute)
    save_matrix(matrix)
    return {"ok": True}

@router.post("/unmute")
def unmute_alert(
    user: Optional[str] = None,
    group: Optional[str] = None,
    role: Optional[str] = None,
    event: Optional[str] = None,
    channel: Optional[str] = None,
    current_user=Depends(deps.get_current_active_superuser)
):
    matrix = load_matrix()
    target = None
    if user:
        target = matrix.setdefault("users", {}).setdefault(user, {})
    elif group:
        target = matrix.setdefault("groups", {}).setdefault(group, {})
    elif role:
        target = matrix.setdefault("roles", {}).setdefault(role, {})
    else:
        raise HTTPException(400, "Не указана цель unmute")
    mutes = target.get("mute", [])
    mutes = [m for m in mutes if not (m.get("event") == event and m.get("channel") == channel)]
    target["mute"] = mutes
    save_matrix(matrix)
    return {"ok": True}
