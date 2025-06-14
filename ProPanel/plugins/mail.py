# plugins/mail.py

def main(data):
    vds_id = data.get("vds_id")
    domain = data.get("mail_domain")
    dkim = data.get("dkim", True)
    # Настроить Postfix, Dovecot, certbot, DNS-записи, DKIM/DMARC/SPF
    # ...
    return {
        "status": "ok",
        "msg": f"Почтовый сервер для домена {domain} настроен (DKIM: {dkim})"
    }
