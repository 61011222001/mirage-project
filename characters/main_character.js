class MainCharacter extends Character {
    constructor (id="main_character", className="main_character") {
        super(id, className);
        
        this.setSpeed(2.0);
        this.setSize(50, 50);
        this.setBackgroundColor("#006699");
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