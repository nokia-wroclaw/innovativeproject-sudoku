from datetime import timedelta
from fastapi import Depends, HTTPException, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from starlette.status import HTTP_401_UNAUTHORIZED
from starlette.responses import Response
from .utils import (
    get_user,
    verify_password,
    MOCK_DB,
    REFRESH_TOKEN_EXPIRE_MINUTES,
    ACCES_TOKEN_EXPIRES_MINUTES,
    create_token,
)


router = APIRouter()


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


@router.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(MOCK_DB, form_data.username, form_data.password)
    if not user:
        print("User NOT verified.")
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    refresh_token_expires = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    access_token_expires = timedelta(minutes=ACCES_TOKEN_EXPIRES_MINUTES)

    refresh_token = create_token(
        data={"sub": form_data.username}, expires_delta=refresh_token_expires
    )
    acces_token = create_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    ref_token = jsonable_encoder(refresh_token)
    acc_token = jsonable_encoder(acces_token)

    print("User succesfully verified.")
    response = Response(status_code=200)

    response.set_cookie(
        key="refresh_token", value=f"{ref_token}", httponly=True,
    )
    response.set_cookie(
        key="access_token", value=f"{acc_token}", httponly=True,
    )

    return response
