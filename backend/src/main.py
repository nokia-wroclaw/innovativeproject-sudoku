from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Header, HTTPException
from routers import login, lobby, register
from starlette.responses import JSONResponse

app = FastAPI()

origins = [
    "http:localhost",
    "http:localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_token_header(x_token: str = Header(...)):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


app.include_router(login.router)
app.include_router(lobby.router)
app.include_router(register.router)
