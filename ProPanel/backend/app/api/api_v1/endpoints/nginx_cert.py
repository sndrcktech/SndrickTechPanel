import os
import shutil
import subprocess
import time
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps

CA_DIR = "/etc/sandricktechpanel/ca/intermediate"
NGINX_SSL_DIR = "/etc/nginx/ssl"
NGINX_CONF_DIR = "/etc/nginx/sites-enabled"

os.makedirs(NGINX_SSL_DIR, exist_ok=True)

router = APIRouter()

def cert_paths(cn):
    return (
        os.path.join(CA_DIR, f"{cn}.crt"),
        os.path.join(CA_DIR, f"{cn}.key"),
    )

def nginx_ssl_paths(cn):
    return (
        os.path.join(NGINX_SSL_DIR, f"{cn}.crt"),
        os.path.join(NGINX_SSL_DIR, f"{cn}.key"),
    )

@router.post("/issue")
def issue_nginx_cert(
    cn: str,
    days: int = 365,
    reload_nginx: bool = True,
    current_user=Depends(deps.get_current_active_superuser)
):
    crt, key = cert_paths(cn)
    # Генерируем, если не существует
    if not os.path.exists(crt) or not os.path.exists(key):
        subprocess.run(["openssl", "genrsa", "-out", key, "2048"], check=True)
        subprocess.run([
            "openssl", "req", "-new", "-key", key, "-out", f"{CA_DIR}/{cn}.csr",
            "-subj", f"/CN={cn}"
        ], check=True)
        subprocess.run([
            "openssl", "ca", "-config", f"{CA_DIR}/openssl.cnf", "-batch",
            "-days", str(days), "-in", f"{CA_DIR}/{cn}.csr", "-out", crt,
            "-keyfile", f"{CA_DIR}/ca.key", "-cert", f"{CA_DIR}/ca.crt"
        ], check=True)
    # Копируем в /etc/nginx/ssl
    crt_dst, key_dst = nginx_ssl_paths(cn)
    for src, dst in [(crt, crt_dst), (key, key_dst)]:
        if os.path.exists(dst):
            shutil.copy2(dst, dst + ".bak_" + str(int(time.time())))
        shutil.copy2(src, dst)
    # Обновляем nginx config (если существует блок для домена)
    conf_file = os.path.join(NGINX_CONF_DIR, f"{cn}.conf")
    if os.path.exists(conf_file):
        # Обновляем только пути ssl_certificate/ssl_certificate_key, если нужно
        # (или не трогаем, если они уже ссылаются на наши файлы)
        # — если требуется авто-редактирование, реализуй здесь
        pass
    # Перезагрузка nginx
    if reload_nginx:
        subprocess.run(["systemctl", "reload", "nginx"], check=True)
    return {"ok": True}

@router.get("/status")
def nginx_cert_status(cn: str, current_user=Depends(deps.get_current_active_superuser)):
    crt, key = nginx_ssl_paths(cn)
    if not os.path.exists(crt):
        return {"installed": False}
    exp = subprocess.check_output(
        ["openssl", "x509", "-enddate", "-noout", "-in", crt]
    ).decode().strip().split("=")[1]
    return {"installed": True, "expires": exp}
