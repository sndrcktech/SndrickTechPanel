# plugins/wp_multisite.py
import subprocess

def main(data):
    fqdn = data["fqdn"]
    admin = data.get("admin", "admin")
    passw = data.get("password", "changeme")
    cmd = (
        f'docker exec -it wordpress wp core multisite-install --url=https://{fqdn} '
        f'--title="WP Network" --admin_user={admin} --admin_password={passw} --admin_email=admin@{fqdn}'
    )
    subprocess.run(cmd, shell=True, check=True)
    return {"status": "ok", "msg": f"WP Multisite поднят на {fqdn}"}
