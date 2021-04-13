class MainScene extends Scene {
    mainCharacter;
    mainCharacterLabel;

    secCharcter;
    secCharcterLabel;

    constructor (id="main_scene", className="scene") {
        super(id, className);

        this.mainCharacter = new MainCharacter();
        this.mainCharacterLabel = new Label();

        this.secCharcter = new Character();
        this.secCharcterLabel = new Label();

        this.setPosition(0, 0);
        this.setBackgroundColor("#ddd");
    }

    player (func=() => {}) { func(this.mainCharacter) }
    begin (func=() => {}) {
        this.mainCharacter.setPosition(600, 400);

        this.mainCharacterLabel.setOpacity(0.9);
        this.mainCharacterLabel.setFontSize(12);
        this.mainCharacterLabel.setSize(200, 35);

        this.secCharcter.setBackgroundColor("#3d8f3d");
        this.secCharcter.setPosition(500, 300);

        this.secCharcterLabel.setOpacity(0.9);
        this.secCharcterLabel.setFontSize(12);
        this.secCharcterLabel.setSize(200, 35);

        this.mainCharacter.setup((obj) => {
        });
        
        this.mainCharacter.loop((obj) => {
            var InObstructed = InMultiOverlap(obj);
            var OutObstructed = OutMultiOverlap(obj);
            
            for (var obs of InObstructed)
                if (obs.type == "obstruct")
                    obs.setBackgroundColor("#8f7a3d");

            for (var obs of OutObstructed)
                if (obs.type == "obstruct")
                    obs.setBackgroundColor("#3d8f3d");

            this.mainCharacterLabel.setText(obj.id + "<br>" + "x=" + obj.x + ", y=" + obj.y);
            this.mainCharacterLabel.setPosition(obj.x, obj.y-35);

        });

        this.secCharcter.setup((obj) => {
            var blind = () => {
                setTimeout(() => {
                    if (Math.floor(Math.random()*4) == 1) {
                        obj.setSpeed(2.0*2.0);
                        obj.setOpacity(0.75);
                    } else {
                        obj.setSpeed(2.0);
                        obj.setOpacity(1.0);
                    }

                    obj.movement(
                        Math.floor(Math.random()*WIDTH),
                        Math.floor(Math.random()*HEIGHT),
                    );

                    blind();
                }, 1000);
            }; blind();
        });

        this.secCharcter.loop((obj) => {
            this.secCharcterLabel.setText(obj.id + "<br>" + "x=" + obj.x.toFixed(0) + ", y=" + obj.y.toFixed(0));
            this.secCharcterLabel.setPosition(obj.x, obj.y-35);
        });

        this.addChild(this.secCharcter);
        this.addChild(this.secCharcterLabel);

        this.addChild(this.mainCharacter);
        this.addChild(this.mainCharacterLabel);

        super.begin(func);
    }
}