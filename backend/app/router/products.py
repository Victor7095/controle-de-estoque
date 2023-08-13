from fastapi import APIRouter
from sqlmodel import Session, select

from app.models.product import Product
from app.models.database import engine

router = APIRouter()


@router.get("/", response_model=list[Product])
async def get_products():
  with Session(engine) as session:
    statement = select(Product).order_by(Product.id)
    products = session.exec(statement).all()
    return products


@router.get("/{id}", response_model=Product)
async def get_product(id: int):
  with Session(engine) as session:
    statement = select(Product).where(Product.id == id)
    product = session.exec(statement).first()
    return product


@router.post("/", response_model=Product)
async def create_product(product: Product):
  with Session(engine) as session:
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.put("/{id}", response_model=Product)
async def update_product(id: int, product: Product):
  with Session(engine) as session:
    statement = select(Product).where(Product.id == id)
    product_db = session.exec(statement).first()
    product_db.name = product.name
    product_db.price = product.price
    product_db.category_id = product.category_id
    session.add(product_db)
    session.commit()
    session.refresh(product_db)
    return product_db


@router.delete("/{id}", response_model=Product)
async def delete_single_product(id: int):
  with Session(engine) as session:
    statement = select(Product).where(Product.id == id)
    product = session.exec(statement).first()
    session.delete(product)
    session.commit()
    return product


@router.post("/delete-multiple", response_model=list[Product])
async def delete_multiple_products(ids: list[int]):
  with Session(engine) as session:
    print(ids)
    statement = select(Product).where(Product.id.in_(ids))
    products = session.exec(statement).all()
    for product in products:
      session.delete(product)
    session.commit()
    return products
