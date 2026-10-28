from sqlmodel import SQLModel


class OrderItem(SQLModel):
    product_id: int
    name: str
    quantity: int
    price: float


class OrderCreate(SQLModel):
    customer_name: str
    phone: str
    address: str
    items: list[OrderItem]
    total: float
