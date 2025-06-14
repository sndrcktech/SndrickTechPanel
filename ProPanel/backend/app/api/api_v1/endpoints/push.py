from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.api import deps
from pywebpush import webpush, WebPushException
import json, os

router = APIRouter()

PUSH_SUBS_FILE = "/var/lib/sandricktechpanel/push_subs.json"
VAPID_PRIVATE_KEY = os.environ.get("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.environ.get("VAPID_PUBLIC_KEY")

def load_subs():
    if not os.path.exists(PUSH_SUBS_FILE):
        return []
    with open(PUSH_SUBS_FILE) as f:
        return json.load(f)

def save_subs(subs):
    with open(PUSH_SUBS_FILE, "w") as f:
        json.dump(subs, f)

@router.get("/vapid")
def get_vapid_keys():
    return {"publicKey": VAPID_PUBLIC_KEY}

@router.post("/subscribe")
def push_subscribe(sub: dict, current_user=Depends(deps.get_current_active_user)):
    subs = load_subs()
    if sub not in subs:
        subs.append(sub)
        save_subs(subs)
    return {"ok": True}

@router.post("/send")
def push_send(message: str, current_user=Depends(deps.get_current_active_superuser)):
    subs = load_subs()
    failed = 0
    for sub in subs:
        try:
            webpush(
                subscription_info=sub,
                data=message,
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims={"sub": "mailto:admin@example.com"}
            )
        except WebPushException:
            failed += 1
    return {"sent": len(subs) - failed, "failed": failed}
