import logging

from fastapi import APIRouter, Cookie
from starlette.websockets import WebSocket, WebSocketDisconnect

from ..game import Game, parse_change
from ..auth import verify_refresh_token
from typing import List


game_router = APIRouter()
games: List[Game] = []


@game_router.websocket("/server/game")
async def websocket_endpoint(
   #  websocket: WebSocket, access_cookie: str = Cookie(..., key="access_token")
    websocket: WebSocket,
    access_cookie: str = Cookie(None),
):
    username = verify_refresh_token(access_cookie)
    if username is None:
        logging.info("Acces token not verified.")
        return
    game = None
    for g in games:
        if username in g.usernames:
            await g.connect(websocket, username)
            game = g
    if game is None:
        return
    await game.generator.asend(None)
    try:
        while True:
            game.generator.asend(parse_change(websocket.receive_text()))

    except WebSocketDisconnect:
        game.remove(websocket, username)


def initialize_new_game(usernames):
    game = Game(usernames)
    games.append(game)
