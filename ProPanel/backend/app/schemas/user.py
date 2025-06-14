from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    user = "user"
    readonly = "readonly"

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    role: UserRole = UserRole.user

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str]
    email: Optional[EmailStr]
    is_active: Optional[bool]
    role: Optional[UserRole]

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
