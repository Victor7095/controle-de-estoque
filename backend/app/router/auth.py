from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.dependencies.jwt import authenticate_user, create_access_token, Token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models.database import engine
from app.models.user import User
from app.schemas.auth import RegisterRequest, RegisterResponse

router = APIRouter()


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
  user = authenticate_user(engine, form_data.username, form_data.password)
  if not user:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
  access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = create_access_token(
      data={"sub": user.username}, expires_delta=access_token_expires
  )
  return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=RegisterResponse)
async def register(payload: RegisterRequest):
  with Session(engine) as session:
    statement = select(User).where(User.username == payload.username)
    user = session.exec(statement).first()
    if user:
      raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Username already registered",
      )

    try:
      user = User(
          username=payload.username,
          password=get_password_hash(payload.password),
      )
      session.add(user)
      session.commit()
      session.refresh(user)
      return user
    except Exception as e:
      raise HTTPException(
          status_code=status.HTTP_400_BAD_REQUEST,
          detail="Failed to register user",
      )