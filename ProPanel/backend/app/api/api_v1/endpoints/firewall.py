import subprocess
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict
from app.api import deps
from app.core.telegram import send_telegram_message

router = APIRouter()

class Rule(BaseModel):
    chain: str
    target: str
    proto: str
    opt: str
    source: str
    destination: str

class AddRuleRequest(BaseModel):
    chain: str  # INPUT/OUTPUT/FORWARD
    proto: str  # tcp/udp/all
    dport: str  # порт (или "any")
    target: str  # ACCEPT/DROP/REJECT

def parse_iptables() -> List[Rule]:
    cmd = ["iptables", "-n", "-L"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    rules = []
    chain = ""
    for line in result.stdout.splitlines():
        if line.startswith("Chain"):
            chain = line.split()[1]
            continue
        if line.startswith("target") or line.strip() == "":
            continue
        parts = line.split()
        if len(parts) < 6:
            continue
        rules.append(Rule(
            chain=chain,
            target=parts[0],
            proto=parts[1],
            opt=parts[2],
            source=parts[3],
            destination=parts[4],
        ))
    return rules

@router.get("/", response_model=List[Rule])
def list_rules(current_user=Depends(deps.get_current_active_user)):
    return parse_iptables()

@router.post("/add")
def add_rule(
    req: AddRuleRequest,
    current_user=Depends(deps.get_current_active_superuser),
):
    cmd = [
        "iptables", "-A", req.chain,
        "-p", req.proto,
        "--dport", req.dport,
        "-j", req.target,
    ]
    try:
        subprocess.run(cmd, check=True)
        send_telegram_message(f"Добавлено правило фаервола: {cmd}")
        return {"added": True}
    except Exception as e:
        return {"error": str(e)}

@router.post("/delete")
def delete_rule(
    rule_num: int,
    chain: str,
    current_user=Depends(deps.get_current_active_superuser),
):
    cmd = ["iptables", "-D", chain, str(rule_num)]
    try:
        subprocess.run(cmd, check=True)
        send_telegram_message(f"Удалено правило фаервола (#{rule_num} в {chain})")
        return {"deleted": True}
    except Exception as e:
        return {"error": str(e)}
