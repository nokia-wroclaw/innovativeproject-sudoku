import logging
import random
import string

from fastapi import APIRouter, Cookie
from starlette.websockets import WebSocket, WebSocketDisconnect

from ..lobby import Lobby
from ..auth import verify_refresh_token


lobby_router = APIRouter()
lobby = Lobby()


def random_nickname_development_purposes(stringLength=10):
    letters = string.ascii_lowercase
    return "".join(random.choice(letters) for i in range(stringLength))  # nosec


@lobby_router.websocket("/server/lobby")
async def websocket_endpoint(
    #websocket: WebSocket, access_cookie: str = Cookie(..., key="access_token")
    websocket: WebSocket,
    access_cookie: str = Cookie(None),
):
    username = verify_refresh_token(access_cookie)
    username = random_nickname_development_purposes(10)
    if username is None:
        logging.info("Acces token not verified.")
        return
    logging.info("User: %s entered lobby", username)
    await lobby.connect(websocket, username)
    try:
        await lobby.push(str(lobby.usernames))
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        lobby.remove(websocket, username)
