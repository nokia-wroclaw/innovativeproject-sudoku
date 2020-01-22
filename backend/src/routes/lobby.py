import logging
import json

from fastapi import APIRouter
from starlette.websockets import WebSocket, WebSocketDisconnect
from ..lobby import Lobby
from ..auth import verify_cookies, CookieVerificationError
from .game import check_if_in_game

lobby_router = APIRouter()
lobby = Lobby()


@lobby_router.websocket("/lobby")
async def websocket_endpoint(websocket: WebSocket):
    try:
        username = verify_cookies(websocket.cookies)
    except CookieVerificationError:
        logging.info("Cookie verification failed.")
        return
    logging.info("User: %s entered lobby", username)
    try:
        if check_if_in_game(username):
            await websocket.accept()
            await websocket.send_json({"type": "event", "code": "in_game_already"})
            await websocket.close()
            logging.info("Player: %s was in ongoing-game. Reconnecting", username)
        else:
            await lobby.connect(websocket, username)
            while True:
                await websocket.receive_json()
    except WebSocketDisconnect:
        lobby.remove(username)
