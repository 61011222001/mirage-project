class Animator {
    primaryScene;
    primaryObstruct;

    inLoop = false;
    fps = 120;
    movementSpeed = 1;

    targetCurrent;
    targetSchedule = [];

    targetDirect;

    constructor (primaryObstruct=null, primaryScene=null) {
        this.primaryObstruct = primaryObstruct;
        this.primaryScene = primaryScene;
    }

    addTarget (tX, tY) { this.targetSchedule.push({x: tX, y: tY}); }

    getMoveset (tX, tY) {
        var primpos = this.primaryObstruct.getPosition();

        var x1 = primpos.x, y1 = primpos.y;
        var x2 = tX, y2 = tY;

        var dx = x2-x1, dy = y2-y1;
        var steps = Math.max(Math.abs(dx), Math.abs(dy));

        var xinc = dx/steps, yinc = dy/steps;
        var x = x1, y = y1;

        var moveset = {
            count: 0,
            reach: false,
            target: {x: tX, y: tY},
            ddaSet: {steps: steps, xinc: xinc, yinc: yinc, x: x, y: y}
        };

        return moveset;
    }

    targetCapture (moveset) {
        if (moveset.count < moveset.ddaSet.steps - moveset.count * this.movementSpeed) {
            this.primaryObstruct.setPosition(moveset.ddaSet.x, moveset.ddaSet.y);

            moveset.ddaSet.x += moveset.ddaSet.xinc + (moveset.ddaSet.xinc * this.movementSpeed);
            moveset.ddaSet.y += moveset.ddaSet.yinc + (moveset.ddaSet.yinc * this.movementSpeed);

            moveset.count += 1;

            return moveset;
        }

        moveset.reach = true;
        return moveset;
    }

    setMoveDirect (direct) {this.targetDirect = direct;}
    clearMoveDirect () { this.targetDirect = null; }

    begin (count=0) {
        if (!this.inLoop)
            this.inLoop = true;

        setTimeout(() => {
            if (this.inLoop) {

                if (this.targetDirect != null) {
                    this.primaryObstruct.setPosition(
                        this.primaryObstruct.shape.position.x + this.targetDirect.x*this.movementSpeed,
                        this.primaryObstruct.shape.position.y + this.targetDirect.y*this.movementSpeed
                    );
                }

                if (this.targetCurrent == null) {
                    if (this.targetSchedule.length != 0) {
                        var shift = this.targetSchedule.shift();
                        this.targetCurrent = this.getMoveset(shift.x, shift.y);
                    }
                } else {
                    var capture = this.targetCapture(this.targetCurrent);

                    if (capture.reach) {
                        this.targetCurrent = null;
                    }
                }

                this.begin(count+1);
            } else {
                // code..
            }
        }, 1000/this.fps);
    }

    end () {
        if (this.inLoop) {
            this.inLoop = true;
        }
    }
}