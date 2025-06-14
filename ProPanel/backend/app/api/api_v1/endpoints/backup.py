import os
import tarfile
import shutil
import subprocess
import time
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.api import deps

BACKUP_DIR = "/var/backups/sandricktechpanel"
DATA_PATHS = [
    "/etc/sandricktechpanel/ca",
    "/etc/letsencrypt",
    "/etc/nginx/ssl",
    "/etc/sandricktechpanel/usercerts",
    "/etc/sandricktechpanel/domains.json"
]

os.makedirs(BACKUP_DIR, exist_ok=True)
router = APIRouter()

def make_backup_name():
    return f"backup_{time.strftime('%Y%m%d_%H%M%S')}.tar.gz"

@router.post("/create")
def create_backup(
    label: Optional[str] = None,
    current_user=Depends(deps.get_current_active_superuser)
    log_backup({"user": current_user.username, "action": "create", "backup": name})
):
    name = make_backup_name() if not label else f"backup_{label}_{time.strftime('%Y%m%d_%H%M%S')}.tar.gz"
    path = os.path.join(BACKUP_DIR, name)
    with tarfile.open(path, "w:gz") as tar:
        for src in DATA_PATHS:
            if os.path.exists(src):
                tar.add(src, arcname=os.path.basename(src))
    return {"ok": True, "backup": name}

@router.get("/list", response_model=List[str])
def list_backups(current_user=Depends(deps.get_current_active_superuser)):
    return sorted([f for f in os.listdir(BACKUP_DIR) if f.endswith(".tar.gz")], reverse=True)

@router.post("/restore")
def restore_backup(
    name: str,
    current_user=Depends(deps.get_current_active_superuser)
    log_backup({"user": current_user.username, "action": "restore", "backup": name})
):
    path = os.path.join(BACKUP_DIR, name)
    if not os.path.exists(path):
        raise HTTPException(404, "Бэкап не найден")
    with tarfile.open(path, "r:gz") as tar:
        tar.extractall("/")
    # Можно добавить рестарт сервисов после восстановления
    return {"ok": True}

@router.post("/delete")
def delete_backup(
    name: str,
    current_user=Depends(deps.get_current_active_superuser)
    log_backup({"user": current_user.username, "action": "delete", "backup": name})
):
    path = os.path.join(BACKUP_DIR, name)
    if os.path.exists(path):
        os.remove(path)
        return {"ok": True}
    raise HTTPException(404, "Нет такого файла")

@router.post("/upload_s3")
def upload_backup_s3(
    name: str,
    bucket: str,
    aws_key: str,
    aws_secret: str,
    region: str = "us-east-1",
    current_user=Depends(deps.get_current_active_superuser)
    log_backup({"user": current_user.username, "action": "upload_s3", "backup": name, "bucket": bucket})
):
    # Требуется установить boto3: pip install boto3
    import boto3
    path = os.path.join(BACKUP_DIR, name)
    if not os.path.exists(path):
        raise HTTPException(404, "Файл не найден")
    s3 = boto3.client('s3', aws_access_key_id=aws_key, aws_secret_access_key=aws_secret, region_name=region)
    s3.upload_file(path, bucket, name)
    return {"ok": True}
