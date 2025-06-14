import os
import subprocess
import json
import time
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Optional
from app.api import deps

# Где хранятся домены и сервисы (можно расширить)
DOMAINS_FILE = "/etc/sandricktechpanel/domains.json"
CA_DIR = "/etc/sandricktechpanel/ca/intermediate"
LE_DIR = "/etc/letsencrypt/live"
NGINX_SSL_DIR = "/etc/nginx/ssl"

router = APIRouter()

def load_domains() -> List[Dict]:
    if not os.path.exists(DOMAINS_FILE):
        return []
    with open(DOMAINS_FILE) as f:
        return json.load(f)

def cert_status(crt_path: str) -> Dict:
    if not os.path.exists(crt_path):
        return {"exists": False}
    try:
        exp = subprocess.check_output(
            ["openssl", "x509", "-enddate", "-noout", "-in", crt_path]
        ).decode().strip().split("=")[1]
        exp_ts = time.mktime(time.strptime(exp, "%b %d %H:%M:%S %Y %Z"))
        return {
            "exists": True,
            "expires": exp,
            "expires_ts": exp_ts,
            "days_left": int((exp_ts - time.time()) / 86400)
        }
    except Exception as e:
        return {"exists": False, "error": str(e)}

@router.get("/list")
def certs_list(current_user=Depends(deps.get_current_active_superuser)):
    # Формируем единую таблицу: домен, тип, статус, days_left, etc
    domains = load_domains()
    table = []
    for d in domains:
        cn = d.get("domain")
        ca_crt = os.path.join(CA_DIR, f"{cn}.crt")
        le_crt = os.path.join(LE_DIR, cn, "fullchain.pem")
        nginx_crt = os.path.join(NGINX_SSL_DIR, f"{cn}.crt")
        for cert_type, path in [("ca", ca_crt), ("letsencrypt", le_crt), ("nginx", nginx_crt)]:
            s = cert_status(path)
            s.update({"domain": cn, "type": cert_type, "path": path})
            table.append(s)
    return table

@router.post("/renew")
def renew_all(
    types: Optional[List[str]] = None,
    notify: bool = True,
    current_user=Depends(deps.get_current_active_superuser)
):
    # Массовое продление сертификатов (пример только для Let's Encrypt)
    domains = load_domains()
    results = []
    for d in domains:
        cn = d.get("domain")
        # Только если есть и требуется продление
        if not types or "letsencrypt" in types:
            try:
                subprocess.run([
                    "certbot", "renew", "--cert-name", cn, "--quiet", "--deploy-hook", "systemctl reload nginx"
                ], check=True)
                results.append({"domain": cn, "type": "letsencrypt", "renewed": True})
            except Exception as e:
                results.append({"domain": cn, "type": "letsencrypt", "renewed": False, "error": str(e)})
        # Для CA — можно запускать аналогично через свою функцию
    # Уведомления — можно расширить
    if notify:
        for r in results:
            if not r.get("renewed"):
                print(f"Renew failed: {r}")
    return results

@router.post("/import")
def import_certs(table: List[Dict], current_user=Depends(deps.get_current_active_superuser)):
    # Импортирует domains.json (или другую структуру)
    with open(DOMAINS_FILE, "w") as f:
        json.dump(table, f, indent=2)
    return {"ok": True}

@router.get("/export")
def export_certs(current_user=Depends(deps.get_current_active_superuser)):
    return load_domains()
