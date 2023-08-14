from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
  from app.models.product import Product


class User(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  username: str
  password: str

  products: list["Product"] = Relationship(back_populates="seller")
