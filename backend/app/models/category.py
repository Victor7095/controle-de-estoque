from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from app.models.product import Product


class CategoryBase(SQLModel):
  name: str


class Category(CategoryBase, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)

  products: List["Product"] = Relationship(back_populates="category")
