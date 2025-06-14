import os
import subprocess
import json
import time
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.core.config import settings

LE_DIR = "/etc/letsencrypt/live"
NGINX_SSL_DIR = "/etc/nginx/ssl"

router = APIRouter()

def cert_paths(domain):
    return (
        os.path.join(LE_DIR, domain, "fullchain.pem"),
        os.path.join(LE_DIR, domain, "privkey.pem"),
    )

@router.post("/issue")
def issue_letsencrypt_cert(
    domain: str,
    email: str = settings.ADMIN_EMAIL or "admin@example.com",
    dns_provider: str = "",
    wildcard: bool = False,
    current_user=Depends(deps.get_current_active_superuser)
):
    # Проверяем, уже есть ли сертификат
    crt, key = cert_paths(domain)
    if os.path.exists(crt) and os.path.exists(key):
        return {"ok": True, "already_exists": True}
    # Собираем команду
    if wildcard:
        # DNS challenge (пример: cloudflare)
        if not dns_provider:
            raise HTTPException(400, "Не указан DNS-провайдер для wildcard")
        env_file = f"/root/.secrets/{dns_provider}.ini"
        cmd = [
            "certbot", "certonly", "--dns-" + dns_provider,
            "--dns-" + dns_provider + "-credentials", env_file,
            "-d", f"*.{domain}", "--agree-tos", "--non-interactive", "-m", email
        ]
    else:
        # HTTP challenge
        cmd = [
            "certbot", "certonly", "--webroot", "-w", "/var/www/html",
            "-d", domain, "--agree-tos", "--non-interactive", "-m", email
        ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        raise HTTPException(500, f"Ошибка выпуска: {result.stderr.decode()}")
    # Копируем для nginx (или другого сервиса)
    crt_dst, key_dst = os.path.join(NGINX_SSL_DIR, f"{domain}.crt"), os.path.join(NGINX_SSL_DIR, f"{domain}.key")
    os.makedirs(NGINX_SSL_DIR, exist_ok=True)
    shutil.copy2(crt, crt_dst)
    shutil.copy2(key, key_dst)
    # Перезагрузка nginx
    subprocess.run(["systemctl", "reload", "nginx"], check=True)
    return {"ok": True}

@router.get("/status")
def letsencrypt_cert_status(domain: str, current_user=Depends(deps.get_current_active_superuser)):
    crt, key = cert_paths(domain)
    if not os.path.exists(crt):
        return {"installed": False}
    exp = subprocess.check_output(
        ["openssl", "x509", "-enddate", "-noout", "-in", crt]
    ).decode().strip().split("=")[1]
    return {"installed": True, "expires": exp}
