# backend/app/agent_api.py
from fastapi import APIRouter, Request
import requests

router = APIRouter()

AGENT_PORT = 5454  # на каждом VDS

def agent_url(vds_ip, path):
    return f"http://{vds_ip}:{AGENT_PORT}{path}"

@router.post("/api/agent/setrole")
def set_role_on_vds(vds_ip: str, role: str):
    r = requests.put(agent_url(vds_ip, "/api/role"), json={"role": role}, timeout=30)
    return r.json()

@router.post("/api/agent/docker")
def docker_cmd(vds_ip: str, cmd: str, args: dict):
    r = requests.post(agent_url(vds_ip, "/api/docker"), json={"cmd": cmd, "args": args}, timeout=30)
    return r.json()
