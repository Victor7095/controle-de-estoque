from app.models.product import ProductBase

from app.models.user import UserBase


class UserRead(UserBase):
  id: int


class UserReadWithProducts(UserBase):
  id: int
  products: list[ProductBase] = []
