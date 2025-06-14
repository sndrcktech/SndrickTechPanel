from sqlalchemy.orm import Session
from app.models.audit import AuditLog

def log_action(db: Session, user_email: str, action: str, data: dict = None):
    record = AuditLog(user_email=user_email, action=action, data=data or {})
    db.add(record)
    db.commit()
