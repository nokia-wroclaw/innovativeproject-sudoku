import logging

from fastapi import Depends, HTTPException, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.responses import Response
from starlette.requests import Request
from mongoengine import SaveConditionError, NotUniqueError

from ..auth import (
    REFRESH_TOKEN_LIFETIME,
    ACCESS_TOKEN_LIFETIME,
    create_token,
    create_user,
    authenticate_user,
    verify_cookies,
    RegisterForm,
    UserVerificationError,
    CookieVerificationError,
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
        key="username", value=form_data.username, expires=REFRESH_TOKEN_LIFETIME
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
