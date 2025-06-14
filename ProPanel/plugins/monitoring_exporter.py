# plugins/monitoring_exporter.py

from fastapi import APIRouter, Response

router = APIRouter()

@router.get("/metrics")
def metrics():
    # Пример, расширить реальными метриками
    return Response(
        "sandrick_panel_uptime_seconds 10240\nsandrick_panel_failover_count 3\n",
        media_type="text/plain"
    )
