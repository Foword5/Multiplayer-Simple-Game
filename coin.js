class coin {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 20;
    }

    touch_move_coin(main_char,ws){
        if (
        main_char.getX() < this.x + this.size && 
        main_char.getX() + main_char.getSize() > this.x && 
        main_char.getY() < this.y + this.size && 
        main_char.getSize() + main_char.getY() > this.y) {
            var msg={
                type:'touchCoin',
                playerId:main_char.getId()
            };
            ws.send(JSON.stringify(msg));
            main_char.justTouchedCoin();
        }
    }

    draw(ctx){
        drawcircle(ctx,this.x,this.y,this.size,"yellow");
    }

    //getter
    getX = () => this.x;
    getY = () => this.y;
    getSize = () => this.size;

    //setter
    setX = (x) => {this.x = x};
    setY = (y) => {this.y = y};
}