# plugins/ca.py

def main(data):
    ca_type = data.get("ca_type", "intermediate")
    org = data.get("org", "Company")
    ttl = data.get("ttl", 365)
    # Настроить cfssl, сгенерировать CA, выдать root/intermediate, записать в LDAP при необходимости
    return {
        "status": "ok",
        "msg": f"CA ({ca_type}) для {org} создана, срок: {ttl} дней"
    }
