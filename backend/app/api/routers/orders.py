import smtplib
from datetime import datetime
from email.message import EmailMessage
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.config import MAIL_FROM, ORDER_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER
from app.models.order import OrderCreate

router = APIRouter(prefix="/orders", tags=["orders"])


def _send_email(subject: str, body: str) -> None:
    if not SMTP_USER or not SMTP_PASSWORD:
        raise RuntimeError("SMTP_USER и SMTP_PASSWORD не настроены")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = MAIL_FROM
    message["To"] = ORDER_EMAIL
    message.set_content(body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(SMTP_USER, SMTP_PASSWORD)
        smtp.send_message(message)


def _moscow_now() -> str:
    return datetime.now(ZoneInfo("Europe/Moscow")).strftime("%d.%m.%Y, %H:%M")


@router.post("")
def create_order(order: OrderCreate):
    if not order.customer_name.strip() or not order.phone.strip() or not order.address.strip():
        raise HTTPException(422, "Заполните имя, телефон и адрес или комментарий")
    if not order.items:
        raise HTTPException(422, "Корзина пуста")
    if any(item.quantity < 1 for item in order.items):
        raise HTTPException(422, "Количество должно быть не меньше 1")
    if any(not item.name.strip() for item in order.items):
        raise HTTPException(422, "У блюда отсутствует название")
    if order.total < 0:
        raise HTTPException(422, "Некорректная сумма заказа")

    order_time = _moscow_now()
    lines = [
        "Новый заказ",
        f"Дата и время: {order_time} (Москва)",
        f"Имя: {order.customer_name.strip()}",
        f"Телефон: {order.phone.strip()}",
        f"Адрес или комментарий: {order.address.strip()}",
        "",
        "Блюда:",
    ]
    for item in order.items:
        lines.append(f"- {item.name.strip()} × {item.quantity}")
    lines.append(f"Итого: {order.total:g} сум")

    try:
        _send_email("Новый заказ", "\n".join(lines))
    except Exception as exc:
        print(f"Order email error: {type(exc).__name__}: {exc}")
        raise HTTPException(
            503,
            "Не удалось отправить заказ.",
        )

    return {"ok": True, "message": "Заказ принят"}


class CallbackRequest(BaseModel):
    name: str
    phone: str


@router.post("/callback")
def request_callback(callback: CallbackRequest):
    if not callback.name.strip() or not callback.phone.strip():
        raise HTTPException(422, "Заполните имя и телефон")

    request_time = _moscow_now()
    body = "\n".join(
        [
            "Новая заявка на обратный звонок",
            f"Дата и время: {request_time} (Москва)",
            f"Имя: {callback.name.strip()}",
            f"Телефон: {callback.phone.strip()}",
        ]
    )

    try:
        _send_email("Заявка на обратный звонок", body)
    except Exception as exc:
        print(f"Callback email error: {type(exc).__name__}: {exc}")
        raise HTTPException(
            503,
            "Не удалось отправить заявку.",
        )

    return {"ok": True, "message": "Заявка отправлена"}
