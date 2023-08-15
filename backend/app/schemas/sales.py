from app.models.sale import SaleBase
from app.schemas.products import ProductRead
from app.schemas.user import UserRead


class SaleCreate(SaleBase):
  pass


class SaleRead(SaleBase):
  id: int
  product: ProductRead
  bought_by: UserRead
