class main_character {
    constructor(canvasHeight,canvasWidth,id,color,image){
        this.x = 250;
        this.y = 250;
        this.size = 25;
        this.speed = 15;

        this.vecposx = 0;
        this.vecposy = 0;
        this.vecnegx = 0;
        this.vecnegy = 0;

        this.id = id;
        
        this.color = color;
        this.image = image;

        this.touchedCoinTimer = 0;
        this.touchedCoin = false;

        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
    }

    keydown(input){
        this.e = input || window.event;
        this.e = this.e.keyCode;
        if(this.e == 90)
            this.vecnegy = -this.speed;
        else if(this.e == 83)
            this.vecposy = this.speed;

        if(this.e == 81 )
            this.vecnegx = -this.speed;
        else if(this.e == 68)
            this.vecposx = this.speed;
        
    }
    
    keyup(input){
        this.e = input || window.event;
        this.e = this.e.keyCode;
        if(this.e == 90)
            this.vecnegy = 0;
        else if(this.e == 83)
            this.vecposy = 0;

        if(this.e == 81 )
            this.vecnegx = 0;
        else if(this.e == 68)
            this.vecposx = 0;
    }

    move(){
        if(this.vecnegx && this.vecposx){}
        else if(this.x-this.speed >= 0 && this.vecnegx)
            this.x += this.vecnegx;
        else if(this.x+this.size+this.speed <= this.canvasWidth && this.vecposx)
            this.x += this.vecposx;
        
        if(this.vecnegy && this.vecposy){}
        else if(this.y-this.speed >= 0 && this.vecnegy)
            this.y += this.vecnegy;
        else if(this.y+this.size+this.speed <= this.canvasHeight && this.vecposy)
            this.y += this.vecposy;
    }

    draw(ctx){
        if(this.touchedCoin)
            if(this.touchedCoinTimer > new Date().getTime()-200)
                drawcube(ctx,this.x-5,this.y-5,this.size+10,"yellow");
            else this.touchedCoin = false;
        drawcube(ctx,this.x,this.y,this.size,this.color);
        drawImage(ctx,this.image,this.x,this.y-25);
    }

    justTouchedCoin(){
        this.touchedCoinTimer = new Date().getTime();
        this.touchedCoin = true;
    }

    //getter
    getX = () => this.x;
    getY = () => this.y;
    getSize = () => this.size;
    getId = () => this.id;
    getColor = () => this.color;

    //setter
    setSpeed = (speed) => {this.speed = speed};
}