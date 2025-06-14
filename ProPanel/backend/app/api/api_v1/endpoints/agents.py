import os
import uuid
import time
import secrets
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.api import deps

AGENTS_DIR = "/var/lib/sandricktechpanel/agents"
os.makedirs(AGENTS_DIR, exist_ok=True)

router = APIRouter()

class AgentRegisterRequest(BaseModel):
    hostname: str
    ip: str

class Agent(BaseModel):
    id: str
    hostname: str
    ip: str
    registered_at: float
    last_ping: float
    token: str

def load_agents() -> List[Agent]:
    agents = []
    for fn in os.listdir(AGENTS_DIR):
        path = os.path.join(AGENTS_DIR, fn)
        with open(path) as f:
            data = eval(f.read())
            agents.append(Agent(**data))
    return agents

def save_agent(agent: Agent):
    path = os.path.join(AGENTS_DIR, agent.id)
    with open(path, "w") as f:
        f.write(repr(agent.dict()))

@router.post("/register")
def register_agent(req: AgentRegisterRequest):
    agent_id = str(uuid.uuid4())
    token = secrets.token_hex(32)
    now = time.time()
    agent = Agent(
        id=agent_id,
        hostname=req.hostname,
        ip=req.ip,
        registered_at=now,
        last_ping=now,
        token=token,
    )
    save_agent(agent)
    return {"id": agent_id, "token": token}

@router.post("/ping")
def ping_agent(id: str, token: str):
    path = os.path.join(AGENTS_DIR, id)
    if not os.path.exists(path):
        raise HTTPException(404, "Agent not found")
    with open(path) as f:
        data = eval(f.read())
    if data["token"] != token:
        raise HTTPException(403, "Bad token")
    data["last_ping"] = time.time()
    with open(path, "w") as f:
        f.write(repr(data))
    return {"ok": True}

@router.get("/list", response_model=List[Agent])
def list_agents(current_user=Depends(deps.get_current_active_superuser)):
    return load_agents()

@router.post("/unregister")
def unregister_agent(id: str, current_user=Depends(deps.get_current_active_superuser)):
    path = os.path.join(AGENTS_DIR, id)
    if os.path.exists(path):
        os.remove(path)
    return {"deleted": id}
