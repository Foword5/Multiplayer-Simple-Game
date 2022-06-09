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

function updateScores(scores){
    myscore = 0;
    try{myscore =scores.find(element => element.id == perso.getId()).score}catch(e){}
    document.getElementById("myscore").innerHTML = "Your score : "+myscore;

    leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";
    leaderboard.appendChild(document.createElement("div").appendChild(document.createTextNode("LeaderBoard :")));

    var sortedScore = scores.sort(function(a, b) { return b.score - a.score; });

    for(var i=0;i<sortedScore.length;i++){
        playerColor = players.find(element => element.getId() == sortedScore[i].id);
        if(playerColor) color = playerColor.color;
        else color = perso.color;

        innerDiv = document.createElement("div");
        innerDiv.setAttribute("style","background-color:"+color+";width:20px;height:20px;margin-right:5px");

        outerDiv = document.createElement("div");
        outerDiv.setAttribute("style","display:flex");
        outerDiv.appendChild(innerDiv);
        outerDiv.appendChild(document.createTextNode(" "+(i+1)+". "+sortedScore[i].pseudo+" : "+sortedScore[i].score));

        leaderboard.appendChild(outerDiv);
    }
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
        coin.touch_move_coin(perso,ws);
        coin.draw(ctx);
        perso.draw(ctx);
        sendPosition(ws);
    }else if(!sent){
        message = {
            type:"newPlayer",
            wsId: wsId,
            pseudo: pseudo
        };
        ws.send(JSON.stringify(message));
        sent = true;
    }
}

function starting_game(){
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
                    coin = new coin(data.coinX,data.coinY)
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
            case "updateScore":
                updateScores(data.info);
                break;
            case "moveCoin":
                if(coin){
                    coin.setX(data.x);
                    coin.setY(data.y);
                }
                break;
            default: break;
        }
    };
}

function init(){
    document.getElementById("submit").addEventListener("click", () => {
        pseudo = document.getElementById("pseudo").value;
        if(pseudo != ""){
            document.body.innerHTML += `
                <div id="myscore">Your score : loading...</div>
                <div id="game">
                    <canvas width="800px" height="800px" id="canvas"></canvas>
                    <div id="leaderboard">Leaderboard : <br />Loading...</div>
                </div>
            `;
            document.getElementById("choose").innerHTML = "";
            starting_game();
        }else alert("Veuillez entrez un pseudo");
    });
}