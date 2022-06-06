const WebSocket = require("ws");
const express = require("express");

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
 
const wss = new WebSocket.Server({ server });

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
