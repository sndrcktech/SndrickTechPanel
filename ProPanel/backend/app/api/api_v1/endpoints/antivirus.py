import os
import subprocess
import time
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api import deps

AV_LOG_DIR = "/var/log/sandricktechpanel/antivirus"
os.makedirs(AV_LOG_DIR, exist_ok=True)

router = APIRouter()

@router.get("/history", response_model=List[str])
def av_history(current_user=Depends(deps.get_current_active_superuser)):
    return sorted(os.listdir(AV_LOG_DIR))

@router.post("/scan")
def av_scan(
    path: str = "/",
    engine: str = "clamav",
    current_user=Depends(deps.get_current_active_superuser)
):
    ts = time.strftime("%Y%m%d-%H%M%S")
    out_file = os.path.join(AV_LOG_DIR, f"{engine}_{ts}.log")
    try:
        if engine == "clamav":
            cmd = ["clamscan", "-r", "-i", path]
        elif engine == "maldet":
            cmd = ["maldet", "-a", path]
        else:
            raise Exception("Unknown engine")
        with open(out_file, "w") as f:
            subprocess.run(cmd, stdout=f, stderr=subprocess.STDOUT, check=True)
        return {"ok": True, "file": out_file}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@router.get("/report")
def av_report(filename: str, current_user=Depends(deps.get_current_active_superuser)):
    fpath = os.path.join(AV_LOG_DIR, filename)
    if not os.path.exists(fpath):
        raise HTTPException(404, "Not found")
    with open(fpath) as f:
        return {"report": f.read()}
