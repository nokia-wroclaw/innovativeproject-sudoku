import logging
import json

from fastapi import APIRouter, Cookie
from starlette.websockets import WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError

from ..game import Game
from ..auth import verify_refresh_token
from typing import List


game_router = APIRouter()
games: List[Game] = []


@game_router.websocket("/api/game")
async def websocket_endpoint(
    websocket: WebSocket
):
    try:
        access_token = websocket.cookies["access_token"]
    except:
        logging.error("No cookie found")
        return
    username = verify_refresh_token(access_token)  # handle exceptions: expired 
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
        logging.info("Player: %s tried to connect /game, but no game was found with him.", username)
        return
    try:
        await g.push(str(g.players.keys()))
        while True:
            data = await websocket.receive_text()
            await g.handle_data(data, username)
    except WebSocketDisconnect:
        game.remove(username)
    except ConnectionClosedError:
        await g.push(("Player %s has disconnected", username))


async def initialize_new_game(usernames):
    game = Game(usernames)
    await game.generator.asend(None)
    games.append(game)


def check_if_in_game(username):
    for g in games:
        if username in g.usernames:
            return True
    return False
