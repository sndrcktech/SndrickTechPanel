# agent/agent.py
from fastapi import FastAPI, Request
import subprocess, os, yaml

app = FastAPI()
ROLES_FILE = "/opt/roles.yaml"
BACKUP_DIR = "/backups"

@app.put("/api/role")
async def set_role(request: Request):
    data = await request.json()
    new_role = data.get("role")
    with open(ROLES_FILE) as f:
        catalog = yaml.safe_load(f)
    role_def = next(r for r in catalog if r["role"] == new_role)
    # Backup before change
    subprocess.run(["tar", "-czf", f"{BACKUP_DIR}/pre_{new_role}.tgz", "/etc", "/data"], check=False)
    # Remove unwanted services
    for svc in role_def["uninstall"]:
        subprocess.run(["docker", "rm", "-f", svc], check=False)
    # Setup new services
    for svc in role_def["services"]:
        subprocess.run(["docker", "run", "-d", "--name", svc, f"sandrick/{svc}:latest"], check=True)
    # firewall, secrets, users, etc (добавить по необходимости)
    return {"status": "ok"}

@app.post("/api/docker")
async def docker_cmd(request: Request):
    data = await request.json()
    cmd, args = data.get("cmd"), data.get("args")
    # Пример: запуск контейнера
    if cmd == "run":
        name = args["name"]
        image = args["image"]
        ports = args.get("ports", [])
        envs = args.get("env", {})
        cmdline = ["docker", "run", "-d", "--name", name] + [f"-p {p}" for p in ports] + [f"-e {k}={v}" for k,v in envs.items()] + [image]
        subprocess.run(cmdline, check=True)
        return {"status": "ok"}
    elif cmd == "ls":
        out = subprocess.check_output(["docker", "ps", "-a"]).decode()
        return {"status": "ok", "output": out}
    # Добавить stop/rm/logs/etc
    return {"status": "not_implemented"}
