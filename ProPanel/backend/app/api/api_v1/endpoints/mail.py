import subprocess
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict
from app.api import deps
from app.core.telegram import send_telegram_message

router = APIRouter()

MAIL_DOMAINS_CONF = "/etc/postfix/virtual_domains"
MAIL_USERS_CONF = "/etc/postfix/virtual_mailbox_users"

class MailDomain(BaseModel):
    domain: str

class MailUser(BaseModel):
    email: str
    password: str  # пароль в виде хэша или plain (лучше передавать хэш)

@router.get("/domains", response_model=List[str])
def list_domains(current_user=Depends(deps.get_current_active_superuser)):
    try:
        with open(MAIL_DOMAINS_CONF) as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        return []

@router.post("/domains")
def add_domain(
    domain: MailDomain,
    current_user=Depends(deps.get_current_active_superuser)
):
    with open(MAIL_DOMAINS_CONF, "a") as f:
        f.write(f"{domain.domain}\n")
    subprocess.run(["postmap", MAIL_DOMAINS_CONF])
    send_telegram_message(f"Добавлен почтовый домен: {domain.domain}")
    return {"added": domain.domain}

@router.get("/users", response_model=List[str])
def list_users(current_user=Depends(deps.get_current_active_superuser)):
    try:
        with open(MAIL_USERS_CONF) as f:
            return [line.split()[0] for line in f if line.strip()]
    except FileNotFoundError:
        return []

@router.post("/users")
def add_user(
    user: MailUser,
    current_user=Depends(deps.get_current_active_superuser)
):
    with open(MAIL_USERS_CONF, "a") as f:
        f.write(f"{user.email} {user.password}\n")
    subprocess.run(["postmap", MAIL_USERS_CONF])
    send_telegram_message(f"Добавлен почтовый ящик: {user.email}")
    return {"added": user.email}

# SSL управление — пример для Let's Encrypt через certbot
@router.post("/ssl/issue")
def issue_ssl(
    domain: MailDomain,
    current_user=Depends(deps.get_current_active_superuser)
):
    cmd = ["certbot", "certonly", "--standalone", "-d", domain.domain, "--agree-tos", "-n", "-m", "admin@" + domain.domain]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        send_telegram_message(f"Выпущен SSL для {domain.domain}")
        return {"status": "issued"}
    else:
        return {"error": result.stderr}
