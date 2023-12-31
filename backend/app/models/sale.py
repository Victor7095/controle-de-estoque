from datetime import datetime
from typing import TYPE_CHECKING, Optional

import sqlalchemy as sa
from sqlalchemy import func
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
  created_on: datetime = Field(nullable=True, alias="createdOn", default=func.now(),
                               sa_column=sa.Column(sa.DateTime(timezone=True)))

  product: "Product" = Relationship(back_populates="sales")

  bought_by_id: Optional[int] = Field(
      foreign_key="user.id", alias="boughtById")
  bought_by: "User" = Relationship(back_populates="sales")
