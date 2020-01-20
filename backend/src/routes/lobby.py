import logging

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
    if check_if_in_game(username):
        await websocket.accept()
        await websocket.send_text("in_game_already")
        await websocket.close()
        logging.info("Player: %s was in ongoing-game. Reconnecting", username)
    else:
        await lobby.connect(websocket, username)
        await websocket.send_text(username)
        try:
            await lobby.push(str(list(lobby.players.keys())))
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            lobby.remove(username)
