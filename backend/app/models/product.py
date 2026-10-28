from typing import Optional
from sqlmodel import SQLModel, Field


class ProductBase(SQLModel):
    name: str
    category: str
    description: str
    price: float
    image: str


class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
