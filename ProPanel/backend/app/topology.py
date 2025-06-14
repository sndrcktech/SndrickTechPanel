# backend/app/topology.py
from fastapi import APIRouter
import yaml, os

router = APIRouter()
TOPOLOGY_FILE = os.environ.get("TOPOLOGY_FILE", "topology.yaml")
ROLES_FILE = os.environ.get("ROLES_FILE", "roles/catalog.yaml")

def load_topology():
    with open(TOPOLOGY_FILE) as f:
        return yaml.safe_load(f)

def save_topology(data):
    with open(TOPOLOGY_FILE, "w") as f:
        yaml.safe_dump(data, f)

@router.get("/api/topology/layout")
def get_layout():
    return load_topology()

@router.post("/api/topology/applyrole")
def apply_role(vds_id: str, role: str):
    topology = load_topology()
    for node in topology["nodes"]:
        if node["id"] == vds_id:
            node["role"] = role
            node["status"] = "pending"
            save_topology(topology)
            # TODO: вызов orchestration через агент/очередь событий
    return {"status": "ok"}

@router.post("/api/topology/swap")
def swap_role(primary_id: str, reserve_id: str):
    topology = load_topology()
    n1 = next(x for x in topology["nodes"] if x["id"] == primary_id)
    n2 = next(x for x in topology["nodes"] if x["id"] == reserve_id)
    n2["role"], n1["role"] = n1["role"], "reserve"
    n1["status"], n2["status"] = "reserve", "active"
    save_topology(topology)
    # TODO: orchestration и алерт
    return {"status": "swapped"}

@router.post("/api/topology/add")
def add_vds(name: str, ip: str, region: str):
    topology = load_topology()
    node_id = f"v{len(topology['nodes']) + 1}"
    topology["nodes"].append({"id": node_id, "name": name, "ip": ip, "region": region, "role": "reserve", "status": "reserve"})
    save_topology(topology)
    return {"status": "added", "id": node_id}
