# plugins/matrix_master.py
import subprocess

def main(data):
    vds_ip = data.get("vds_ip")
    domain = data.get("domain", "matrix.local")
    admin = data.get("admin", "matrixadmin")
    passw = data.get("password", "changeme")
    # Пример auto-deploy через docker compose (подробнее в документации Matrix)
    cmd = (
        f'docker run -d --name synapse -e SYNAPSE_SERVER_NAME={domain} '
        f'-e SYNAPSE_REPORT_STATS=yes -p 8008:8008 matrixdotorg/synapse:latest'
    )
    subprocess.run(cmd, shell=True, check=True)
    # Также можно auto-deploy Element (web UI)
    cmd_ui = (
        f'docker run -d --name element -p 8081:80 vectorim/element-web'
    )
    subprocess.run(cmd_ui, shell=True, check=True)
    return {"status": "ok", "msg": f"Matrix/Element подняты на http://{vds_ip}:8008 (UI: http://{vds_ip}:8081)"}
