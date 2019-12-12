import logging

from fastapi import APIRouter, Cookie
from starlette.websockets import WebSocket, WebSocketDisconnect

from ..lobby import Lobby
from ..auth import verify_refresh_token


lobby_router = APIRouter()
lobby = Lobby()
lobby.generator.asend(None)


@lobby_router.websocket("/server/lobby")
async def websocket_endpoint(
    websocket: WebSocket, acces_cookie: str = Cookie(..., key="acces_token")
):
    username = verify_refresh_token(acces_cookie)
    if username is None:
        logging.info("Acces token not verified.")
        return
    logging.info("User verified: %s", username)
    await lobby.connect(websocket, username)
    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        lobby.remove(websocket, username)
