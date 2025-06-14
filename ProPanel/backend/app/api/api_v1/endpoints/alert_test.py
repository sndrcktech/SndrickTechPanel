import time
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Optional
from app.api import deps
from app.api.api_v1.endpoints.alert_templates import load_templates

ALERT_TEST_LOG = "/var/log/sandricktechpanel/alert_test.log"
try:
    import os
    os.makedirs("/var/log/sandricktechpanel", exist_ok=True)
except Exception:
    pass

router = APIRouter()

def render_alert(event: str, channel: str, **kwargs):
    templates = load_templates()
    tpl = templates.get(event, {}).get(channel)
    if tpl:
        try:
            return tpl.format(**kwargs)
        except Exception as e:
            return f"Ошибка шаблона: {e}"
    return f"{event}: {kwargs}"

def log_test(event, channel, message, to, params):
    with open(ALERT_TEST_LOG, "a") as f:
        f.write(f"{time.time()}\t{event}\t{channel}\t{to}\t{params}\t{message}\n")

@router.post("/send")
def send_alert_test(
    event: str,
    channel: str,
    params: Dict,
    to: Optional[str] = None,
    current_user=Depends(deps.get_current_active_superuser)
):
    message = render_alert(event, channel, **params)
    # Тут вызови нужный канал отправки (email, telegram, push). Пример:
    if channel == "telegram":
        from app.api.api_v1.endpoints.notifications import send_telegram
        send_telegram(message)
    elif channel == "email":
        # Включи свою функцию send_email_alert(message, to)
        pass
    elif channel == "push":
        # Можно добавить webpush тест (или return message для фронта)
        pass
    log_test(event, channel, message, to, params)
    return {"ok": True, "message": message}
