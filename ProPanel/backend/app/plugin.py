# backend/app/plugin.py
from fastapi import APIRouter
import importlib
import glob

router = APIRouter()
PLUGINS_DIR = "plugins"

@router.get("/api/plugins")
def list_plugins():
    return [p for p in glob.glob(f"{PLUGINS_DIR}/*.py")]

@router.post("/api/plugins/exec")
def exec_plugin(name: str, data: dict):
    mod = importlib.import_module(f"plugins.{name}")
    return getattr(mod, "main")(data)
