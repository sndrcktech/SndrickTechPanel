# plugins/cloud_add_vds.py

import requests

def main(data):
    provider = data.get("provider")
    token = data.get("token")
    region = data.get("region", "ru-central1")
    image = data.get("image", "ubuntu-22-04")
    ssh_key = data.get("ssh_key")
    name = data.get("name")
    if provider == "yandex":
        # Пример для Yandex.Cloud Compute
        yc_url = "https://compute.api.cloud.yandex.net/compute/v1/instances"
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "name": name,
            "zoneId": region,
            "platformId": "standard-v1",
            "resourcesSpec": {"memory": 4096, "cores": 2},
            "bootDiskSpec": {"autoDelete": True, "diskSpec": {"size": 30*1024*1024*1024, "typeId": "network-ssd"}},
            "networkInterfaceSpecs": [{"subnetId": "your-subnet-id"}],
            "metadata": {"ssh-keys": ssh_key}
        }
        resp = requests.post(yc_url, headers=headers, json=payload)
        if resp.ok:
            return {"status": "ok", "instance": resp.json()}
        return {"status": "fail", "msg": resp.text}
    # Для других провайдеров (Hetzner, DO, AWS, GCP) — добавить свои блоки!
    return {"status": "fail", "msg": "Provider not supported"}
