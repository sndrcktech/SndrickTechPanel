#!/bin/bash
set -e
echo "=== Установка SandrickTechPanel ==="
apt update && apt install -y python3 python3-pip python3-venv docker.io docker-compose
cd /opt/SandrickTechPlatform
bash build.sh
dpkg -i build/sandricktechpanel_*.deb
systemctl start sandricktechpanel
echo "Готово! Откройте https://<ip>:443"
