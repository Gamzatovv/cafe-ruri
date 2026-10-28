import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from app.core.config import CORS_ORIGINS
from app.db.session import engine
from app.db.seed import seed_products
from app.models import Product
from app.api.routers import products, orders, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("/app/data", exist_ok=True)
    SQLModel.metadata.create_all(engine)
    from sqlmodel import Session
    with Session(engine) as session:
        seed_products(session)
    yield

app = FastAPI(title="РУРИ API", version="2.1.0", lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)

app.mount("/api/uploads", StaticFiles(directory="/app/data/uploads", check_dir=False), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok"}

app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
