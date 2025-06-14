import secrets
from pydantic import BaseSettings, AnyHttpUrl, validator
from typing import List, Optional, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "SandrickTechPanel"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"

    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000

    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""

    S3_ENDPOINT: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET: str = ""

    PROMETHEUS_URL: str = "http://localhost:9090"

    CF_API_TOKEN: str = ""
    
    PROMETHEUS_URL: str = "http://localhost:9090"
    ALERTMANAGER_URL: str = "http://localhost:9093"

    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "changeme"
    POSTGRES_DB: str = "sandricktech"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    S3_ENDPOINT: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET: str = ""



    @validator("SQLALCHEMY_DATABASE_URI", pre=True, always=True)
    def assemble_db_connection(cls, v, values):
        if isinstance(v, str) and v:
            return v
        return (
            f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}"
            f"@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}"
        )

    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Op_
