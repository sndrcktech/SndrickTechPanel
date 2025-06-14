import psutil
import platform
import time
from fastapi import APIRouter, Depends
from app.api import deps

router = APIRouter()

def get_uptime():
    return int(time.time() - psutil.boot_time())

@router.get("/system")
def get_system_stats(current_user=Depends(deps.get_current_active_user)):
    return {
        "hostname": platform.node(),
        "os": platform.system() + " " + platform.release(),
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "cpu_cores": psutil.cpu_count(),
        "ram_total": psutil.virtual_memory().total,
        "ram_used": psutil.virtual_memory().used,
        "ram_percent": psutil.virtual_memory().percent,
        "disk_total": psutil.disk_usage("/").total,
        "disk_used": psutil.disk_usage("/").used,
        "disk_percent": psutil.disk_usage("/").percent,
        "uptime": get_uptime(),
    }
