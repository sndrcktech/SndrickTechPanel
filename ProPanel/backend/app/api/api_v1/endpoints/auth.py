from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app import crud, schemas, models
from app.core import security
from app.core.config import settings
from app.api import deps

router = APIRouter()

@router.post("/access-token
