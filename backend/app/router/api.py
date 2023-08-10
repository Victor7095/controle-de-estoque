from fastapi import APIRouter

from . import auth, categories, products, sales

api_router = APIRouter()
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(
    categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(
    products.router, prefix="/products", tags=["products"])
api_router.include_router(sales.router, prefix="/sales", tags=["sales"])
