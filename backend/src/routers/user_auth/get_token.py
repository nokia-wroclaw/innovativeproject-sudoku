from datetime import timedelta
from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from starlette.requests import Request
from starlette.responses import Response
from .utils import (
    verify_refresh_token,
    ACCES_TOKEN_EXPIRES_MINUTES,
    create_token,
)


router = APIRouter()


@router.get("/get-acces-token")
async def get_acces_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    response = Response()

    username = verify_refresh_token(refresh_token)
    if username:
        access_token_expires = timedelta(minutes=ACCES_TOKEN_EXPIRES_MINUTES)
        acces_token = create_token(
            data={"sub": username}, expires_delta=access_token_expires
        )
        acc_token = jsonable_encoder(acces_token)
        response.set_cookie(
            key="access_token", value=f"{acc_token}", httponly=True,
        )

    return response
