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

    constructor (id="charactor", className="charactor", type="obstruct") {
        super(id, className, type);
        
        this.setDistance(15);
        this.setSpeed(2.0);
        this.setSize(50, 50);
        this.setPosition(0, 0);
    }

    getDistance () { return this.distance; }
    setDistance (value) { this.distance = value; }

    moveSet (key) {
        this.movement(
            this.x + this.directionSet[key][0]*this.distance, 
            this.y + this.directionSet[key][1]*this.distance
        );
    }


}