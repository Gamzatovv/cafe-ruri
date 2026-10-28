import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlmodel import Session, select

from app.api.dependencies import require_admin
from app.db.session import get_session
from app.models.product import Product
from app.schemas.product import ProductRead

router = APIRouter(prefix="/products", tags=["products"])

UPLOAD_DIR = Path("/app/data/uploads")
MAX_IMAGE_SIZE = 5 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
}


def _save_image(image: UploadFile) -> str:
    content_type = (image.content_type or '').lower()
    extension = ALLOWED_IMAGE_TYPES.get(content_type)
    if not extension:
        raise HTTPException(400, 'Разрешены только JPG, PNG, WebP и AVIF')

    data = image.file.read(MAX_IMAGE_SIZE + 1)
    if len(data) > MAX_IMAGE_SIZE:
        raise HTTPException(400, 'Размер изображения не должен превышать 5 МБ')
    if not data:
        raise HTTPException(400, 'Файл изображения пустой')

    # Проверяем сигнатуру файла, а не доверяем только MIME-заголовку браузера.
    signatures = {
        'image/jpeg': data.startswith(b'\xff\xd8\xff'),
        'image/png': data.startswith(b'\x89PNG\r\n\x1a\n'),
        'image/webp': data.startswith(b'RIFF') and data[8:12] == b'WEBP',
        'image/avif': b'ftypavif' in data[:64] or b'ftypavis' in data[:64],
    }
    if not signatures.get(content_type, False):
        raise HTTPException(400, 'Файл не похож на допустимое изображение')

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{extension}"
    (UPLOAD_DIR / filename).write_bytes(data)
    return f"/api/uploads/{filename}"


def _remove_local_image(image_url: str | None):
    prefix = "/api/uploads/"
    if image_url and image_url.startswith(prefix):
        path = UPLOAD_DIR / Path(image_url[len(prefix):]).name
        try:
            path.unlink(missing_ok=True)
        except OSError:
            pass


@router.get("", response_model=list[ProductRead])
def list_products(category: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Product)
    if category and category != "Все":
        query = query.where(Product.category == category)
    return session.exec(query.order_by(Product.id)).all()


@router.post("", response_model=ProductRead, dependencies=[Depends(require_admin)])
def create_product(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    if not name.strip() or not category.strip() or not description.strip():
        raise HTTPException(422, "Заполните название, тип и описание")
    if price <= 0:
        raise HTTPException(422, "Цена должна быть больше нуля")

    image_url = _save_image(image)
    db_product = Product(
        name=name.strip(),
        category=category.strip(),
        description=description.strip(),
        price=price,
        image=image_url,
    )
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


@router.put("/{product_id}", response_model=ProductRead, dependencies=[Depends(require_admin)])
def update_product(
    product_id: int,
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    image: UploadFile | None = File(None),
    session: Session = Depends(get_session),
):
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(404, "Блюдо не найдено")
    if not name.strip() or not category.strip() or not description.strip():
        raise HTTPException(422, "Заполните название, тип и описание")
    if price <= 0:
        raise HTTPException(422, "Цена должна быть больше нуля")

    db_product.name = name.strip()
    db_product.category = category.strip()
    db_product.description = description.strip()
    db_product.price = price

    if image is not None and image.filename:
        old_image = db_product.image
        db_product.image = _save_image(image)
        _remove_local_image(old_image)

    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


@router.delete("/{product_id}", dependencies=[Depends(require_admin)])
def delete_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Блюдо не найдено")
    _remove_local_image(product.image)
    session.delete(product)
    session.commit()
    return {"ok": True}
