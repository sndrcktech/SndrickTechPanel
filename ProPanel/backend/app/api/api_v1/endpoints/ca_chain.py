import os
import json
import subprocess
import time
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.api import deps
from app.core.config import settings

CA_BASE = "/etc/sandricktechpanel/ca"
ROOT_CA = os.path.join(CA_BASE, "root")
INTER_CA = os.path.join(CA_BASE, "intermediate")

for d in [ROOT_CA, INTER_CA]:
    os.makedirs(d, exist_ok=True)

router = APIRouter()

def openssl_conf(is_root=True):
    conf = os.path.join(ROOT_CA if is_root else INTER_CA, "openssl.cnf")
    if os.path.exists(conf):
        return conf
    # Генерируем openssl.cnf по шаблону — обязательно
    tmpl = f"""
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = {ROOT_CA if is_root else INTER_CA}
certs             = $dir/certs
crl_dir           = $dir/crl
database          = $dir/index.txt
new_certs_dir     = $dir/certs
certificate       = $dir/ca.crt
serial            = $dir/serial
crlnumber         = $dir/crlnumber
crl               = $dir/crl.pem
private_key       = $dir/ca.key
RANDFILE          = $dir/.rand
default_days      = 365
default_crl_days  = 30
default_md        = sha256
policy            = policy_loose
email_in_dn       = no
name_opt          = ca_default
cert_opt          = ca_default
copy_extensions   = copy
[ policy_loose ]
countryName             = optional
stateOrProvinceName     = optional
localityName            = optional
organizationName        = optional
organizationalUnitName  = optional
commonName              = supplied
emailAddress            = optional
"""
    with open(conf, "w") as f:
        f.write(tmpl)
    return conf

def ensure_init_ca(cadir):
    if not os.path.exists(os.path.join(cadir, "ca.key")):
        raise HTTPException(400, f"CA не инициализирована в {cadir}")
    # index.txt, serial, crlnumber
    for fn, default in [("index.txt", ""), ("serial", "1000"), ("crlnumber", "1000")]:
        p = os.path.join(cadir, fn)
        if not os.path.exists(p):
            with open(p, "w") as f:
                f.write(default + "\n")

@router.post("/init_root")
def init_root_ca(cn: str = "SandrickTechPanel Root CA", current_user=Depends(deps.get_current_active_superuser)):
    ca_key = os.path.join(ROOT_CA, "ca.key")
    ca_crt = os.path.join(ROOT_CA, "ca.crt")
    if os.path.exists(ca_key):
        raise HTTPException(400, "Root CA уже инициализирована")
    subprocess.run([
        "openssl", "req", "-x509", "-newkey", "rsa:4096", "-keyout", ca_key,
        "-out", ca_crt, "-days", "3650", "-nodes",
        "-subj", f"/CN={cn}"
    ], check=True)
    openssl_conf(is_root=True)
    ensure_init_ca(ROOT_CA)
    return {"ok": True}

@router.post("/init_inter")
def init_inter_ca(cn: str = "SandrickTechPanel Intermediate CA", current_user=Depends(deps.get_current_active_superuser)):
    ensure_init_ca(ROOT_CA)
    int_key = os.path.join(INTER_CA, "ca.key")
    int_csr = os.path.join(INTER_CA, "ca.csr")
    int_crt = os.path.join(INTER_CA, "ca.crt")
    # 1. Ключ и CSR
    subprocess.run(["openssl", "genrsa", "-out", int_key, "4096"], check=True)
    subprocess.run([
        "openssl", "req", "-new", "-key", int_key, "-out", int_csr,
        "-subj", f"/CN={cn}"
    ], check=True)
    # 2. Подпись Root CA
    subprocess.run([
        "openssl", "ca", "-config", openssl_conf(True), "-batch",
        "-extensions", "v3_intermediate_ca",
        "-days", "1825",
        "-in", int_csr,
        "-out", int_crt,
        "-keyfile", os.path.join(ROOT_CA, "ca.key"),
        "-cert", os.path.join(ROOT_CA, "ca.crt"),
    ], check=True)
    openssl_conf(is_root=False)
    ensure_init_ca(INTER_CA)
    return {"ok": True}

@router.post("/issue")
def issue_cert(
    cn: str,
    days: int = 365,
    is_inter: bool = True,
    email: Optional[str] = None,
    current_user=Depends(deps.get_current_active_superuser)
):
    ca_dir = INTER_CA if is_inter else ROOT_CA
    ensure_init_ca(ca_dir)
    key = os.path.join(ca_dir, f"{cn}.key")
    csr = os.path.join(ca_dir, f"{cn}.csr")
    crt = os.path.join(ca_dir, f"{cn}.crt")
    subprocess.run(["openssl", "genrsa", "-out", key, "2048"], check=True)
    subprocess.run([
        "openssl", "req", "-new", "-key", key, "-out", csr,
        "-subj", f"/CN={cn}"
    ], check=True)
    subprocess.run([
        "openssl", "ca", "-config", openssl_conf(False if not is_inter else True), "-batch",
        "-days", str(days),
        "-in", csr,
        "-out", crt,
        "-keyfile", os.path.join(ca_dir, "ca.key"),
        "-cert", os.path.join(ca_dir, "ca.crt"),
    ], check=True)
    # Аудит
    audit = {"ts": time.time(), "action": "issue", "cn": cn, "email": email}
    with open(os.path.join(ca_dir, "audit.log"), "a") as f:
        f.write(json.dumps(audit) + "\n")
    # Email-уведомление
    if email:
        send_cert_expiry_email(email, cn, days)
    return {"ok": True}

@router.get("/list")
def list_certs(is_inter: bool = True, current_user=Depends(deps.get_current_active_superuser)):
    ca_dir = INTER_CA if is_inter else ROOT_CA
    return [f[:-4] for f in os.listdir(ca_dir) if f.endswith(".crt") and f != "ca.crt"]

@router.post("/revoke")
def revoke_cert(
    cn: str,
    is_inter: bool = True,
    current_user=Depends(deps.get_current_active_superuser)
):
    ca_dir = INTER_CA if is_inter else ROOT_CA
    crt = os.path.join(ca_dir, f"{cn}.crt")
    subprocess.run([
        "openssl", "ca", "-config", openssl_conf(is_root=not is_inter), "-revoke", crt
    ], check=True)
    subprocess.run([
        "openssl", "ca", "-config", openssl_conf(is_root=not is_inter), "-gencrl", "-out", os.path.join(ca_dir, "crl.pem")
    ], check=True)
    audit = {"ts": time.time(), "action": "revoke", "cn": cn}
    with open(os.path.join(ca_dir, "audit.log"), "a") as f:
        f.write(json.dumps(audit) + "\n")
    return {"ok": True}

@router.get("/crl")
def get_crl(is_inter: bool = True, current_user=Depends(deps.get_current_active_superuser)):
    ca_dir = INTER_CA if is_inter else ROOT_CA
    crl = os.path.join(ca_dir, "crl.pem")
    if not os.path.exists(crl):
        raise HTTPException(404, "CRL не найден")
    with open(crl, "rb") as f:
        return {"crl": f.read().decode("latin1")}
