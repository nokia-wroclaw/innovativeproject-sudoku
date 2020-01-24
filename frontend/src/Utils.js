export default class CrazyAssWebSocket extends WebSocket {
  constructor(url) {
    super(
      (window.location.protocol === "https:" ? "wss://" : "ws://") +
        window.location.host +
        url
    );
  }
}
