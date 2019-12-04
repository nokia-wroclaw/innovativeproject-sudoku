import logging
from fastapi import HTTPException, APIRouter, Form, Depends
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.responses import Response
from mongoengine import SaveConditionError, NotUniqueError
from .utils import get_password_hash, User

router = APIRouter()

# R0903 gives too-few-public-methods, but class is needed and in correct form.
# C0330 is bad-continuation, which is false positive due
# to splitting init arguments to more readable format.
class RegisterForm:  # pylint: disable=R0903
    def __init__(
        self,  # pylint: disable=C0330
        username: str = Form(...),  # pylint: disable=C0330
        email: str = Form(...),  # pylint: disable=C0330
        password: str = Form(...),  # pylint: disable=C0330
        re_password: str = Form(...),  # pylint: disable=C0330
    ):
        self.username = username
        self.email = email
        self.password = password
        self.re_password = re_password


def add_user_to_db(user: User):
    try:
        user.save()
    except SaveConditionError:
        return None
    except NotUniqueError:
        return None
    logging.info("User: %s  added to DB", user["username"])
    return user


@router.post("/register")
async def register(form_data: RegisterForm = Depends()):
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
