import logging
from asyncio import sleep
from time import time

from fastapi import APIRouter
from starlette.websockets import WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosedError
from ..lobby import Lobby
from ..auth import verify_cookies, CookieVerificationError
from .game import check_if_in_game
from .game import initialize_new_game

lobby_router = APIRouter()
lobby = Lobby()

LOBBY_TIMEOUT = 16.0
MIN_PLAYERS = 3


@lobby_router.websocket("/lobby")
async def websocket_endpoint(websocket: WebSocket):
    try:
        username = verify_cookies(websocket.cookies, name="access_token")
        logging.info("User: %s entered lobby", username)
    except CookieVerificationError:
        logging.info("Cookie verification failed.")
        return
    try:
        if check_if_in_game(username):
            await websocket.accept()
            await websocket.send_json({"type": "event", "code": "in_game_already"})
            await websocket.close()
            logging.info("Player: %s was in ongoing-game. Reconnecting", username)
            return
        await lobby.connect(websocket, username)
        if not lobby.timer_started and len(lobby.players) == MIN_PLAYERS:
            lobby.timer_started = True
            lobby.timer_end = time() + LOBBY_TIMEOUT
            await lobby.push({"code": "timer_on"})
            while True:
                await lobby.push(
                    {"code": "time", "time": lobby.timer_end - time(),}
                )
                await sleep(0.5)
                if len(lobby.players) == 0:
                    lobby.timer_started = False
                    return
                if len(lobby.players) < MIN_PLAYERS:
                    lobby.timer_started = False
                    await lobby.push({"code": "timer_off"})
                    while True:
                        await websocket.receive_json()
                if lobby.timer_end - time() < 0:
                    logging.info("Game start - not full lobby")
                    await lobby.push({"code": "start_game"})
                    await initialize_new_game(list(lobby.players.keys()))
                    lobby.timer_started = False
        else:
            while True:
                await websocket.receive_json()
    except (WebSocketDisconnect, ConnectionClosedError):
        lobby.remove(username)
        await lobby.push({"code": "players", "players": lobby.get_usernames()})
