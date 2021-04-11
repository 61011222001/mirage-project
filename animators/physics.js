class Physics {
    #fps;
    #gravity;
    #obstructList;

    isBegin;
    inScene;

    constructor (fps=60, gravity=4, obstructList=[], inScene=null) {
        this.#fps =fps;
        this.#gravity = gravity;
        this.#obstructList = obstructList;

        this.isBegin = false;
        this.inScene = inScene;
    }
    
    setFps (fps) { this.#fps = fps; }
    setGravity (gravity) { this.#gravity = gravity}
    setObstructs (obstructList) {this.#obstructList = obstructList;}
    setScene (component) { this.inScene = component; }

    getFps () { return this.#fps; }
    getGravity () { return this.#gravity; }
    getObstructs () { return this.#obstructList; }
    getScene () { return this.inScene; }

    begin () { this.isBegin = true; this.#physicsLoop(); }
    end () { this.isBegin = false; }

    async #physicsLoop () {
        var fall = (count=0) => {
            setTimeout(() => {
                if (this.isBegin) {
                    for (var i in this.#obstructList) {
                        var obstruct = this.#obstructList[i];
                        var shape = obstruct.shape;

                        if (!obstruct.shape.float) {
                            if (shape.obstruction.bottom < this.inScene.shape.obstruction.bottom) {
                                obstruct.setPosition(shape.position.x, shape.position.y + this.#gravity);
                                obstruct.shape.floor = false;
                            } else {
                                obstruct.shape.floor = true;
                            }
                        }
                    }

                    fall(count + 1);
                }
            }, 1000/this.#fps);
        };

        fall();
    }
}