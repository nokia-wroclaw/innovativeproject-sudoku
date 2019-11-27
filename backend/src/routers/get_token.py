from fastapi import APIRouter
from starlette.requests import Request
from starlette.responses import Response, RedirectResponse
from .login import *
import jwt
from starlette.status import HTTP_403_FORBIDDEN


router = APIRouter()


def verify_refresh_token(token):
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not get_user(MOCK_DB, username):
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="Session has expired, please login.",
            )
            return None
        return username


@router.get("/get-acces-token")
async def get_acces_token(request: Request, previous_url = None):
    refresh_token=request.cookies.get('refresh_token')
    response = RedirectResponse("/menu")
    if previous_url != None:
        response = RedirectResponse(previous_url)

    username = verify_refresh_token(refresh_token)
    if username:
        access_token_expires = timedelta(minutes=ACCES_TOKEN_EXPIRES_MINUTES)
        acces_token = create_token(
        data={"sub":username}, expires_delta=access_token_expires)
        acc_token = jsonable_encoder(acces_token)
        response.set_cookie(
            key="access_token",
            value=f"{acc_token}",
            httponly=True,
        )

    return response