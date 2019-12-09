from datetime import timedelta
import logging

from fastapi import Depends, HTTPException, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.responses import Response
from starlette.requests import Request
from mongoengine import SaveConditionError, NotUniqueError

from ..auth import (
    REFRESH_TOKEN_EXPIRE_MINUTES,
    ACCESS_TOKEN_EXPIRES_MINUTES,
    REFRESH_COOKIE_LIFETIME,
    ACCESS_COKIE_LIFETIME,
    create_token,
    create_user,
    authenticate_user,
    verify_refresh_token,
    RegisterForm,
)


auth_router = APIRouter()


@auth_router.post("/register")
async def register(form_data: RegisterForm = Depends()):
    if form_data.password != form_data.re_password:
        logging.info("Passwords were not the same.")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Repeat password correctly.",
        )
    try:
        create_user(form_data.username, form_data.email, form_data.password)
        return Response(status_code=200)
    except (NotUniqueError, SaveConditionError) as error:
        logging.error(error)
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Username or email already taken.",
        )


@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Incorrect username or password",
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
        expires=REFRESH_COOKIE_LIFETIME,
    )
    response.set_cookie(
        key="access_token",
        value=jsonable_encoder(access_token),
        httponly=True,
        expires=ACCESS_COKIE_LIFETIME,
    )

    return response


@auth_router.get("/get-access-token")
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
    access_token = create_token(
        data={"sub": username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES),
    )
    response.set_cookie(
        key="access_token",
        value=jsonable_encoder(access_token),
        httponly=True,
        expires=ACCESS_COKIE_LIFETIME,
    )
    return response
