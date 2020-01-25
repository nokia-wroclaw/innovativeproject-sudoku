from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.responses import JSONResponse
from starlette.requests import Request
from ..models import UserStats

from mongoengine import DoesNotExist


from ..auth import (
    verify_cookies,
    CookieVerificationError,
)

stats_router = APIRouter()


@stats_router.get("/stats")
async def get_stats(request: Request) -> JSONResponse:
    try:
        username = verify_cookies(request.cookies, "access_token")
        user = UserStats.objects.get(username=username)
        json_data = user.to_json()
        response = JSONResponse(json_data)
        print(json_data)
        return response
    except (CookieVerificationError, DoesNotExist):
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST)


def get_current_top():
    pass
