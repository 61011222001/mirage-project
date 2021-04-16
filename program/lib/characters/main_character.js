class MainCharacter extends Character {
    status = null;

    constructor (id="main_character", className="main_character") {
        super(id=id, className=className);

        this.status = new Status();
        
        this.setSpeed(2.0);
        // this.setBackgroundColor("#006699");
        this.setBackgroundImage("./src/imgs/main_character.gif");
        this.setTransform(-1, 1);
        

        this.add(this.status);
    }

    setPosition(x, y) {
        var top = y;
        var bottom = y + this.height;
        var left = x;
        var right = x + this.width;

        if ((left > 0 && right < WIDTH) && (top > 0 && bottom < HEIGHT)) {
            super.setPosition(x, y);
        }
    }
}