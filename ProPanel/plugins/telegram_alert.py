# plugins/telegram_alert.py

import requests

def main(data):
    token = data.get("token")      # Телеграм Bot API Token
    chat_id = data.get("chat_id")  # Куда отправлять
    msg = data.get("message")
    if not all([token, chat_id, msg]):
        return {"status": "fail", "msg": "Не хватает параметров"}
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    resp = requests.post(url, json={"chat_id": chat_id, "text": msg, "parse_mode": "HTML"})
    if resp.status_code == 200:
        return {"status": "ok"}
    else:
        return {"status": "fail", "msg": resp.text}
