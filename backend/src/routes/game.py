import logging
from time import time
from asyncio import wait_for
import asyncio.exceptions
from typing import List

from fastapi import APIRouter
from starlette.websockets import WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError

from ..game import Game
from ..auth import verify_cookies, CookieVerificationError


game_router = APIRouter()
games: List[Game] = []


@game_router.websocket("/game")
async def websocket_endpoint(websocket: WebSocket):
    try:
        username = verify_cookies(websocket.cookies)
    except CookieVerificationError:
        logging.info("Cookie verification failed.")
        return

    game = None
    for g in games:
        if username in g.usernames:
            await g.connect(websocket, username)
            game = g
    if game is None:
        await websocket.accept()
        await websocket.send_json({"type": "event", "code": "no_game"})
        logging.info(
            "Player: %s tried to connect /game, but no game was found with him.",
            username,
        )
        return

    while True:
        try:
            data = []  # a wrapper to achieve _pass_by_reference_
            await wait_for(get_data(websocket, data), timeout=1.0)
            await game.handle_board(
                data[0], username
            )  # ! It won't be always a board so it should be checked
        except asyncio.TimeoutError:
            await check_timers(websocket, username, game)
        except (WebSocketDisconnect, ConnectionClosedError):
            game.remove(username)
            if len(game.players) == 0 and game in games:
                games.remove(game)


async def initialize_new_game(usernames):
    game = Game(usernames)
    await game.generator.asend(None)
    games.append(game)


def check_if_in_game(username):
    for g in games:
        if username in g.usernames:
            return True
    return False


async def get_data(websocket, wrapper):
    data = await websocket.receive_json()
    wrapper.append(data)


async def check_timers(websocket, username, game):
    if len(game.usernames) == 1:
        await websocket.send_json({"type": "event", "code": "game_won"})
        game.players.pop(username)
        game.usernames.remove(username)
    for p in game.usernames:
        if game.players_data[p].timer - time() <= 0.2:
            await game.players[p].send_json({"type": "event", "code": "game_lost"})
            logging.info("time out on player %s", username)
            try:
                game.players.pop(p)
                game.usernames.remove(p)
            except (KeyError, ValueError):
                pass
