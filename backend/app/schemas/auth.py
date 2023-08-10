from pydantic import BaseModel


class RegisterRequest(BaseModel):
  username: str
  password: str


class RegisterResponse(BaseModel):
  id: int
  username: str
