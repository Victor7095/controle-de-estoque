from ast import List

from pydantic import BaseModel
from app.models.sale import SaleBase
from app.schemas.products import ProductRead
from app.schemas.user import UserRead


class SaleCreate(SaleBase):
  pass


class SaleRead(SaleBase):
  id: int
  product: ProductRead
  bought_by: UserRead


class TenMostSoldProducts(BaseModel):
  product_name: str
  sales_count: int


class SalesGroupedByCategory(BaseModel):
  category_name: str
  sales_count: int


class Charts(BaseModel):
  last_four_sales: list[SaleRead]
  ten_most_sold_products: list[TenMostSoldProducts]
  sales_grouped_by_category: list[SalesGroupedByCategory]
