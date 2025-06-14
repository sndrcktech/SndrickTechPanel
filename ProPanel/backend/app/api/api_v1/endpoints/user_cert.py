import os
import subprocess
import json
import time
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps

CA_DIR = "/etc/sandricktechpanel/ca/intermediate"
USER_CERT_DIR = "/etc/sandricktechpanel/usercerts"
os.makedirs(USER_CERT_DIR, exist_ok=True)

router = APIRouter()

def user_paths(username):
    udir = os.path.join(USER_CERT_DIR, username)
    os.makedirs(udir, exist_ok=True)
    return (
        os.path.join(udir, f"{username}.key"),
        os.path.join(udir, f"{username}.csr"),
        os.path.join(udir, f"{username}.crt"),
        udir
    )

@router.post("/issue")
def issue_user_cert(
    username: str,
    email: str = "",
    days: int = 365,
    current_user=Depends(deps.get_current_active_superuser)
):
    key, csr, crt, udir = user_paths(username)
    # Генерируем ключ и CSR
    subprocess.run(["openssl", "genrsa", "-out", key, "2048"], check=True)
    subj = f"/CN={username}"
    if email:
        subj += f"/emailAddress={email}"
    subprocess.run([
        "openssl", "req", "-new", "-key", key, "-out", csr, "-subj", subj
    ], check=True)
    # Подписываем intermediate CA
    subprocess.run([
        "openssl", "ca", "-config", f"{CA_DIR}/openssl.cnf", "-batch",
        "-days", str(days), "-in", csr, "-out", crt,
        "-keyfile", f"{CA_DIR}/ca.key", "-cert", f"{CA_DIR}/ca.crt"
    ], check=True)
    # Аудит
    with open(os.path.join(udir, "audit.log"), "a") as f:
        f.write(json.dumps({"ts": time.time(), "action": "issue"}) + "\n")
    return {"ok": True}

@router.get("/list")
def list_user_certs(current_user=Depends(deps.get_current_active_superuser)):
    return [d for d in os.listdir(USER_CERT_DIR) if os.path.isdir(os.path.join(USER_CERT_DIR, d))]

@router.get("/get")
def get_user_cert(username: str, current_user=Depends(deps.get_current_active_superuser)):
    key, csr, crt, udir = user_paths(username)
    if not os.path.exists(crt):
        raise HTTPException(404, "Сертификат не найден")
    return {
        "crt": open(crt).read(),
        "key": open(key).read(),
        "csr": open(csr).read()
    }

@router.post("/revoke")
def revoke_user_cert(username: str, current_user=Depends(deps.get_current_active_superuser)):
    key, csr, crt, udir = user_paths(username)
    subprocess.run([
        "openssl", "ca", "-config", f"{CA_DIR}/openssl.cnf", "-revoke", crt
    ], check=True)
    subprocess.run([
        "openssl", "ca", "-config", f"{CA_DIR}/openssl.cnf", "-gencrl", "-out", f"{CA_DIR}/crl.pem"
    ], check=True)
    # Удаление файлов (можно оставить в архиве)
    for f in [key, csr, crt]:
        if os.path.exists(f):
            os.remove(f)
    with open(os.path.join(udir, "audit.log"), "a") as f:
        f.write(json.dumps({"ts": time.time(), "action": "revoke"}) + "\n")
    return {"ok": True}
