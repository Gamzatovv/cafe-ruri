from app.models.product import ProductBase


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: int
