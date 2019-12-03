import logging
from fastapi import HTTPException, APIRouter
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.responses import Response
from pydantic import BaseModel  # pylint: disable=E0611
from .utils import MOCK_DB, get_password_hash, User

router = APIRouter()


class RegisterForm(BaseModel):  # pylint: disable=R0903
    username: str
    email: str
    password: str
    re_password: str


def check_user_uniqueness(db, user: User):
    # Needs refractoring for less stupid solution.
    for users in db:
        if (
            db[users]["email"] == user["email"]  # pylint: disable=C0330
            or db[users]["username"] == user["username"]  # pylint: disable=C0330
        ):
            return False
    return True


def add_user_to_db(user: User):
    # There will be adding to database, but db is required.
    logging.info("User: %s  added to DB (curretnly mocked)", user["username"])


@router.post("/register")
async def register(form_data: RegisterForm):
    if form_data.password != form_data.re_password:
        logging.info("Passwords were not the same.")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Repeat password correctly.",
        )

    hashed_password = get_password_hash(form_data.password)
    user = {
        "username": form_data.username,
        "email": form_data.email,
        "hashed_password": hashed_password,
        "disabled": False,
    }
    if not check_user_uniqueness(MOCK_DB, user):
        logging.info("User: %s already taken", user["username"])
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail="Username or email already taken.",
        )
    add_user_to_db(user)
    response = Response(status_code=200)
    return response
