import os
import subprocess
import json
import time
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api import deps

VPN_DIR = "/etc/sandricktechpanel/vpn"
CA_DIR = "/etc/sandricktechpanel/ca/intermediate"  # Intermediate CA!
os.makedirs(VPN_DIR, exist_ok=True)

router = APIRouter()

def client_dir(name):
    d = os.path.join(VPN_DIR, name)
    os.makedirs(d, exist_ok=True)
    return d

@router.post("/create_client")
def create_vpn_client(
    name: str,
    email: str = "",
    current_user=Depends(deps.get_current_active_superuser)
):
    d = client_dir(name)
    key = os.path.join(d, f"{name}.key")
    csr = os.path.join(d, f"{name}.csr")
    crt = os.path.join(d, f"{name}.crt")
    # 1. Генерируем ключ и CSR
    subprocess.run(["openssl", "genrsa", "-out", key, "2048"], check=True)
    subprocess.run([
        "openssl", "req", "-new", "-key", key, "-out", csr,
        "-subj", f"/CN={name}"
    ], check=True)
    # 2. Подписываем intermediate CA
    subprocess.run([
        "openssl", "ca", "-config", f"{CA_DIR}/openssl.cnf", "-batch",
        "-days", "825", "-in", csr, "-out", crt,
        "-keyfile", f"{CA_DIR}/ca.key", "-cert", f"{CA_DIR}/ca.crt"
    ], check=True)
    # 3. Генерируем .ovpn файл (пример, путь к ca.crt и серверу)
    ca = os.path.join(CA_DIR, "ca.crt")
    ovpn = os.path.join(d, f"{name}.ovpn")
    with open(ovpn, "w") as f:
        f.write(f"""
client
dev tun
proto udp
remote vpn.yourdomain.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
<ca>
{open(ca).r
