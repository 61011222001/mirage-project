class Obstruct extends Component {
    #speed = null;
    #steps = null;
    #xinc = null;
    #yinc = null;
    #reach = null;

    constructor (id="obstruct", className="obstruct", type="obstruct") {
        super(id, className, type);

        this.setSpeed(4.0);
    }

    getSpeed () { return this.#speed; }
    setSpeed (value) { this.#speed = value; }
    
    movement (tx, ty) {
        var x1 = this.x, y1 = this.y;
        var x2 = tx, y2 = ty;

        var dx = x2-x1, dy = y2-y1;
        
        this.#steps = Math.max(Math.abs(dx), Math.abs(dy));
        this.#xinc = dx/this.#steps;
        this.#yinc = dy/this.#steps;
        this.#reach = 0;
    }

    loop (func = () => {}) {
        super.loop((obj) => {
            if (this.#reach < this.#steps/this.#speed) {
                this.setPosition(
                    this.x + this.#xinc*this.#speed, 
                    this.y + this.#yinc*this.#speed
                );

                this.#reach += 1;
            }

            func(this);
        });
    }
}