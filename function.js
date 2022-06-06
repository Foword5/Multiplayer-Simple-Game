function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function drawcube(ctx,parx,pary,parsize,color){
    ctx.fillStyle = color;
    ctx.fillRect(parx,pary,parsize,parsize);
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}