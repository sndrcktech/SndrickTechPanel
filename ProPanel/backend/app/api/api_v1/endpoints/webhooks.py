import os
import json
import time
import requests
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api import deps

WEBHOOKS_FILE = "/etc/sandricktechpanel/webhooks.json"
LOG_FILE = "/var/log/sandricktechpanel/webhook.log"
os.makedirs(os.path.dirname(WEBHOOKS_FILE), exist_ok=True)

router = APIRouter()

def load_webhooks():
    if not os.path.exists(WEBHOOKS_FILE):
        return []
    with open(WEBHOOKS_FILE) as f:
        return json.load(f)

def save_webhooks(data):
    with open(WEBHOOKS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def log_event(event):
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

@router.get("/")
def get_webhooks(current_user=Depends(deps.get_current_active_superuser)):
    return load_webhooks()

@router.post("/add")
def add_webhook(data: dict, current_user=Depends(deps.get_current_active_superuser)):
    whs = load_webhooks()
    whs.append(data)
    save_webhooks(whs)
    return {"ok": True}

@router.post("/delete")
def delete_webhook(index: int, current_user=Depends(deps.get_current_active_superuser)):
    whs = load_webhooks()
    if index < 0 or index >= len(whs):
        raise HTTPException(400, "Bad index")
    whs.pop(index)
    save_webhooks(whs)
    return {"ok": True}

@router.post("/send")
def send_webhook(index: int, payload: dict, current_user=Depends(deps.get_current_active_superuser)):
    whs = load_webhooks()
    if index < 0 or index >= len(whs):
        raise HTTPException(400, "Bad index")
    url = whs[index].get("url")
    method = whs[index].get("method", "POST").upper()
    headers = whs[index].get("headers", {})
    try:
        resp = requests.request(method, url, json=payload, headers=headers, timeout=6)
        log_event({"ts": time.time(), "url": url, "payload": payload, "resp": resp.text[:500]})
        return {"status": resp.status_code, "response": resp.text}
    except Exception as e:
        log_event({"ts": time.time(), "url": u_
