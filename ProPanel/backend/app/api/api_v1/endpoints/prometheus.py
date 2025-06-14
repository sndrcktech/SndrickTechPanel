import requests
from fastapi import APIRouter, Depends, Query
from app.api import deps
from app.core.config import settings

router = APIRouter()

PROMETHEUS_URL = getattr(settings, "PROMETHEUS_URL", "http://localhost:9090")
ALERTMANAGER_URL = getattr(settings, "ALERTMANAGER_URL", "http://localhost:9093")

@router.get("/query")
def prometheus_query(
    query: str = Query(..., description="PromQL запрос"),
    current_user=Depends(deps.get_current_active_user)
):
    resp = requests.get(f"{PROMETHEUS_URL}/api/v1/query", params={"query": query})
    return resp.json()

@router.get("/alerts")
def prometheus_alerts(
    current_user=Depends(deps.get_current_active_user)
):
    resp = requests.get(f"{ALERTMANAGER_URL}/api/v2/alerts")
    return resp.json()
