from datetime import timedelta
import logging
from fastapi import Depends, HTTPException, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from starlette.status import HTTP_401_UNAUTHORIZED
from starlette.responses import Response
from .utils import (
    get_user,
    verify_password,
    REFRESH_TOKEN_EXPIRE_MINUTES,
    ACCESS_TOKEN_EXPIRES_MINUTES,
    create_token,
)

router = APIRouter()


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)

    refresh_token = create_token(
        data={"sub": form_data.username}, expires_delta=refresh_token_expires
    )
    access_token = create_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )

    logging.info("User: %s  verified", form_data.username)
    response = Response(status_code=200)

    response.set_cookie(
        key="refresh_token",
        value=jsonable_encoder(refresh_token),
        httponly=True,
        expires=36000,
    )
    response.set_cookie(
        key="access_token",
        value=jsonable_encoder(access_token),
        httponly=True,
        expires=1000,
    )

    return response
