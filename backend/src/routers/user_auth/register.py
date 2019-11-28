from fastapi import HTTPException, APIRouter
from starlette.status import HTTP_417_EXPECTATION_FAILED, HTTP_409_CONFLICT
from starlette.responses import Response
from pydantic import BaseModel
from .utils import MOCK_DB, get_password_hash, User


router = APIRouter()


class Register_form(BaseModel):
    username: str
    email: str
    password: str
    rePassword: str


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
    print("User: ", user["username"], "added.")


@router.post("/register")
async def register(form_data: Register_form):
    if form_data.password != form_data.rePassword:
        print("Passwords were not the same.")
        raise HTTPException(
            status_code=HTTP_417_EXPECTATION_FAILED,
            detail="Repeat password correctly.",
        )

    hashed_password = get_password_hash(form_data.password)
    user = {
        "username": form_data.username,
        "email": form_data.email,
        "hashed_password": hashed_password,
        "disabled": False,
    }
    if not check_user_uniqueness(MOCK_DB, user):
        print("User already taken.")
        raise HTTPException(
            status_code=HTTP_409_CONFLICT, detail="Username or email already taken.",
        )
    add_user_to_db(user)
    response = Response(status_code=200)
    return response
