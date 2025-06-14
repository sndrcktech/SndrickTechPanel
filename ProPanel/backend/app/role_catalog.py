# backend/app/role_catalog.py
from fastapi import APIRouter
import yaml

router = APIRouter()
ROLES_FILE = "roles/catalog.yaml"

@router.get("/api/roles")
def get_roles():
    with open(ROLES_FILE) as f:
        return yaml.safe_load(f)
