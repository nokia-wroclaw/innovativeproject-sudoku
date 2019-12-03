import logging
from fastapi import HTTPException, APIRouter
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.responses import Response
from pydantic import BaseModel  # pylint: disable=E0611
from mongoengine import SaveConditionError
from .utils import get_password_hash, User

router = APIRouter()


class RegisterForm(BaseModel):  # pylint: disable=R0903
    username: str
    email: str
    password: str
    re_password: str


def add_user_to_db(user: User):
    try:
        user.save()
    except SaveConditionError:
        return None
    logging.info("User: %s  added to DB (curretnly mocked)", user["username"])
    return user


@router.post("/register")
async def register(form_data: RegisterForm):
    if form_data.password != form_data.re_password:
        logging.info("Passwords were not the same.")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Repeat password correctly.",
        )
    hashed_password = get_password_hash(form_data.password)
    user = User(
        username=form_data.username,
        email=form_data.email,
        hashed_password=hashed_password,
        disabled=False,
    )
    if add_user_to_db(user) is None:
        logging.info("User: %s already taken", user["username"])
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Username or email already taken.",
        )
    response = Response(status_code=200)
    return response
