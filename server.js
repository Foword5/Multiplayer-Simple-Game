const WebSocket = require("ws");
const express = require("express");
const http = require('http')

const PORT = process.env.PORT || 3000; //The port will automaticly be 3000 on localhost, but if you use a host, like heroku, it might change

/*     _
      / \
     / | \   You need to go to localhost:3000 for testing
    /  |  \  Or else the external files won't be found by th program
   /   .   \ But the index.html will as it's everything not specified
  /_________\
*/

const app = express()
app.use(express.static('public'))
const server = http.createServer(app)

const wss = new WebSocket.Server({ server });

var players = [];

//This is where the fun begins

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var players = [];
var coinCoords = {
    x:getRandomInt(680)+50,
    y:getRandomInt(680)+50
}

function checkForDeadPlayers(){
    updatePlayers= [];
    for(i=0;i<players.length;i++)
        if(!(players[i].timer < new Date().getTime()-1000))
            updatePlayers.push(players[i]);
    players = updatePlayers
        
}
setInterval(checkForDeadPlayers, 1000);

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        analyse = JSON.parse(data);
        switch(analyse.type){
            case "newPlayer":
                do{id=getRandomInt(9999999999)}while (players.find(element => element.id == id) != undefined);
                players.push({id:id,score:0,pseudo:analyse.pseudo,timer:new Date().getTime()});
                msg={
                    type:"start",
                    wsId:analyse.wsId,
                    playerId: id,
                    coinX:coinCoords.x,
                    coinY:coinCoords.y
                }
                update={
                    type:"updateScore",
                    info:players
                }
                wss.clients.forEach((client) => {
                    client.send(JSON.stringify(msg));
                    client.send(`${JSON.stringify(update)}`);
                });
                players.push();
                break;
            case "touchCoin":
                try{players.find(element => element.id == analyse.playerId).score++}catch(e){};
                coinCoords = {
                    x:getRandomInt(680)+50,
                    y:getRandomInt(680)+50
                }
                update={
                    type:"updateScore",
                    info:players
                }
                move={
                    type:"coinTouched",
                    x:coinCoords.x,
                    y:coinCoords.y,
                    playerId:analyse.playerId
                }
                wss.clients.forEach((client) => {
                    client.send(`${JSON.stringify(update)}`);
                    client.send(`${JSON.stringify(move)}`);
                });
                break;
            case "movePlayer":
                try{players.find(element => element.id == analyse.playerId).timer = new Date().getTime();}catch(e){}
                wss.clients.forEach((client) => {
                    client.send(`${data}`)
                });
                break;
            default: 
                wss.clients.forEach((client) => {
                    client.send(`${data}`)
                });
                break;
        }
    });
    ws.on('close', function close() {
        wss.clients.forEach((client) => {
            wss.clients.forEach((client) => {
                client.send(JSON.stringify({type:"kill"}));
            });
        })
    });
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
