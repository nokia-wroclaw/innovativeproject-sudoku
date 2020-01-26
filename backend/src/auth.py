import logging
from datetime import datetime, timedelta
from os import environ
from typing import Dict


import jwt
from jwt.exceptions import ExpiredSignatureError
from fastapi import Form
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from mongoengine import (
    connect,
    DoesNotExist,
)
from .models import User


SECRET_KEY = environ["SUDOKUBR_SECRET_KEY"]
DB_USERNAME = environ["SUDOKUBR_DB_USERNAME"]
DB_PASSWORD = environ["SUDOKUBR_DB_PASSWORD"]

JWT_ALG = "HS256"

REFRESH_TOKEN_LIFETIME = 72000
ACCESS_TOKEN_LIFETIME = 36000

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="/login")


class RegisterForm:
    def __init__(
        self,
        username: str = Form(...),
        password: str = Form(...),
        re_password: str = Form(...),
    ):
        self.username = username
        self.password = password
        self.re_password = re_password


def create_user(username: str, password: str) -> User:
    hashed_password = get_password_hash(password)
    user = User(username=username, hashed_password=hashed_password)
    user.save()
    logging.info("User: %s added to DB", user["username"])


def connect_to_db():
    try:
        connect(
            "usersdb",
            username=DB_USERNAME,
            password=DB_PASSWORD,
            authentication_source="admin",
            host="mongo",
            port=27017,
        )
    except ConnectionError as error:
        logging.error(error)


def verify_password(plain_password, hashed_password) -> bool:
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def get_password_hash(password) -> hash:
    return PWD_CONTEXT.hash(password)


def get_user(username: str) -> User:
    try:
        return User.objects.get(username=username)
    except DoesNotExist:
        return None


def create_token(*, data: dict, lifetime: int) -> jwt:
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(minutes=lifetime)})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALG)


def verify_token(token) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALG])
        username = payload.get("sub")
        if get_user(username) is not None:
            return username
        raise TokenVerificationError
    except ExpiredSignatureError:
        raise TokenVerificationError


def authenticate_user(username: str, password: str) -> None:
    user = get_user(username)
    if user is None or not verify_password(password, user.hashed_password):
        raise UserVerificationError


def verify_cookies(cookies: Dict, name) -> str:
    try:
        token = cookies[name]
        return verify_token(token)
    except (TokenVerificationError, KeyError):
        raise CookieVerificationError


class TokenVerificationError(Exception):
    """Raised when user does not provide valid access token."""


class CookieVerificationError(Exception):
    """Raised when user does not provide valid access token."""


class UserVerificationError(Exception):
    """Raised wher user does not provide valid password or username."""
