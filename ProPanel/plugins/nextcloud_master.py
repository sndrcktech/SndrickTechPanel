# plugins/nextcloud_master.py
import subprocess

def main(data):
    vds_ip = data["vds_ip"]
    admin = data.get("admin", "ncadmin")
    password = data.get("password", "strongpass")
    url = f"https://{vds_ip}/nextcloud"
    # Пример: развёртывание через docker-agent или API
    cmd = (
        f'docker run -d --name nextcloud -e NEXTCLOUD_ADMIN_USER={admin} '
        f'-e NEXTCLOUD_ADMIN_PASSWORD={password} -p 8080:80 nextcloud:27'
    )
    subprocess.run(cmd, shell=True, check=True)
    return {"status": "ok", "msg": f"Nextcloud поднят на {url} (логин: {admin})"}
