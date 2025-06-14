import os
import json
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps

SETTINGS_FILE = "/etc/sandricktechpanel/settings.json"
os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)

router = APIRouter()

DEFAULTS = {
    "panel_name": "SandrickTechPanel",
    "timezone": "Europe/Moscow",
    "admin_email": "",
    "smtp_host": "",
    "smtp_port": 587,
    "smtp_user": "",
    "smtp_pass": "",
    "domains": [],
}

def load_settings():
    if not os.path.exists(SETTINGS_FILE):
        return DEFAULTS.copy()
    with open(SETTINGS_FILE) as f:
        try:
            return json.load(f)
        except Exception:
            return DEFAULTS.copy()

def save_settings(data):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(data, f, indent=2)

@router.get("/")
def get_settings(current_user=Depends(deps.get_current_active_superuser)):
    return load_settings()

@router.post("/")
def set_settings(data: dict, current_user=Depends(deps.get_current_active_superuser)):
    s = load_settings()
    s.update(data)
    save_settings(s)
    return s
