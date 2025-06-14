import os
import json
from fastapi import APIRouter, Depends
from typing import Dict
from app.api import deps

TEMPLATES_FILE = "/etc/sandricktechpanel/alert_templates.json"
os.makedirs(os.path.dirname(TEMPLATES_FILE), exist_ok=True)

router = APIRouter()

DEFAULT_TEMPLATES = {
    "cert_expiry": {
        "email": "Уважаемый {user}, сертификат для {domain} истекает {expires}.",
        "telegram": "⚠️ Сертификат для {domain} истекает {expires}!",
        "push": "Сертификат {domain} скоро истечёт.",
    },
    "backup_fail": {
        "email": "Резервное копирование не удалось: {details}",
        "telegram": "❗ Backup fail: {details}",
        "push": "Ошибка backup: {details}",
    },
    "login_failed": {
        "push": "Неудачная попытка входа: {user} ({ip})"
    }
}

def load_templates():
    if not os.path.exists(TEMPLATES_FILE):
        return DEFAULT_TEMPLATES.copy()
    with open(TEMPLATES_FILE) as f:
        return json.load(f)

def save_templates(templates):
    with open(TEMPLATES_FILE, "w") as f:
        json.dump(templates, f, indent=2, ensure_ascii=False)

@router.get("/")
def get_alert_templates(current_user=Depends(deps.get_current_active_superuser)):
    return load_templates()

@router.post("/")
def set_alert_templates(templates: Dict, current_user=Depends(deps.get_current_active_superuser)):
    save_templates(templates)
    return {"ok": True}
