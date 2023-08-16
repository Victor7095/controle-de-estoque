from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
  from app.models.product import Product
  from app.models.user import User


class SaleBase(SQLModel):
  product_id: int = Field(foreign_key="product.id", alias="productId")
  observation: Optional[str] = None
  quantity: int

  class Config:
    allow_population_by_field_name = True


class Sale(SaleBase, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  created_on: datetime = Field(
      default=datetime.utcnow, nullable=True, alias="createdOn")

  product: "Product" = Relationship(back_populates="sales")

  bought_by_id: Optional[int] = Field(
      foreign_key="user.id", alias="boughtById")
  bought_by: "User" = Relationship(back_populates="sales")
