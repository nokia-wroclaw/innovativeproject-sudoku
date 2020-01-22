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
REFRESH_TOKEN_EXPIRE_MINUTES = 360
ACCESS_TOKEN_EXPIRES_MINUTES = 60
REFRESH_COOKIE_LIFETIME = 36000
ACCESS_COKIE_LIFETIME = 1000

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="/login")


class RegisterForm:
    def __init__(
        self,
        username: str = Form(...),
        email: str = Form(...),
        password: str = Form(...),
        re_password: str = Form(...),
    ):
        self.username = username
        self.email = email
        self.password = password
        self.re_password = re_password


def create_user(username: str, email: str, password: str) -> User:
    hashed_password = get_password_hash(password)
    user = User(
        username=username, email=email, hashed_password=hashed_password, disabled=False,
    )
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


def create_token(*, data: dict, expires_delta: timedelta = None) -> jwt:
    to_encode = data.copy()
    if expires_delta is None:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALG)


def verify_token(token) -> str:
    if token is None:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALG])
    except ExpiredSignatureError:
        return None
    username: str = payload.get("sub")

    if get_user(username) is None:
        return None
    return username


def authenticate_user(username: str, password: str) -> User:
    user = get_user(username)
    if user is None or not verify_password(password, user.hashed_password):
        return None
    return user


def verify_cookies(cookies: Dict) -> str:
    try:
        access_token = cookies["access_token"]
        username = verify_token(access_token)
        if username is not None:
            return username
        raise CookieVerificationError
    except KeyError:
        raise CookieVerificationError


class CookieVerificationError(Exception):
    """Raised when user does not provide valid access token."""
