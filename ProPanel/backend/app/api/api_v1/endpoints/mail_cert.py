import os
import shutil
import subprocess
import time
from fastapi import APIRouter, Depends, HTTPException
from app.api import deps
from app.core.config import settings

CA_DIR = "/etc/sandricktechpanel/ca/intermediate"
MAIL_DOMAIN = "mail.example.com"  # (можно вынести в настройки)

POSTFIX_CERT = "/etc/ssl/certs/mailserver.crt"
POSTFIX_KEY = "/etc/ssl/private/mailserver.key"
DOVECOT_CERT = "/etc/ssl/certs/dovecot.pem"
DOVECOT_KEY = "/etc/ssl/private/dovecot.key"

router = APIRouter()

def cert_paths(cn):
    return (
        os.path.join(CA_DIR, f"{cn}.crt"),
        os.path.join(CA_DIR, f"{cn}.key"),
    )

@router.post("/issue")
def issue_mail_cert(
    cn: str = MAIL_DOMAIN,
    days: int = 365,
    current_user=Depends(deps.get_current_active_superuser)
):
    crt, key = cert_paths(cn)
    # Если нет, генерируем новый
    if not os.path.exists(crt) or not os.path.exists(key):
        subprocess.run([
            "openssl", "genrsa", "-out", key, "2048"
        ], check=True)
        subprocess.run([
            "openssl", "req", "-new", "-key", key, "-out", f"{CA_DIR}/{cn}.csr",
            "-subj", f"/CN={cn}"
        ], check=True)
        subprocess.run([
            "openssl", "ca", "-config", f"{CA_DIR}/openssl.cnf", "-batch",
            "-days", str(days), "-in", f"{CA_DIR}/{cn}.csr", "-out", crt,
            "-keyfile", f"{CA_DIR}/ca.key", "-cert", f"{CA_DIR}/ca.crt"
