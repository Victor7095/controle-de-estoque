from typing import TYPE_CHECKING, List, Optional

from sqlmodel import Field, Relationship, SQLModel


if TYPE_CHECKING:
  from app.models.category import Category
  from app.models.user import User
  from app.models.sale import Sale


class ProductBase(SQLModel):
  name: str
  price: float
  stock_quantity: int = Field(alias="stockQuantity")
  category_id: int = Field(foreign_key="category.id", alias="categoryId")

  class Config:
    allow_population_by_field_name = True


class Product(ProductBase, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  seller_id: Optional[int] = Field(
      default=None, foreign_key="user.id", alias="sellerId")
  seller: "User" = Relationship(back_populates="products")
  category_id: int = Field(foreign_key="category.id", alias="categoryId")
  category: "Category" = Relationship(back_populates="products")
  sales: List["Sale"] = Relationship(back_populates="product")
