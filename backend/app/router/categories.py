from fastapi import APIRouter
from sqlmodel import Session, select

from app.models.category import Category
from app.models.database import engine

router = APIRouter()


@router.get("/", response_model=list[Category])
async def get_categories():
  with Session(engine) as session:
    statement = select(Category).order_by(Category.id)
    categories = session.exec(statement).all()
    return categories


@router.get("/{id}", response_model=Category)
async def get_category(id: int):
  with Session(engine) as session:
    statement = select(Category).where(Category.id == id)
    category = session.exec(statement).first()
    return category


@router.post("/", response_model=Category)
async def create_category(category: Category):
  with Session(engine) as session:
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.put("/{id}", response_model=Category)
async def update_category(id: int, category: Category):
  with Session(engine) as session:
    statement = select(Category).where(Category.id == id)
    category_db = session.exec(statement).first()
    category_db.name = category.name
    session.add(category_db)
    session.commit()
    session.refresh(category_db)
    return category_db


@router.delete("/{id}", response_model=Category)
async def delete_single_category(id: int):
  with Session(engine) as session:
    statement = select(Category).where(Category.id == id)
    category = session.exec(statement).first()
    session.delete(category)
    session.commit()
    return category


@router.delete("/", response_model=list[Category])
async def delete_multiple_categories(ids: list[int]):
  with Session(engine) as session:
    statement = select(Category).where(Category.id in ids)
    categories = session.exec(statement).all()
    session.delete(categories)
    session.commit()
    return categories
