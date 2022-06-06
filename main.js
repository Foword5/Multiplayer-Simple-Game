window.onload = init;

const frameRate = 35;

var ctx;
var canva;
var gaming;
var players = [];

function clear(){
    ctx.fillStyle = "darkgray";
    ctx.fillRect(0,0,canva.width,canva.height);
}

function drawPlayers(ctx,players,main_char){
    players.forEach((player)=>{
        if(main_char.getId() != player.getId()){
            drawcube(ctx,player.x,player.y,25,"red");
        }
    })
}

function sendPosition(ws){
    message = {
        killPlayer:false,
        playerId:perso.getId(),
        x:perso.getX(),
        y:perso.getY()
    }
    ws.send(JSON.stringify(message));
}

function game(){
    clear();
    drawPlayers(ctx,players,perso);
    perso.move();
    perso.draw(ctx);
    sendPosition(ws)
}

function init(){
    //setting the basics for drawing
    canva = document.getElementById("canvas");
    ctx = canva.getContext('2d');

    //creating the main caracter
    perso = new main_character(canva.height,canva.width,getRandomInt(9999999999));
    document.addEventListener('keydown', function(){perso.keydown()});
    document.addEventListener('keyup', function(){perso.keyup()});
    
    gaming = setInterval(game, frameRate);

    ws.onopen = function open() {
        message = {
            killPlayer:false,
            playerId:perso.getId(),
            x:perso.getX(),
            y:perso.getY()
        };
        ws.send(JSON.stringify(message));
    };
    
    ws.onmessage = function message(data) {
        data = JSON.parse(data.data);
        if(data.killPlayer) players = [];
        else
            if(data.playerId != perso.id){
                newPlayer = true;
                players.forEach((player)=>{
                    if(player.getId() == data.playerId){
                        player.setX(data.x);
                        player.setY(data.y);
                        newPlayer = false;
                    }
                })
                if(newPlayer) players.push(new player(data.playerId,data.x,data.y))
            }
    };
}