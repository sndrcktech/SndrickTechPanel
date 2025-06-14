import os
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from app.api import deps

router = APIRouter()
THEME_DIR = "/var/lib/sandricktechpanel/theme"
os.makedirs(THEME_DIR, exist_ok=True)

@router.post("/logo")
def upload_logo(
    file: UploadFile = File(...),
    current_user=Depends(deps.get_current_active_superuser)
):
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".svg")):
        raise HTTPException(400, "Поддерживаются только png/jpg/svg")
    dest = os.path.join(THEME_DIR, "logo" + os.path.splitext(file.filename)[1])
    with open(dest, "wb") as out:
        out.write(file.file.read())
    return {"status": "uploaded"}

@router.get("/logo")
def get_logo():
    # Ищем логотип любого типа
    for ext in [".png", ".jpg", ".jpeg", ".svg"]:
        f = os.path.join(THEME_DIR, "logo" + ext)
        if os.path.exists(f):
            return FileResponse(f)
    return {"error": "Not set"}

@router.post("/theme")
def set_theme(
    theme: str,
    current_user=Depends(deps.get_current_active_user)
):
    # Можно хранить в базе или в файле — тут просто echo в файл
    with open(os.path.join(THEME_DIR, "theme.txt"), "w") as f:
        f.write(theme)
    return {"theme": theme}

@router.get("/theme")
def get_theme():
    fpath = os.path.join(THEME_DIR, "theme.txt")
    if os.path.exists(fpath):
        with open(fpath) as f:
            return {"theme": f.read().strip()}
    return {"theme": "light"}
