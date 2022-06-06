class player {
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }

    //getter
    getX = () => this.x;
    getY = () => this.y;
    getId = () => this.id;

    //setter
    setY = (y) => {this.y = y};
    setX = (x) => {this.x = x};
}