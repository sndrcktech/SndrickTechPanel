import os
import json
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from app.api import deps

USERS_FILE = "/etc/sandricktechpanel/users.json"
ROLES_FILE = "/etc/sandricktechpanel/roles.json"
os.makedirs("/etc/sandricktechpanel", exist_ok=True)

router = APIRouter()

# ==== Users ====

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE) as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

@router.get("/users")
def get_users(current_user=Depends(deps.get_current_active_superuser)):
    return load_users()

@router.post("/users/add")
def add_user(data: dict, current_user=Depends(deps.get_current_active_superuser)):
    users = load_users()
    if any(u["username"] == data["username"] for u in users):
        raise HTTPException(400, "User exists")
    users.append(data)
    save_users(users)
    return {"ok": True}

@router.post("/users/delete")
def delete_user(username: str, current_user=Depends(deps.get_current_active_superuser)):
    users = load_users()
    users = [u for u in users if u["username"] != username]
    save_users(users)
    return {"ok": True}

# ==== Roles ====

def load_roles():
    if not os.path.exists(ROLES_FILE):
        # По умолчанию: admin и user
        return [
            {"name": "admin", "permissions": ["*"]},
            {"name": "user", "permissions": ["dashboard", "metrics", "wordpress", "logs"]},
        ]
    with open(ROLES_FILE) as f:
        return json.load(f)

def save_roles(roles):
    with open(ROLES_FILE, "w") as f:
        json.dump(roles, f, indent=2)

@router.get("/roles")
def get_roles(current_user=Depends(deps.get_current_active_superuser)):
    return load_roles()

@router.post("/roles/add")
def add_role(data: dict, current_user=Depends(deps.get_current_active_superuser)):
    roles = load_roles()
    if any(r["name"] == data["name"] for r in roles):
        raise HTTPException(400, "Role exists")
    roles.append(data)
    save_roles(roles)
    return {"ok": True}

@router.post("/roles/delete")
def delete_role(name: str, current_user=Depends(deps.get_current_active_superuser)):
    roles = load_roles()
    roles = [r for r in roles if r["name"] != name]
    save_roles(roles)
    return {"ok": True}

@router.post("/roles/update")
def update_role(data: dict, current_user=Depends(deps.get_current_active_superuser)):
    roles = load_roles()
    for i, r in enumerate(roles):
        if r["name"] == data["name"]:
            roles[i] = data
    save_roles(roles)
    return {"ok": True}
