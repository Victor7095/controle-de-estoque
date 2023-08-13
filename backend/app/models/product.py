from typing import Optional, Required

from sqlmodel import Field, Relationship, SQLModel

from app.models.category import Category


class Product(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  name: str
  price: float
  category: Category = Relationship(back_populates="products")
  stock_quantity: int
