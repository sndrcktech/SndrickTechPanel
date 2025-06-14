import os
import shutil
import time
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from typing import List
from app.api import deps
from app.core.config import settings

import boto3

BACKUP_DIR = "/var/backups/sandricktechpanel"
os.makedirs(BACKUP_DIR, exist_ok=True)

router = APIRouter()

def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.S3_ENDPOINT,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
    )

@router.get("/list", response_model=List[str])
def list_backups(current_user=Depends(deps.get_current_active_superuser)):
    return [f for f in os.listdir(BACKUP_DIR) if os.path.isfile(os.path.join(BACKUP_DIR, f))]

@router.post("/create")
def create_backup(current_user=Depends(deps.get_current_active_superuser)):
    fname = f"backup_{int(time.time())}.tar.gz"
    fpath = os.path.join(BACKUP_DIR, fname)
    # Пример: архивируем /etc и /var/www (добавь, что требуется)
    shutil.make_archive(fpath[:-7], 'gztar', "/etc")
    # Можно добавить другие каталоги и логику
    return {"created": fname}

@router.get("/download/{filename}")
def download_backup(filename: str, current_user=Depends(deps.get_current_active_superuser)):
    fpath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(fpath):
        raise HTTPException(404, "No such file")
    return FileResponse(fpath, filename=filename, media_type="application/gzip")

@router.post("/upload_s3")
def upload_backup_to_s3(
    filename: str,
    current_user=Depends(deps.get_current_active_superuser),
):
    client = get_s3_client()
    fpath = os.path.join(BACKUP_DIR, filename)
    bucket = settings.S3_BUCKET
    try:
        client.upload_file(fpath, bucket, filename)
        return {"uploaded": True}
    except Exception as e:
        return {"error": str(e)}

@router.get("/s3list")
def list_s3_backups(current_user=Depends(deps.get_current_active_superuser)):
    client = get_s3_client()
    bucket = settings.S3_BUCKET
    files = []
    for obj in client.list_objects_v2(Bucket=bucket).get("Contents", []):
        files.append(obj["Key"])
    return files

@router.post("/restore")
def restore_backup(
    filename: str,
    current_user=Depends(deps.get_current_active_superuser)
):
    fpath = os.path.join(BACKUP_DIR, filename)
    if not os.path.exists(fpath):
        raise HTTPException(404, "No such file")
    # Восстановление (пример: распаковать в /)
    shutil.unpack_archive(fpath, "/")
    return {"restored": filename}
