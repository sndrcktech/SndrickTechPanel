# plugins/alertmanager_notify.py
import requests

def main(data):
    am_url = data.get("am_url", "http://alertmanager:9093")
    alert = data.get("alert")
    if not alert:
        return {"status": "fail", "msg": "Нет данных для отправки"}
    r = requests.post(f"{am_url}/api/v1/alerts", json=[alert])
    if r.status_code in (200, 201):
        return {"status": "ok"}
    return {"status": "fail", "msg": r.text}
