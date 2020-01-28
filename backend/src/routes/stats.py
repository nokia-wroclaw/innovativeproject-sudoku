import json
from time import time

from fastapi import APIRouter, HTTPException
from mongoengine import DoesNotExist
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.status import HTTP_400_BAD_REQUEST

from ..auth import CookieVerificationError, verify_cookies
from ..game import Player
from ..models import UserStats

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
    for i, player in enumerate(players):
        player_json = {}
        player_json["username"] = player.username
        player_json["games_won"] = player.games_won
        top5_dict[i] = player_json
    return top5_dict


def update_stats(player: Player, username: str, won: bool):
    user = UserStats.objects.get(username=username)
    user.time_spend += time() - player.start_time
    user.heals += player.heals
    user.attacks += player.attacks
    user.games_total += 1
    user.games_won += 1 if won else 0
    user.save()
