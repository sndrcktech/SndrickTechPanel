from sqlalchemy import Boolean, Column, Integer, String, Enum
from app.db.base_class import Base
import enum

class UserRoleEnum(str, enum.Enum):
    admin = "admin"
    user = "user"
    readonly = "readonly"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    role = Column(Enum(UserRoleEnum), default=UserRoleEnum.user, nullable=False)
