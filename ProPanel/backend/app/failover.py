# backend/app/failover.py
from fastapi import APIRouter
import yaml

router = APIRouter()
TOPOLOGY_FILE = "topology.yaml"

def load_topology():
    with open(TOPOLOGY_FILE) as f:
        return yaml.safe_load(f)

def save_topology(data):
    with open(TOPOLOGY_FILE, "w") as f:
        yaml.safe_dump(data, f)

@router.post("/api/failover")
def trigger_failover(primary_id: str):
    topology = load_topology()
    # Найти резервный VDS для primary
    primary = next(n for n in topology["nodes"] if n["id"] == primary_id)
    reserve = next((n for n in topology["nodes"] if n.get("reserve_for") == primary_id and n["status"] == "reserve"), None)
    if not reserve:
        return {"status": "no_reserve"}
    reserve["role"], primary["role"] = primary["role"], "reserve"
    reserve["status"], primary["status"] = "active", "reserve"
    save_topology(topology)
    return {"status": "failover", "reserve_id": reserve["id"]}
