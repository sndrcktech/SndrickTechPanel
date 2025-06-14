import os
import json
import time
from fastapi import APIRouter, Depends, Request, HTTPException
from typing import List, Dict, Optional
from app.api import deps
from pywebpush import webpush, WebPushException

SUBS_FILE = "/etc/sandricktechpanel/webpush_subs.json"
VAPID_PRIVATE = "/etc/sandricktechpanel/vapid_private.pem"
VAPID_PUBLIC = "/etc/sandricktechpanel/vapid_public.pem"

os.makedirs(os.path.dirname(SUBS_FILE), exist_ok=True)

router = APIRouter()

def load_subs():
    if not os.path.exists(SUBS_FILE):
        return []
    with open(SUBS_FILE) as f:
        return json.load(f)

def save_subs(subs):
    with open(SUBS_FILE, "w") as f:
        json.dump(subs, f, indent=2)

def get_vapid_keys():
    priv = open(VAPID_PRIVATE).read()
    pub = open(VAPID_PUBLIC).read()
    return priv, pub

@router.get("/public_key")
def get_public_key():
    pub = open(VAPID_PUBLIC).read()
    # Для JS нужен base64 без PEM обёртки
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.backends import default_backend
    key = serialization.load_pem_public_key(pub.encode(), backend=default_backend())
    return {"publicKey": key.public_numbers().encode_point().hex()}

@router.post("/subscribe")
def subscribe_webpush(sub: dict, current_user=Depends(deps.get_current_active_user)):
    subs = load_subs()
    # Можно сделать уникальным по endpoint
    for s in subs:
        if s["endpoint"] == sub["endpoint"]:
            return {"ok": True}
    subs.append(sub)
    save_subs(subs)
    return {"ok": True}

@router.post("/unsubscribe")
def unsubscribe_webpush(sub: dict, current_user=Depends(deps.get_current_active_user)):
    subs = load_subs()
    subs = [s for s in subs if s["endpoint"] != sub["endpoint"]]
    save_subs(subs)
    return {"ok": True}

@router.post("/send")
def send_webpush(
    message: str,
    user_endpoint: Optional[str] = None,  # Если не указан — всем
    current_user=Depends(deps.get_current_active_superuser)
):
    subs = load_subs()
    priv, pub = get_vapid_keys()
    sent = 0
    for s in subs:
        if user_endpoint and s["endpoint"] != user_endpoint:
            continue
        try:
            webpush(
                subscription_info=s,
                data=message,
                vapid_private_key=priv,
                vapid_claims={"sub": "mailto:admin@example.com"}
            )
            sent += 1
        except WebPushException as e:
            print(f"WebPush error: {e}")
    return {"ok": True, "sent": sent}
