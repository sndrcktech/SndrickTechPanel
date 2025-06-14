# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY app/ ./app/
COPY roles/ ./roles/
COPY policies.yaml topology.yaml ./
RUN pip install fastapi uvicorn[standard] pyyaml requests hvac paramiko

EXPOSE 443

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "443"]
