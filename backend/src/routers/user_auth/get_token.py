from datetime import timedelta
from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.requests import Request
from starlette.responses import Response
from .utils import (
    verify_refresh_token,
    ACCESS_TOKEN_EXPIRES_MINUTES,
    create_token,
)


router = APIRouter()


@router.get("/get-access-token")
async def get_acces_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    response = Response()
    if refresh_token is None:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="No rights to refresh token.",
        )
    username = verify_refresh_token(refresh_token)
    if username is None:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Username not found.",
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    acces_token = create_token(
        data={"sub": username}, expires_delta=access_token_expires
    )
    acc_token = jsonable_encoder(acces_token)
    response.set_cookie(
        key="access_token", value=acc_token, httponly=True, expires=1000,
    )

    return response
