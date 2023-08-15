from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
  from app.models.product import Product
  from app.models.sale import Sale


class UserBase(SQLModel):
  username: str


class User(UserBase, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  password: str

  products: List["Product"] = Relationship(back_populates="seller")

  sales: List["Sale"] = Relationship(back_populates="bought_by")
