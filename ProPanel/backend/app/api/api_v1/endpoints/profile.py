from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api import deps
from app.core.security import get_password_hash, verify_password
from app.crud.user import user as crud_user

router = APIRouter()

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

@router.post("/change_password")
def change_password(
    data: ChangePassword,
    db: Session = Depends(deps.get_db),
    current_user=Depends(deps.get_current_active_user)
):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(400, detail="Старый пароль неверен")
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"changed": True}
