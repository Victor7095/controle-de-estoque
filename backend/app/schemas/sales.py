from ast import List, alias
from datetime import datetime

from pydantic import BaseModel, Field
from app.models.sale import SaleBase
from app.schemas.products import ProductRead
from app.schemas.user import UserRead


class SaleCreate(SaleBase):
  pass


class SaleRead(SaleBase):
  id: int
  product: ProductRead
  bought_by: UserRead = Field(alias='boughtBy')
  created_on: datetime = Field(alias='createdOn')

  class Config:
    allow_population_by_field_name = True


class TenMostSoldProducts(BaseModel):
  product_name: str = Field(alias='productName')
  sales_count: int = Field(alias='salesCount')

  class Config:
    allow_population_by_field_name = True


class SalesGroupedByCategory(BaseModel):
  category_name: str = Field(alias='categoryName')
  sales_count: int = Field(alias='salesCount')

  class Config:
    allow_population_by_field_name = True


class Charts(BaseModel):
  last_four_sales: list[SaleRead] = Field(alias='lastFourSales')
  ten_most_sold_products: list[TenMostSoldProducts] = Field(
      alias='tenMostSoldProducts')
  sales_grouped_by_category: list[SalesGroupedByCategory] = Field(
      alias='salesGroupedByCategory')

  class Config:
    allow_population_by_field_name = True
