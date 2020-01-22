import logging
import json
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
        await websocket.send_text("no_game")
        logging.info(
            "Player: %s tried to connect /game, but no game was found with him.",
            username,
        )
        return
    try:
        while True:
            try:
                wrapper = []
                await wait_for(get_data(websocket, wrapper), timeout=1.0)
                await game.handle_data(wrapper[0], username)
            except asyncio.TimeoutError:
                await check_timers(websocket, username, game)
    except (WebSocketDisconnect, ConnectionClosedError):
        game.remove(username)
        if len(game.players) == 0 and game not in games:
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
    data = await websocket.receive_text()
    wrapper.append(data)


async def check_timers(websocket, username, game):
    if len(game.usernames) == 1:
        await websocket.send_json({"winner": True})
        game.players.pop(username)
        game.usernames.remove(username)
    for p in game.usernames:
        if game.players_data[p].timer - time() <= 0.2:
            await game.players[p].send_json({"timeout": True})
            logging.info("time out on player %s", username)
            try:
                game.players.pop(p)
                game.usernames.remove(p)
            except (KeyError, ValueError):
                pass
