from time import time
import json

from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_400_BAD_REQUEST
from starlette.responses import JSONResponse
from starlette.requests import Request
from mongoengine import DoesNotExist

from ..models import UserStats
from ..auth import (
    verify_cookies,
    CookieVerificationError,
)
from ..game import Player

stats_router = APIRouter()


@stats_router.get("/stats")
async def get_stats(request: Request) -> JSONResponse:
    try:
        username = verify_cookies(request.cookies, "access_token")
        user = UserStats.objects.get(username=username)
        player_stats = json.loads(user.to_json())
        response_json = {}
        del player_stats["_id"]
        response_json["top5"] = get_current_top()
        response_json["player_stats"] = player_stats
        return JSONResponse(response_json)
    except (CookieVerificationError, DoesNotExist):
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST)


def get_current_top():
    players = UserStats.objects.order_by("-games_won").limit(5)
    top5_dict = {}
    position = 1
    for player in players:
        player_json = {}
        player_json["username"] = player.username
        player_json["games_won"] = player.games_won
        top5_dict[position] = player_json
        position += 1
    return top5_dict


def update_stats(player: Player, username: str, won: bool):
    user = UserStats.objects.get(username=username)
    user.time_spend += time() - player.start_time
    user.heals += player.heals
    user.attacks += player.attacks
    user.games_total += 1
    if won:
        user.games_won += 1
    user.save()
