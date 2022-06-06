const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        wss.clients.forEach((client) => {
            client.send(`${data}`)
        })
    });
    ws.on('close', function close() {
        wss.clients.forEach((client) => {
            message = {killPlayer:true};
            client.send(JSON.stringify(message));
        })
    });
});

