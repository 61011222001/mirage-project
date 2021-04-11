class Charactor extends Obstruct {
    distance = null;
    directionSet = {
        left: [-1, 0],
        right: [1, 0],
        up: [0, -1],
        down: [0, 1],
        left_up: [-1, -1],
        left_down: [-1, 1],
        right_up: [1, -1],
        right_down: [1, 1]
    };

    constructor (id=null, className=null) {
        super((id == null) ? "charactor@" + Math.floor(Math.random()*1000) : id, 
            (className == null) ? "charactor" : className);
        
        this.setDistance(50);
    }

    getDistance () { return this.distance; }
    setDistance (value) { this.distance = value; }

    setMoveDirect (direction) {
        var dir = this.directionSet[direction];
        var dis = this.distance;
        var dx = this.x + dir[0]*dis;
        var dy = this.y + dir[1]*dis

        this.setMovement(dx, dy);

        return [dx, dy];
    }
}