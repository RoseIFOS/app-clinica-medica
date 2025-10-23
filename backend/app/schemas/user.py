from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from ..models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    nome: str
    role: UserRole = UserRole.RECEPCIONISTA
    crm: Optional[str] = None
    especialidade: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    role: Optional[UserRole] = None
    crm: Optional[str] = None
    especialidade: Optional[str] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDB):
    pass


class UserLogin(BaseModel):
    email: str  # Pode ser email ou username
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[User] = None


class TokenData(BaseModel):
    email: Optional[str] = None
