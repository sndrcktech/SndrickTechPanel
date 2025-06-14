import os
import json
import subprocess
import time
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.api import deps

CA_DIR = "/etc/sandricktechpanel/ca"
os.makedirs(CA_DIR, exist_ok=True)

router = APIRouter()

class IssueRequest(BaseModel):
    cn: str
    days: int = 365

def cert_path(cn): return os.path.join(CA_DIR, f"{cn}.crt")
def key_path(cn): return os.path.join(CA_DIR, f"{cn}.key")
def req_path(cn): return os.path.join(CA_DIR, f"{cn}.csr")

@router.post("/issue")
def issue_cert(req: IssueRequest, current_user=Depends(deps.get_current_active_superuser)):
    # Генерировать ключ и запрос
    subprocess.run(["openssl", "genrsa", "-out", key_path(req.cn), "2048"], check=True)
    subprocess.run([
        "openssl", "req", "-new", "-key", key_path(req.cn), "-out", req_path(req.cn),
        "-subj", f"/CN={req.cn}"
    ], check=True)
    # Подписать сертификат
    ca_key = os.path.join(CA_DIR, "ca.key")
    ca_crt = os.path.join(CA_DIR, "ca.crt")
    if not os.path.exists(ca_key) or not os.path.exists(ca_crt):
        raise HTTPException(400, "CA не инициализирован (нет ca.key/ca.crt)")
    subprocess.run([
        "openssl", "x509", "-req", "-in", req_path(req.cn), "-CA", ca_crt,
        "-CAkey", ca_key, "-CAcreateserial", "-out", cert_path(req.cn),
        "-days", str(req.days), "-sha256"
    ], check=True)
    return {"ok": True, "cn": req.cn}

@router.post("/init")
def init_ca(cn: str = "SandrickTechPanel Root CA", current_user=Depends(deps.get_current_active_superuser)):
    ca_key = os.path.join(CA_DIR, "ca.key")
    ca_crt = os.path.join(CA_DIR, "ca.crt")
    if os.path.exists(ca_key) and os.path.exists(ca_crt):
        raise HTTPException(400, "CA уже инициализирован")
    subprocess.run([
        "openssl", "req", "-x509", "-newkey", "rsa:4096", "-keyout", ca_key,
        "-out", ca_crt, "-days", "3650", "-nodes",
        "-subj", f"/CN={cn}"
    ], check=True)
    return {"ok": True}

@router.get("/list", response_model=List[str])
def list_certs(current_user=Depends(deps.get_current_active_superuser)):
    return [f[:-4] for f in os.listdir(CA_DIR) if f.endswith(".crt") and f != "ca.crt"]

@router.get("/ca")
def get_ca_cert(current_user=Depends(deps.get_current_active_user)):
    ca_crt = os.path.join(CA_DIR, "ca.crt")
    if not os.path.exists(ca_crt):
        raise HTTPException(404, "CA не инициализирован")
    with open(ca_crt) as f:
        return {"ca": f.read()}

@router.get("/get")
def get_cert(cn: str, current_user=Depends(deps.get_current_active_superuser)):
    crt = cert_path(cn)
    key = key_path(cn)
    csr = req_path(cn)
    if not os.path.exists(crt):
        raise HTTPException(404, "Not found")
    with open(crt) as f1, open(key) as f2, open(csr) as f3:
        return {"crt": f1.read(), "key": f2.read(), "csr": f3.read()}

@router.post("/revoke")
def revoke_cert(cn: str, current_user=Depends(deps.get_current_active_superuser)):
    # Для полноценного revoke потребуется вести CRL — здесь просто удаление
    crt = cert_path(cn)
    key = key_path(cn)
    csr = req_path(cn)
    for f in [crt, key, csr]:
        if os.path.exists(f):
            os.remove(f)
    return {"ok": True}
