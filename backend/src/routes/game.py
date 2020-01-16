import logging, time

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
        return
    username = verify_refresh_token(access_token)  # handle exceptions: expired 
    if username is None:
        logging.info("Access token not verified.")
        return
    game = None
    for g in games:
        if username in g.usernames:
            await g.connect(websocket, username)
            print("sukces polaczenia")
            game = g
    if game is None:
        print("GAME IS NONE")
        return
    try:
        while True:
            time.sleep(2)
            #await g.push(str(g.players.keys()))
            data = await websocket.receive_text()
            # g.handle_data(data)
    except WebSocketDisconnect:
        game.remove(username)
    except ConnectionClosedError:
        await g.push(("Player %s has disconnected", username))

async def initialize_new_game(usernames):
    game = Game(usernames)
    await game.generator.asend(None)
    games.append(game)
