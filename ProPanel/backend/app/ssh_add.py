# backend/app/ssh_add.py
from fastapi import APIRouter, HTTPException
import paramiko
import os

router = APIRouter()
AGENT_FILE = "agent/agent.py"

@router.post("/api/servers/addssh")
def add_server_via_ssh(ip: str, port: int, login: str, password: str, region: str):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(ip, port=port, username=login, password=password)
        sftp = client.open_sftp()
        sftp.put(AGENT_FILE, "/usr/local/bin/agent.py")
        client.exec_command("nohup python3 /usr/local/bin/agent.py &")
        client.close()
        # тут можно обновить topology.yaml и вызвать orchestration
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(400, f"SSH Error: {e}")
