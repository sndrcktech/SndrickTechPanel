# plugins/mfa_master.py
import pyotp

def main(data):
    action = data.get("action")
    user = data.get("user")
    secret = data.get("secret")
    if action == "gen_totp":
        secret = pyotp.random_base32()
        uri = pyotp.totp.TOTP(secret).provisioning_uri(name=user, issuer_name="SandrickTechPanel")
        return {"status": "ok", "secret": secret, "uri": uri}
    elif action == "verify_totp":
        code = data.get("code")
        totp = pyotp.TOTP(secret)
        if totp.verify(code):
            return {"status": "ok"}
        else:
            return {"status": "fail"}
    # Для WebAuthn использовать passlib/webauthn или external API
    return {"status": "not_implemented"}
