class player {
    constructor(id,x,y,color,image){
        this.id = id;

        this.x = x;
        this.y = y;

        this.color = color;
        this.image = image;

        this.touchedCoinTimer = 0;
        this.touchedCoin = false;
    }

    draw(ctx){
        if(this.touchedCoin)
            if(this.touchedCoinTimer > new Date().getTime()-200)
                drawcube(ctx,this.x-5,this.y-5,35,"yellow");
            else this.touchedCoin = false;

        drawcube(ctx,this.x,this.y,25,this.color);
        drawImage(ctx,this.image,this.x,this.y);
    }

    justTouchedCoin(){
        this.touchedCoinTimer = new Date().getTime();
        this.touchedCoin = true;
    }

    //getter
    getX = () => this.x;
    getY = () => this.y;
    getId = () => this.id;
    getColor = () => this.color;

    //setter
    setY = (y) => {this.y = y};
    setX = (x) => {this.x = x};
}