# plugins/fileexchange_master.py
import subprocess

def main(data):
    vds_ip = data["vds_ip"]
    user = data.get("user", "ftpuser")
    passw = data.get("password", "ftppass")
    # Пример WebDAV (например, delfer/alpine-ftp-server)
    cmd = (
        f'docker run -d --name fileexchange -e USERS="{user}:{passw}" -p 2121:21 -p 3000:80 '
        'delfer/alpine-ftp-server'
    )
    subprocess.run(cmd, shell=True, check=True)
    return {"status": "ok", "msg": f"FileExchange поднят: ftp://{vds_ip}:2121, web: http://{vds_ip}:3000 (логин: {user})"}
