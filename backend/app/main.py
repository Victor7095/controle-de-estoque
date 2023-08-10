from typing import Union

from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from .models.database import create_db_and_tables
from .router.api import api_router

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.on_event("startup")
def on_startup():
  create_db_and_tables()


app.include_router(api_router)
