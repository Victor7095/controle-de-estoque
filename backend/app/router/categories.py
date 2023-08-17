from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.dependencies.database_session import get_session

from app.models.category import Category
from app.models.database import engine

router = APIRouter()


@router.get("", response_model=list[Category], include_in_schema=False)
@router.get("/", response_model=list[Category])
async def get_categories(*, session: Session = Depends(get_session)):
  statement = select(Category).order_by(Category.id)
  categories = session.exec(statement).all()
  return categories


@router.get("/{id}", response_model=Category)
async def get_category(*, session: Session = Depends(get_session), id: int):
  statement = select(Category).where(Category.id == id)
  category = session.exec(statement).first()
  return category


@router.post("", response_model=Category, include_in_schema=False)
@router.post("/", response_model=Category)
async def create_category(*, session: Session = Depends(get_session), category: Category):
  session.add(category)
  session.commit()
  session.refresh(category)
  return category


@router.put("/{id}", response_model=Category)
async def update_category(*, session: Session = Depends(get_session), id: int, category: Category):
  statement = select(Category).where(Category.id == id)
  category_db = session.exec(statement).first()
  category_db.name = category.name
  session.add(category_db)
  session.commit()
  session.refresh(category_db)
  return category_db


@router.delete("/{id}", response_model=Category)
async def delete_single_category(*, session: Session = Depends(get_session), id: int):
  statement = select(Category).where(Category.id == id)
  category = session.exec(statement).first()
  session.delete(category)
  session.commit()
  return category


@router.post("/delete-multiple", response_model=list[Category])
async def delete_multiple_categories(*, session: Session = Depends(get_session), ids: list[int]):
  statement = select(Category).where(Category.id.in_(ids))
  categories = session.exec(statement).all()
  for category in categories:
    session.delete(category)
  session.commit()
  return categories
