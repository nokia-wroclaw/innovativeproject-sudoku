from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routers.user_auth import login, register, get_token, utils

utils.connect_to_db()

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

app.include_router(login.router)
app.include_router(register.router)
app.include_router(get_token.router)
