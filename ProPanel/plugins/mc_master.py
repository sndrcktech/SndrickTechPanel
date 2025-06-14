# plugins/mc_master.py
import subprocess

def main(data):
    vds_ip = data.get("vds_ip")
    # Пример: запуск MC через docker (с поддержкой tty/web), интеграция с ttyd
    cmd = (
        'docker run -d --name mc --rm '
        '-e USER=root '
        '-v /:/mnt/root:rw '
        'sxyvr/mc-ttyd'
    )
    subprocess.run(cmd, shell=True, check=True)
    url = f"http://{vds_ip}:7681/"
    return {"status": "ok", "msg": f"MC доступен через web-терминал: {url}"}
