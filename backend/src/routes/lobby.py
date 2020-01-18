import logging
import random
import string

from fastapi import APIRouter, Cookie, Header, Body, Depends, Path
from starlette.websockets import WebSocket, WebSocketDisconnect
from starlette.requests import Request
from starlette.status import WS_1008_POLICY_VIOLATION
from ..lobby import Lobby
from ..auth import verify_refresh_token
from .game import check_if_in_game

lobby_router = APIRouter()
lobby = Lobby()

@lobby_router.websocket("/api/lobby")
async def websocket_endpoint(
    websocket: WebSocket
):
    try:
        access_token = websocket.cookies["access_token"]
    except:
        return
    username = verify_refresh_token(access_token)
    print(username)
    if username is None:
        logging.info("Acces token not verified.")
        return
    logging.info("User: %s entered lobby", username)
    if check_if_in_game(username):
        print("Duupa")
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

