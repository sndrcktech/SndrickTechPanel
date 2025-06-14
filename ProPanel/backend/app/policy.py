# backend/app/policy.py
from fastapi import APIRouter
import yaml

router = APIRouter()
POLICY_FILE = "policies.yaml"

def load_policies():
    with open(POLICY_FILE) as f:
        return yaml.safe_load(f)

@router.get("/api/policies")
def get_policies():
    return load_policies()

@router.post("/api/policy/evaluate")
def eval_policy(role: str, action: str):
    policies = load_policies()
    for p in policies:
        if p["role"] == role and action in p["actions"]:
            return {"result": "allow"}
    return {"result": "deny"}
