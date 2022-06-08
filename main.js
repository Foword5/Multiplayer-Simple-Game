window.onload = init;

const frameRate = 35;

var ctx;
var canva;
var gaming;
var players = [];
var perso;
const wsId = getRandomInt(9999999999);

var sent = false;

function clear(){
    ctx.fillStyle = "darkgray";
    ctx.fillRect(0,0,canva.width,canva.height);
}

function drawPlayers(ctx,players,main_char){
    players.forEach((player)=>{
        if(main_char.getId() != player.getId()){
            drawcube(ctx,player.getX(),player.getY(),25,player.getColor());
            drawImage(ctx,player_image,player.getX(),player.getY());
        }
    })
}

function sendPosition(ws){
    message = {
        type:"movePlayer",
        playerId:perso.getId(),
        x:perso.getX(),
        y:perso.getY(),
        color:perso.getColor()
    }
    ws.send(JSON.stringify(message));
}

function game(){
    clear();
    drawPlayers(ctx,players,perso);
    if(perso){
        perso.move();
        perso.draw(ctx);
        sendPosition(ws)
    }else if(!sent){
        message = {
            type:"newPlayer",
            wsId: wsId
        };
        ws.send(JSON.stringify(message));
        sent = true;
    }
}

function init(){
    //setting the basics for drawing
    canva = document.getElementById("canvas");
    ctx = canva.getContext('2d');
    
    you_image = document.getElementById("you");
    player_image = document.getElementById("player");

    gaming = setInterval(game, frameRate);
    
    ws.onmessage = function message(data) {
        data = JSON.parse(data.data);
        switch(data.type){
            case "kill": 
                players = [];
                break;
            case "start": 
                if(!perso && data.wsId == wsId){
                    perso = new main_character(canva.height,canva.width,data.playerId,COLORS[getRandomInt(COLORS.length)],you_image);
                    document.addEventListener('keydown', function(){perso.keydown()});
                    document.addEventListener('keyup', function(){perso.keyup()});
                }
                break;
            case "movePlayer":
                if(data.playerId != perso.getId()){
                    movingPlayer = players.find(element => element.getId() == data.playerId);
                    if(movingPlayer != undefined){
                        movingPlayer.setX(data.x);
                        movingPlayer.setY(data.y);
                    }else
                        players.push(new player(data.playerId,data.x,data.y,data.color));
                }
                break;
            default: break;
        }
    };
}