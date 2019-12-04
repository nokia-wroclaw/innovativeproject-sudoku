from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from .routers.auth import auth_router
from .auth.auth import connect_to_db

connect_to_db()

app = FastAPI()

origins = [
    "http:localhost",
    "http:localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "HEAD", "POST", "CONNECT"],
    allow_headers=["*"],
)

app.include_router(auth_router)
