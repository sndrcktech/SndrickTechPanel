import pyotp
import qrcode
from io import BytesIO
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User

router = APIRouter()

# Для реального применения: вынести secret в отдельное поле в User-модели и хранить в базе!

@router.post("/setup")
def setup_mfa(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    secret = pyotp.random_base32()
    # Сохрани secret для пользователя в базе! (для простоты — пропущено)
    # current_user.mfa_secret = secret
    # db.commit()
    otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=current_user.email, issuer_name="SandrickTechPanel")
    return {"secret": secret, "otp_uri": otp_uri}

@router.get("/qr")
def get_mfa_qr(
    secret: str,
    current_user: User = Depends(deps.get_current_active_user)
):
    otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=current_user.email, issuer_name="SandrickTechPanel")
    img = qrcode.make(otp_uri)
    buf = BytesIO()
    img.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")

@router.post("/verify")
def verify_mfa(
    code: str,
    secret: str,
    current_user: User = Depends(deps.get_current_active_user)
):
    totp = pyotp.TOTP(secret)
    if totp.verify(code):
        return {"valid": True}
    else:
        raise HTTPException(400, "Код неверен")
