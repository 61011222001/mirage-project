class MainScene extends Scene {
    mainCharactor;
    mainCharactorLabel;

    secCharctor;
    secCharctorLabel;

    constructor (id="main_scene", className="scene") {
        super(id, className);

        this.mainCharactor = new MainCharactor();
        this.mainCharactorLabel = new Label();

        this.mainCharactor.setPosition(Math.floor(WIDTH/2-50), Math.floor(HEIGHT/2-50));

        this.mainCharactorLabel.setOpacity(0.9);
        this.mainCharactorLabel.setFontSize(12);
        this.mainCharactorLabel.setSize(200, 35);

        this.secCharactor = new Charactor();
        this.secCharactorLabel = new Label();

        this.secCharactor.setBackgroundColor("#3d8f3d");
        this.secCharactor.setPosition(500, 300);

        this.secCharactorLabel.setOpacity(0.9);
        this.secCharactorLabel.setFontSize(12);
        this.secCharactorLabel.setSize(200, 35);
       
        this.addChild(this.secCharactor);
        this.addChild(this.secCharactorLabel);

        this.addChild(this.mainCharactor);
        this.addChild(this.mainCharactorLabel);

        this.setPosition(0, 0);
        this.setBackgroundColor("#ddd");
    }

    player (func=() => {}) { func(this.mainCharactor) }
    setup (func=() => {}) {
        super.setup(func);

        this.mainCharactor.setup((obj) => {
        });
        
        this.mainCharactor.loop((obj) => {
            this.mainCharactorLabel.setText(
                obj.id + "<br>"
                + "x=" + obj.x + ", y=" + obj.y
            );
            this.mainCharactorLabel.setPosition(obj.x, obj.y-35);

            ObstructsOverlap(obj, (obstructs) => {
                for (var ob of obstructs)
                    ob.setBackgroundColor("#8f7a3d");
            });

            ObstructsNotOverlap(obj, (obstructs) => {
                for (var ob of obstructs)
                    ob.setBackgroundColor("#3d8f3d");
            });
        });

        this.secCharactor.setup((obj) => {
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

        this.secCharactor.loop((obj) => {
            this.secCharactorLabel.setText(
                obj.id + "<br>"
                + "x=" + obj.x.toFixed(0) + ", y=" + obj.y.toFixed(0)
            );
            this.secCharactorLabel.setPosition(obj.x, obj.y-35);
        });
    }
}