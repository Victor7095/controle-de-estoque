from fastapi import APIRouter, Depends

from app.dependencies.jwt import get_current_user

from . import auth, categories, products, sales

api_router = APIRouter(redirect_slashes=False)
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(
    categories.router, prefix="/categories", tags=["categories"], dependencies=[Depends(get_current_user)])
api_router.include_router(
    products.router, prefix="/products", tags=["products"], dependencies=[Depends(get_current_user)])
api_router.include_router(sales.router, prefix="/sales",
                          tags=["sales"], dependencies=[Depends(get_current_user)])
