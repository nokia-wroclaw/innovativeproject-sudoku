from fastapi import FastAPI, Header, HTTPException
from starlette.responses import PlainTextResponse
from routers import login, lobby


app = FastAPI()


async def get_token_header(x_token: str = Header(...)):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


app.include_router(login.router)
app.include_router(lobby.router)


@app.get("/")
async def get():
    return PlainTextResponse("test")
