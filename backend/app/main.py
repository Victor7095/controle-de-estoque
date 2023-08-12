from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models.database import create_db_and_tables
from .router.api import api_router

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
  create_db_and_tables()


app.include_router(api_router)
