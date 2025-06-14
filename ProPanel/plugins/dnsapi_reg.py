# plugins/dnsapi_reg.py
import requests

def main(data):
    username = data["reg_username"]
    password = data["reg_password"]
    domain = data["domain"]
    records = data["records"] # [{'type': 'A', 'name': '@', 'value': '1.2.3.4'}, ...]
    url = "https://api.reg.ru/api/regru2/domain/update_resource_records"
    payload = {
        "username": username,
        "password": password,
        "domains": [{"dname": domain, "rrs": records}]
    }
    resp = requests.post(url, json=payload)
    if resp.ok:
        return {"status": "ok", "msg": resp.json()}
    else:
        return {"status": "fail", "msg": resp.text}
