const WebSocket = require("ws");
const express = require("express");

const PORT = process.env.PORT || 3000; //The port will automaticly be 3000 on localhost, but if you use a host, like heroku, it might change

const INDEX = '/index.html';//the index of the website, for the client
const FILES = //Any files refered to in the client
    [
        '/function.js',
        '/character.js',
        '/players.js',
        '/main.js'
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

//This is where the fun begins
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
