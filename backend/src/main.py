from fastapi import Depends, FastAPI, Header, HTTPException

from .routers import login

app = FastAPI()

async def get_token_header(x_token: str = Header(...)):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")

@router.get("/")
async def root():
    return {"message": "Hello World!"}

app.include_router(login.router)