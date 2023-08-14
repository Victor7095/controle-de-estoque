from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
  from app.models.category import Category
  from app.models.user import User


class Product(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  name: str
  price: float
  stock_quantity: int

  category_id: Optional[int] = Field(default=None, foreign_key="category.id")
  category: "Category" = Relationship(back_populates="products")

  seller_id: Optional[int] = Field(default=None, foreign_key="user.id")
  seller: "User" = Relationship(back_populates="products")
