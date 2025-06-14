# plugins/wordpress_deploy.py
import subprocess

def main(data):
    vds_ip = data.get("vds_ip")
    fqdn = data.get("fqdn")
    db_user = data.get("db_user", "wpuser")
    db_pass = data.get("db_pass", "changeme")
    db_name = data.get("db_name", "wordpress")
    plugins = data.get("plugins", ["wp-super-cache", "wp-seo"])
    theme = data.get("theme", "astra")
    # Команды можно отправлять агенту по API или через SSH
    cmds = [
        f"docker exec -it wordpress wp core install --url=https://{fqdn} --title=Site --admin_user=admin --admin_password={db_pass} --admin_email=admin@{fqdn}",
        *(f"docker exec -it wordpress wp plugin install {p} --activate" for p in plugins),
        f"docker exec -it wordpress wp theme install {theme} --activate"
    ]
    for c in cmds:
        subprocess.run(c, shell=True, check=True)
    return {"status": "ok", "msg": f"WordPress auto-deployed на {fqdn}"}
