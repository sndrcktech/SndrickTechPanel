import subprocess
import requests
from fastapi import APIRouter, Depends
from app.api import deps

GITHUB_RELEASES_URL = "https://api.github.com/repos/yourorg/sandricktechpanel/releases/latest"
LOCAL_VERSION_FILE = "/opt/sandricktechpanel/VERSION"

router = APIRouter()

def get_local_version():
    try:
        with open(LOCAL_VERSION_FILE) as f:
            return f.read().strip()
    except:
        return "0.0.0"

@router.get("/check")
def check_update(current_user=Depends(deps.get_current_active_superuser)):
    local = get_local_version()
    try:
        resp = requests.get(GITHUB_RELEASES_URL, timeout=5)
        latest = resp.json().get("tag_name") or "0.0.0"
        url = resp.json().get("html_url", "")
        return {
            "current": local,
            "latest": latest,
            "is_update": local != latest,
            "url": url,
        }
    except Exception as e:
        return {"current": local, "latest": local, "is_update": False, "error": str(e)}

@router.post("/upgrade")
def do_upgrade(current_user=Depends(deps.get_current_active_superuser)):
    # Здесь — ваш скрипт обновления (git pull, deb install, скачивание архива и т.д.)
    try:
        subprocess.run(["/opt/sandricktechpanel/upgrade.sh"], check=True)
        return {"ok": True}
    except subprocess.CalledProcessError as e:
        return {"ok": False, "error": str(e)}
