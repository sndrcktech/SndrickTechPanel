# plugins/matrix_chat.py

import requests

def main(data):
    url = data.get("homeserver_url")
    token = data.get("access_token")
    room_id = data.get("room_id")
    msg = data.get("message")
    if not all([url, token, room_id, msg]):
        return {"status": "fail", "msg": "Не хватает параметров"}
    api_url = f"{url}/_matrix/client/r0/rooms/{room_id}/send/m.room.message?access_token={token}"
    payload = {
        "msgtype": "m.text",
        "body": msg
    }
    resp = requests.post(api_url, json=payload)
    if resp.status_code in (200, 201):
        return {"status": "ok"}
    else:
        return {"status": "fail", "msg": resp.text}
