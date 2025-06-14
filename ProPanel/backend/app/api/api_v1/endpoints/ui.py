import os
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from app.api import deps

LOGO_DIR = "/var/lib/sandricktechpanel"
LOGO_PATH = os.path.join(LOGO_DIR, "logo.png")
os.makedirs(LOGO_DIR, exist_ok=True)

router = APIRouter()

@router.post("/logo")
def upload_logo(
    file: UploadFile = File(...),
    current_user=Depends(deps.get_current_active_superuser),
):
    if file.content_type not in ["image/png", "image/jpeg"]:
        raise HTTPException(400, detail="Только PNG/JPG логотипы")
    with open(LOGO_PATH, "wb") as f:
        f.write(file.file.read())
    return {"uploaded": True}

@router.get("/logo")
def get_logo():
    if not os.path.exists(LOGO_PATH):
        # Вернуть дефолтный логотип из assets
        return FileResponse("assets/default_logo.png")
    return FileRes
