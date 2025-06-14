import os
import time
from fastapi import APIRouter, Depends
from typing import Optional
from app.api import deps

ALERT_TEST_LOG = "/var/log/sandricktechpanel/alert_test.log"
os.makedirs(os.path.dirname(ALERT_TEST_LOG), exist_ok=True)

router = APIRouter()

@router.get("/")
def get_alert_test_log(
    event: Optional[str] = None,
    channel: Optional[str] = None,
    user: Optional[str] = None,
    after: Optional[float] = None,
    before: Optional[float] = None,
    limit: int = 100,
    current_user=Depends(deps.get_current_active_superuser)
):
    if not os.path.exists(ALERT_TEST_LOG):
        return []
    res = []
    with open(ALERT_TEST_LOG) as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) < 6:
                continue
            ts, evt, ch, to, params, message = parts
            rec = {
                "ts": float(ts),
                "event": evt,
                "channel": ch,
                "to": to,
                "params": params,
                "message": message
            }
            if event and evt != event:
                continue
            if channel and ch != channel:
                continue
            if after and float(ts) < after:
                continue
            if before and float(ts) > before:
                continue
            res.append(rec)
    res = res[::-1]
    if limit:
        res = res[:limit]
    return res
# ... (предыдущий код)

@router.post("/repeat")
def repeat_alert_test(
    ts: float,
    current_user=Depends(deps.get_current_active_superuser)
):
    if not os.path.exists(ALERT_TEST_LOG):
        raise HTTPException(404, "Журнал не найден")
    with open(ALERT_TEST_LOG) as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) < 6:
                continue
            lts, evt, ch, to, params, message = parts
            if abs(float(lts) - ts) < 1e-4:
                # Повторяем отправку
                from app.api.api_v1.endpoints.alert_test import send_alert_test
                import ast
                try:
                    params_dict = ast.literal_eval(params)
                except Exception:
                    params_dict = {}
                return send_alert_test(evt, ch, params_dict, to, current_user=current_user)
    raise HTTPException(404, "Запись не найдена")

@router.post("/purge")
def purge_alert_test_log(
    before: float,
    current_user=Depends(deps.get_current_active_superuser)
):
    if not os.path.exists(ALERT_TEST_LOG):
        return {"ok": True, "purged": 0}
    lines = []
    purged = 0
    with open(ALERT_TEST_LOG) as f:
        for line in f:
            ts = float(line.strip().split("\t")[0])
            if ts >= before:
                lines.append(line)
            else:
                purged += 1
    with open(ALERT_TEST_LOG, "w") as f:
        f.writelines(lines)
    return {"ok": True, "purged": purged}
