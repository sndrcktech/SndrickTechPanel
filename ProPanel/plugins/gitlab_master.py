# plugins/gitlab_master.py
import subprocess

def main(data):
    vds_ip = data["vds_ip"]
    root_pass = data.get("root_password", "gitlabadmin")
    http_port = data.get("http_port", "8929")
    ssh_port = data.get("ssh_port", "2224")
    # Развёртывание
    cmd = (
        f'docker run -d --name gitlab -p {http_port}:80 -p {ssh_port}:22 '
        f'-e GITLAB_ROOT_PASSWORD={root_pass} gitlab/gitlab-ce:latest'
    )
    subprocess.run(cmd, shell=True, check=True)
    return {"status": "ok", "msg": f"GitLab поднят на http://{vds_ip}:{http_port} (root:{root_pass})"}
