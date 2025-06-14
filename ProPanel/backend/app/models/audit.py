from sqlalchemy import Column, Integer, String, DateTime, JSON
from app.db.base_class import Base
from datetime import datetime

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    action = Column(String, index=True)
    data = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
