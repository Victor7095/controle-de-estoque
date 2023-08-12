from pydantic import BaseModel


class LoginRequest(BaseModel):
  username: str
  password: str


class LoginResponse(BaseModel):
  access_token: str
  token_type: str


class RegisterRequest(BaseModel):
  username: str
  password: str


class RegisterResponse(BaseModel):
  id: int
  username: str
