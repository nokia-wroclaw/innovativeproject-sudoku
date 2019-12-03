from datetime import datetime, timedelta
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel  # pylint: disable=E0611
import jwt
from starlette.status import HTTP_403_FORBIDDEN

# to get a string like this run:
# openssl rand -hex 32

# Secret key will be moved from here, development purposes only.
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

ALGORITHM = "HS256"
REFRESH_TOKEN_EXPIRE_MINUTES = 360
ACCES_TOKEN_EXPIRES_MINUTES = 15

MOCK_DB = {
    "johndoe": {
        "username": "ada",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OX\
ePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="/login")


class User(BaseModel):  # pylint: disable=R0903
    username: str
    email: str = None
    full_name: str = None
    disabled: bool = None


class UserInDB(User):  # pylint: disable=R0903
    hashed_password: str


def verify_password(plain_password, hashed_password):
    return PWD_CONTEXT.verify(plain_password, hashed_password)


def get_password_hash(password):
    return PWD_CONTEXT.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None


def create_token(*, data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_refresh_token(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("sub")
    if not get_user(MOCK_DB, username):
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Session has expired, please login.",
        )
    return username


def verify_acces(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    if payload is not None:
        return True
    return False
