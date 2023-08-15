from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from app.dependencies.database_session import get_session
from app.models.product import Product
from app.schemas.products import ProductCreate, ProductRead

router = APIRouter()


@router.get("/", response_model=list[ProductRead])
async def get_products(session: Session = Depends(get_session)):
  statement = select(Product).options(
      selectinload(Product.category)).options(
      selectinload(Product.seller)).order_by(Product.id)
  products = session.exec(statement).all()

  return products


@router.get("/{id}", response_model=ProductRead)
async def get_product(*, session: Session = Depends(get_session), id: int):
  statement = select(Product).where(Product.id == id)
  product = session.exec(statement).first()
  return product


@router.post("/", response_model=ProductRead)
async def create_product(*, session: Session = Depends(get_session), product: ProductCreate, request: Request):
  db_product = Product.from_orm(product)
  db_product.seller_id = request.state.user.id
  session.add(db_product)
  session.commit()
  session.refresh(db_product)
  return db_product


@router.put("/{id}", response_model=ProductRead)
async def update_product(*, session: Session = Depends(get_session), id: int, product: ProductCreate):
  statement = select(Product).where(Product.id == id)
  product_db = session.exec(statement).first()
  product_db.name = product.name
  product_db.price = product.price
  product_db.category_id = product.category_id
  session.add(product_db)
  session.commit()
  session.refresh(product_db)
  return product_db


@router.delete("/{id}", response_model=ProductRead)
async def delete_single_product(*, session: Session = Depends(get_session), id: int):
  statement = select(Product).where(Product.id == id)
  product = session.exec(statement).first()
  session.delete(product)
  session.commit()
  return product


@router.post("/delete-multiple", response_model=list[ProductRead])
async def delete_multiple_products(*, session: Session = Depends(get_session), ids: list[int]):
  statement = select(Product).where(Product.id.in_(ids))
  products = session.exec(statement).all()
  for product in products:
    session.delete(product)
  session.commit()
  return products
