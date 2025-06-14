# backend/app/secrets.py
from fastapi import APIRouter
import hvac  # HashiCorp Vault

router = APIRouter()
VAULT_ADDR = "http://vault:8200"
VAULT_TOKEN = os.environ.get("VAULT_TOKEN", "s.yourtokenhere")

@router.post("/api/secrets/get")
def get_secret(key: str):
    client = hvac.Client(url=VAULT_ADDR, token=VAULT_TOKEN)
    secret = client.secrets.kv.v2.read_secret_version(path=key)
    return secret["data"]["data"]
