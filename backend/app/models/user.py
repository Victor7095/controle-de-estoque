from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
  from app.models.product import Product


class UserBase(SQLModel):
  username: str


class User(UserBase, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  password: str

  products: list["Product"] = Relationship(back_populates="seller")
