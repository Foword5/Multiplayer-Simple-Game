const WebSocket = require("ws");
const express = require("express");

const PORT = process.env.PORT || 3000; //The port will automaticly be 3000 on localhost, but if you use a host, like heroku, it might change

const INDEX = '/index.html';//the index of the website, for the client
const FILES = //Any files refered to in the client
    [
        '/function.js',
        '/character.js',
        '/players.js',
        '/main.js',
        '/const.js',
        '/sprites/you.png',
        '/sprites/player.png',
        '/coin.js'
    ];

//We use a String so the server is set in only one command, cause for some reason it doesn't work if it's done on multiple lines ¯\_(ツ)_/¯
var serverSTR = 'express()';

//All external files must be refered in the use of the server before being used in any other files
//We first set all Files and then, any other link will refer to the INDEX variables, the order is important
FILES.forEach((file)=>{
    console.log(`File ${file} loaded`);
    serverSTR +=
    `.use('${file}',function(req, res){
        res.sendFile('${file}', { root: __dirname });
    })`;
})
serverSTR +=
`.use(function(req, res){
    res.sendFile('${INDEX}', { root: __dirname });
})
.listen(${PORT}, () => console.log(\`Listening on ${PORT}\`));`

const server = eval(serverSTR);
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
