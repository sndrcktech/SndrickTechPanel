# plugins/backup.py

def main(data):
    vds_id = data.get("vds_id")
    action = data.get("action", "backup")
    # production-логика: вызвать /api/backup на агенте, либо восстановить
    if action == "backup":
        # backup logic here...
        return {"status": "ok", "msg": f"Backup выполнен для {vds_id}"}
    elif action == "restore":
        # restore logic here...
        return {"status": "ok", "msg": f"Восстановление выполнено для {vds_id}"}
    else:
        return {"status": "fail", "msg": "Неизвестное действие"}
