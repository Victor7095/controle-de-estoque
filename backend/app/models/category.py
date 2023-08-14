from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
  from app.models.product import Product


class Category(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  name: str

  products: List["Product"] = Relationship(back_populates="category")
