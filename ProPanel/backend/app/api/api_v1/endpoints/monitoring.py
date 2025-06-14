import os
import json
import time
import smtplib
from email.mime.text import MIMEText
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.api import deps
from app.core.config import settings

MONITOR_FILE = "/var/log/sandricktechpanel/monitor_state.json"
ALERTS_FILE = "/var/log/sandricktechpanel/monitor_alerts.log"
os.makedirs(os.path.dirname(MONITOR_FILE), exist_ok=True)

router = APIRouter()

def save_monitor_state(state):
    with open(MONITOR_FILE, "w") as f:
        json.dump(state, f, indent=2)

def load_monitor_state():
    if not os.path.exists(MONITOR_FILE):
        return {}
    with open(MONITOR_FILE) as f:
        return json.load(f)

def log_alert(event):
    with open(ALERTS_FILE, "a") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

def send_email_alert(subject, body, to=None):
    if not to:
        to = settings.ALERT_EMAIL
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM or "panel@example.com"
    msg["To"] = to
    s = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
    s.starttls()
    s.login(settings.SMTP_USER, settings.SMTP_PASS)
    s.sendmail(msg["From"], [to], msg.as_string())
    s.quit()

# TODO: Добавить Telegram, Webhook/PWA — если нужно, дам пример

@router.get("/status")
def monitor_status(current_user=Depends(deps.get_current_active_superuser)):
    return load_monitor_state()

@router.post("/push")
def push_status(
    name: str,
    status: str,
    level: str = "info",
    details: Optional[dict] = None,
    alert_email: Optional[str] = None,
    current_user=Depends(deps.get_current_active_superuser)
):
    state = load_monitor_state()
    state[name] = {
        "status": status,
        "level": level,
        "ts": time.time(),
        "details": details,
    }
    save_monitor_state(state)
    # Если критический уровень — отправить оповещение
    if level in ["critical", "error"]:
        msg = f"Мониторинг: {name}\nСтатус: {status}\nДетали: {json.dumps(details, ensure_ascii=False)}"
        send_email_alert(f"[ALERT] {name} - {status}", msg, alert_email)
        log_alert({"ts": time.time(), "name": name, "status": status, "level": level, "details": details})
    return {"ok": True}

@router.get("/alerts")
def get_alerts(
    since: float = 0,
    current_user=Depends(deps.get_current_active_superuser)
):
    if not os.path.exists(ALERTS_FILE):
        return []
    res = []
    with open(ALERTS_FILE) as f:
        for line in f:
            event = json.loads(line)
            if event["ts"] > since:
                res.append(event)
    return res[::-1]
