import requests
from fastapi import APIRouter, Depends, Query, HTTPException
from app.api import deps
from app.core.config import settings

router = APIRouter()

PROM_URL = settings.PROMETHEUS_URL or "http://localhost:9090"

@router.get("/query")
def prometheus_query(
    q: str = Query(..., description="PromQL запрос"),
    current_user=Depends(deps.get_current_active_user)
):
    try:
        resp = requests.get(f"{PROM_URL}/api/v1/query", params={"query": q})
        data = resp.json()
        return data
    except Exception as e:
        raise HTTPException(500, f"Ошибка запроса к Prometheus: {str(e)}")

@router.get("/alerts")
def prometheus_alerts(current_user=Depends(deps.get_current_active_user)):
    try:
        resp = requests.get(f"{PROM_URL}/api/v1/alerts")
        return resp.json()
    except Exception as e:
        raise HTTPException(500, f"Ошибка запроса к Prometheus: {str(e)}")
