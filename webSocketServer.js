const WebSocket = require('ws');


module.exports = (expressServer, onConnectionCallback) => {
    const webSocketServer = new WebSocket.Server({
        noServer: true
    });

    expressServer.on("upgrade", (request, socket, head) => {
        webSocketServer.handleUpgrade(request, socket, head, (websocket) => {
            webSocketServer.emit("connection", websocket, request);
        });
    });

    webSocketServer.on(
        "connection",
        onConnectionCallback
    );

    return webSocketServer;
}