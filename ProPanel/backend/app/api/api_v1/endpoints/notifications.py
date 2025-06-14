import os
import json
import time
import requests
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.api import deps
from app.core.config import settings

NOTIFY_CFG = "/etc/sandricktechpanel/notifications.json"
NOTIFY_LOG = "/var/log/sandricktechpanel/notify.log"
os.makedirs(os.path.dirname(NOTIFY_CFG), exist_ok=True)
os.makedirs(os.path.dirname(NOTIFY_LOG), exist_ok=True)

router = APIRouter()

def save_config(cfg):
    with open(NOTIFY_CFG, "w") as f:
        json.dump(cfg, f, indent=2)

def load_config():
    if not os.path.exists(NOTIFY_CFG):
        return {}
    with open(NOTIFY_CFG) as f:
        return json.load(f)

def log_notify(event):
    with open(NOTIFY_LOG, "a") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

def send_telegram(text):
    cfg = load_config().get("telegram", {})
    token = cfg.get("bot_token")
    chat_id = cfg.get("chat_id")
    if not token or not chat_id:
        raise Exception("Не настроен Telegram")
    resp = requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data={"chat_id": chat_id, "text": text}
    )
    log_notify({"ts": time.time(), "type": "telegram", "text": text, "resp": resp.text})
    return resp.ok

# PWA push: требуется внешний push server, пример — если нужно, напиши!

@router.get("/config")
def get_notify_config(current_user=Depends(deps.get_current_active_superuser)):
    return load_config()

@router.post("/config")
def set_notify_config(cfg: dict, current_user=Depends(deps.get_current_active_superuser)):
    save_config(cfg)
    return {"ok": True}

@router.post("/telegram_test")
def telegram_test(
    message: str = "Test SandrickTechPanel alert",
    current_user=Depends(deps.get_current_active_superuser)
):
    send_telegram(message)
    return {"ok": True}

@router.post("/alert")
def push_alert(
    text: str,
    to_telegram: bool = True,
    current_user=Depends(deps.get_current_active_superuser)
):
    # Вызывается из любого места для алертов
    if to_telegram:
        send_telegram(text)
    log_notify({"ts": time.time(), "type": "alert", "text": text})
    return {"ok": True}

@router.get("/log")
def get_notify_log(limit: int = 100, current_user=Depends(deps.get_current_active_superuser)):
    if not os.path.exists(NOTIFY_LOG):
        return []
    lines = open(NOTIFY_LOG).readlines()[-limit:]
    return [json.loads(line) for line in lines[::-1]]
