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
from ..auth import verify_refresh_token


game_router = APIRouter()
games: List[Game] = []


@game_router.websocket("/api/game")
async def websocket_endpoint(websocket: WebSocket):
    try:
        access_token = websocket.cookies["access_token"]
    except KeyError:
        logging.error("No cookie found")
        return
    username = verify_refresh_token(access_token)
    if username is None:
        logging.info("Access token not verified.")
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
    except WebSocketDisconnect:
        game.remove(username)
        if len(game.players) == 0 and game not in games:
            games.remove(game)
    except ConnectionClosedError:
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
        await websocket.send_json(json.dumps({"winner": True}))
        game.players.pop(username)
        game.usernames.remove(username)
        for p in game.usernames:
            logging.info("checking players")
            if game.players_data[p].timer - time() <= 0.2:
                await game.players[p].send_json(json.dumps({"timeout": True}))
                logging.info("time out on player")
                try:
                    game.players.pop(p)
                    game.usernames.remove(p)
                except KeyError:
                    pass
                except ValueError:
                    pass
