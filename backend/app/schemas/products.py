from pydantic import Field
from app.models.category import CategoryBase

from app.models.product import ProductBase
from app.schemas.user import UserRead


class ProductCreate(ProductBase):
  pass


class ProductRead(ProductBase):
  id: int
  seller_id: int = Field(alias="sellerId")
  category: CategoryBase
  seller: UserRead


class ProductReadInStore(ProductBase):
  id: int
