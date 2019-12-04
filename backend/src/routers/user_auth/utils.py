import logging
from getpass import getpass
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import jwt
from mongoengine import (
    connect,
    StringField,
    BooleanField,
    Document,
    DoesNotExist,
    MultipleObjectsReturned,
)

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

ALGORITHM = "HS256"
REFRESH_TOKEN_EXPIRE_MINUTES = 360
ACCESS_TOKEN_EXPIRES_MINUTES = 15

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="/login")


class User(Document):
    username = StringField(required=True, max_length=200)
    email = StringField(required=True, max_length=200)
    hashed_password = StringField(required=True, max_length=200)
    disabled = BooleanField(required=True)


def connect_to_db():
    print("Database login: ")
    username = input()  # nosec
    password = getpass()
    try:
        connect(
            "usersdb",
            username=username,
            password=password,
            authentication_source="admin",
        )
    except ConnectionError as ex:
        logging.error(
            "%s.Connection to database failed - authentication endpoints wont work.", ex
        )


def verify_password(plain_password, hashed_password):
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def get_password_hash(password):
    return PWD_CONTEXT.hash(password)


def get_user(username: str):
    try:
        user = User.objects.get(username=username)
    except DoesNotExist:
        return None
    except MultipleObjectsReturned:
        logging.error("%s - critical error in database, multiple instances of user.")
    return user


def create_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta is None:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_refresh_token(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("sub")

    if get_user(username) is None:
        return None
    return username


def verify_acces(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    if payload is not None:
        return True
    return False
