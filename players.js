class player {
    constructor(id,x,y,color){
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
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