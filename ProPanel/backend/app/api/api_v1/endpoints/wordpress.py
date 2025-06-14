import os
import subprocess
import secrets
import string
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from app.api import deps

WP_ROOT = "/var/www/wordpress_sites"
os.makedirs(WP_ROOT, exist_ok=True)

router = APIRouter()

class WpInstallRequest(BaseModel):
    domain: str

@router.get("/list", response_model=List[str])
def list_wp_sites(current_user=Depends(deps.get_current_active_superuser)):
    return [f for f in os.listdir(WP_ROOT) if os.path.isdir(os.path.join(WP_ROOT, f))]

@router.post("/install")
def install_wp(
    req: WpInstallRequest,
    current_user=Depends(deps.get_current_active_superuser)
):
    domain = req.domain.lower()
    site_dir = os.path.join(WP_ROOT, domain)
    if os.path.exists(site_dir):
        raise HTTPException(400, "Сайт уже установлен")

    # Генерация паролей
    db_name = f"wp_{''.join(secrets.choice(string.ascii_lowercase) for _ in range(6))}"
    db_user = db_name
    db_pass = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(16))

    # 1. Создать базу и пользователя (пример для mysql/mariadb)
    sql = (
        f"CREATE DATABASE {db_name};"
        f"CREATE USER '{db_user}'@'localhost' IDENTIFIED BY '{db_pass}';"
        f"GRANT ALL PRIVILEGES ON {db_name}.* TO '{db_user}'@'localhost';"
        f"FLUSH PRIVILEGES;"
    )
    subprocess.run(['mysql', '-uroot', '-pYOUR_ROOT_PASSWORD', '-e', sql], check=True)

    # 2. Скачать WP, распаковать
    subprocess.run(['wget', 'https://wordpress.org/latest.tar.gz', '-O', '/tmp/wp.tar.gz'], check=True)
    subprocess.run(['tar', '-xzf', '/tmp/wp.tar.gz', '-C', WP_ROOT], check=True)
    os.rename(os.path.join(WP_ROOT, 'wordpress'), site_dir)

    # 3. Настроить wp-config.php
    subprocess.run([
        'cp', os.path.join(site_dir, 'wp-config-sample.php'),
        os.path.join(site_dir, 'wp-config.php')
    ], check=True)
    def wp_cfg_replace(file, old, new):
        subprocess.run(['sed', '-i', f"s/{old}/{new}/g", file])
    wp_cfg_replace(os.path.join(site_dir, 'wp-config.php'), "database_name_here", db_name)
    wp_cfg_replace(os.path.join(site_dir, 'wp-config.php'), "username_here", db_user)
    wp_cfg_replace(os.path.join(site_dir, 'wp-config.php'), "password_here", db_pass)

    # 4. Права
    subprocess.run(['chown', '-R', 'www-data:www-data', site_dir])

    return {
        "domain": domain,
        "db_name": db_name,
        "db_user": db_user,
        "db_pass": db_pass,
        "dir": site_dir,
        "url": f"http://{domain}/"
    }

@router.post("/delete")
def delete_wp(
    domain: str,
    current_user=Depends(deps.get_current_active_superuser)
):
    site_dir = os.path.join(WP_ROOT, domain)
    if not os.path.exists(site_dir):
        raise HTTPException(404, "Не найден")
    subprocess.run(['rm', '-rf', site_dir])
    return {"deleted": domain}
