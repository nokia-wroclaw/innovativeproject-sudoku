import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from mongoengine import NotUniqueError, SaveConditionError
from starlette.requests import Request
from starlette.responses import Response
from starlette.status import HTTP_400_BAD_REQUEST

from ..auth import (
    ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_LIFETIME,
    CookieVerificationError,
    RegisterForm,
    UserVerificationError,
    authenticate_user,
    create_token,
    create_user,
    verify_cookies,
)

auth_router = APIRouter()


@auth_router.post("/register")
async def register(form_data: RegisterForm = Depends()) -> Response:
    if form_data.password != form_data.re_password:
        logging.info("Passwords were not the same.")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Repeat password correctly.",
        )
    try:
        create_user(form_data.username, form_data.password)

        response = Response(status_code=200)

        response.set_cookie(
            key="refresh_token",
            value=jsonable_encoder(
                create_token(
                    data={"sub": form_data.username}, lifetime=REFRESH_TOKEN_LIFETIME
                )
            ),
            httponly=True,
            expires=REFRESH_TOKEN_LIFETIME,
        )
        response.set_cookie(
            key="access_token",
            value=jsonable_encoder(
                create_token(
                    data={"sub": form_data.username}, lifetime=ACCESS_TOKEN_LIFETIME
                )
            ),
            httponly=True,
            expires=ACCESS_TOKEN_LIFETIME,
        )

        return response
    except (NotUniqueError, SaveConditionError) as error:
        logging.error(error)
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Username or email already taken.",
        )


@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Response:
    try:
        authenticate_user(form_data.username, form_data.password)
        logging.info("User: %s  verified", form_data.username)
    except UserVerificationError:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Incorrect username or password",
        )

    response = Response(status_code=200)

    response.set_cookie(
        key="refresh_token",
        value=jsonable_encoder(
            create_token(
                data={"sub": form_data.username}, lifetime=REFRESH_TOKEN_LIFETIME
            )
        ),
        httponly=True,
        expires=REFRESH_TOKEN_LIFETIME,
    )
    response.set_cookie(
        key="access_token",
        value=jsonable_encoder(
            create_token(
                data={"sub": form_data.username}, lifetime=ACCESS_TOKEN_LIFETIME
            )
        ),
        httponly=True,
        expires=ACCESS_TOKEN_LIFETIME,
    )
    response.set_cookie(
        key="username",
        value=form_data.username.encode("latin-1", errors="ignore"),
        expires=REFRESH_TOKEN_LIFETIME,
    )
    return response


@auth_router.get("/get-access-token")
async def get_acces_token(request: Request) -> Response:
    try:
        username = verify_cookies(request.cookies, "refresh_token")
    except CookieVerificationError:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST)
    response = Response()
    response.set_cookie(
        key="access_token",
        value=jsonable_encoder(
            create_token(data={"sub": username}, lifetime=ACCESS_TOKEN_LIFETIME)
        ),
        httponly=True,
        expires=ACCESS_TOKEN_LIFETIME,
    )
    return response


@auth_router.get("/logout")
async def logout() -> Response:
    response = Response()
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    response.delete_cookie(key="username")
    return response
