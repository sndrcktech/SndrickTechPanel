# plugins/rocketchat_master.py
import subprocess

def main(data):
    vds_ip = data.get("vds_ip")
    admin = data.get("admin", "rcadmin")
    passw = data.get("password", "changeme")
    cmd = (
        f'docker run -d --name rocketchat -p 3000:3000 '
        f'-e ADMIN_USERNAME={admin} -e ADMIN_PASS={passw} rocket.chat'
    )
    subprocess.run(cmd, shell=True, check=True)
    return {"status": "ok", "msg": f"Rocket.Chat поднят на http://{vds_ip}:3000 (логин: {admin})"}
