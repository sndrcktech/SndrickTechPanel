# plugins/webhook_1c.py
import requests

def main(data):
    webhook_url = data["webhook_url"]
    payload = data["payload"]
    resp = requests.post(webhook_url, json=payload)
    if resp.ok:
        return {"status": "ok", "msg": "Webhook sent"}
    else:
        return {"status": "fail", "msg": resp.text}
