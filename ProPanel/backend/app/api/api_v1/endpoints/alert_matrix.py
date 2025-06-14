import os
import json
from fastapi import APIRouter, Depends
from typing import Dict, List
from app.api import deps

MATRIX_FILE = "/etc/sandricktechpanel/alert_matrix.json"
os.makedirs(os.path.dirname(MATRIX_FILE), exist_ok=True)

router = APIRouter()

DEFAULT_MATRIX = {
    "cert_expiry": ["email", "telegram", "push"],
    "backup_fail": ["email", "telegram"],
    "backup_ok": [],
    "login_failed": ["push"],
    "system_critical": ["email", "telegram", "push"],
    "vpn_revoke": ["push"],
    # ... любые события
}

def load_matrix():
    if not os.path.exists(MATRIX_FILE):
        return DEFAULT_MATRIX.copy()
    with open(MATRIX_FILE) as f:
        return json.load(f)

def save_matrix(matrix):
    with open(MATRIX_FILE, "w") as f:
        json.dump(matrix, f, indent=2)

@router.get("/")
def get_alert_matrix(current_user=Depends(deps.get_current_active_superuser)):
    return load_matrix()

@router.post("/")
def set_alert_matrix(matrix: Dict[str, List[str]], current_user=Depends(deps.get_current_active_superuser)):
    save_matrix(matrix)
    return {"ok": True}
