import subprocess
from fastapi import APIRouter, Depends, Query
from typing import Dict
from app.api import deps

router = APIRouter()

SUPPORTED_LOGS = {
    "nginx": "nginx",
    "postfix": "postfix",
    "dovecot": "dovecot",
    "docker": "docker",
    "panel": "sandricktechpanel",  # или название твоей службы
    "system": "syslog",
}

def tail_log(service: str, lines: int = 100) -> str:
    if service == "syslog":
        cmd = ["tail", "-n", str(lines), "/var/log/syslog"]
    else:
        cmd = [
            "journalctl",
            "-u", service,
            "--no-pager",
            "-n", str(lines),
            "--output", "short"
        ]
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout
    except Exception as e:
        return f"Ошибка: {str(e)}"

@router.get("/")
def get_log(
    name: str = Query(..., description="Имя сервиса (nginx, postfix, dovecot, docker, panel, system)"),
    lines: int = Query(100, ge=10, le=1000, description="Количество строк"),
    current_user=Depends(deps.get_current_active_user)
) -> Dict:
    svc = SUPPORTED_LOGS.get(name)
    if not svc:
        return {"error": "Unknown service"}
    log = tail_log(svc, lines=lines)
    return {"log": log}
