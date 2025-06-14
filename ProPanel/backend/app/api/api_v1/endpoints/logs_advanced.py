import os
from fastapi import APIRouter, Depends, Query
from typing import List, Dict, Optional
from app.api import deps

router = APIRouter()

LOG_FILES = {
    "panel": "/var/log/sandricktechpanel.log",
    "syslog": "/var/log/syslog",
    "auth": "/var/log/auth.log",
    "nginx": "/var/log/nginx/access.log",
    "nginx_error": "/var/log/nginx/error.log",
    # Добавь или подмени свои пути, если нужно
}

@router.get("/list", response_model=List[str])
def list_logs(current_user=Depends(deps.get_current_active_superuser)):
    return list(LOG_FILES.keys())

@router.get("/tail")
def tail_log(
    log: str = Query(..., description="Ключ лог-файла: panel/syslog/nginx/auth/..."),
    lines: int = Query(200, ge=10, le=2000),
    filter: Optional[str] = Query(None, description="Фильтр по ключевому слову"),
    current_user=Depends(deps.get_current_active_superuser)
):
    path = LOG_FILES.get(log)
    if not path or not os.path.exists(path):
        return {"error": "Лог не найден"}
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        all_lines = f.readlines()
    # Если фильтр задан — ищем по нему
    if filter:
        all_lines = [l for l in all_lines if filter.lower() in l.lower()]
    lines_to_show = all_lines[-lines:]
    return {
        "log": log,
        "lines": lines_to_show,
        "count": len(all_lines),
        "shown": len(lines_to_show),
    }
