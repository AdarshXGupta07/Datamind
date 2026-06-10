from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class RoleEnum(str, Enum):
    admin = "admin"
    viewer = "viewer"


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.admin


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: RoleEnum
    workspace_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ConnectionCreate(BaseModel):
    name: str
    host: str
    port: int = 5432
    db_name: str
    username: str
    password: str


class ConnectionUpdate(BaseModel):
    name: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    db_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None


class ConnectionOut(BaseModel):
    id: int
    name: str
    host: str
    port: int
    db_name: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class TestConnectionRequest(BaseModel):
    host: str
    port: int = 5432
    db_name: str
    username: str
    password: str
