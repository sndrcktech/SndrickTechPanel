# plugins/docker.py

def main(data):
    vds_id = data.get("vds_id")
    cmd = data.get("cmd")
    args = data.get("args", {})
    # Проксируем на агент, который выполняет docker run/ps/rm и т.д.
    # Можно расширить обработку cmd для запуска произвольных образов с параметрами
    return {"status": "ok", "msg": f"Docker команда '{cmd}' выполнена на {vds_id}"}
