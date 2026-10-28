import secrets

from fastapi import Header, HTTPException

from app.core.config import ADMIN_PASSWORD


def require_admin(x_admin_password: str = Header(default='')):
    if not secrets.compare_digest(x_admin_password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail='Неверный пароль администратора')
