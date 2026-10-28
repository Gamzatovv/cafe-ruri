import secrets

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import ADMIN_PASSWORD

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminLogin(BaseModel):
    password: str


@router.post("/login")
def admin_login(payload: AdminLogin):
    if not secrets.compare_digest(payload.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Неверный пароль администратора")
    return {"ok": True}
