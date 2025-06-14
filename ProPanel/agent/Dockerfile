# agent/Dockerfile
FROM python:3.11-slim

WORKDIR /agent
COPY agent.py .
RUN pip install fastapi uvicorn pyyaml

EXPOSE 5454

CMD ["uvicorn", "agent:app", "--host", "0.0.0.0", "--port", "5454"]
