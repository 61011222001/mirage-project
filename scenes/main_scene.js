class MainScene extends Scene {
    mainCharactor;
    mainCharactorLabel;

    constructor (id="main_scene", className="scene") {
        super(id, className);

        this.mainCharactor = new MainCharactor();
        this.mainCharactorLabel = new Label();

        this.mainCharactor.setPosition(500, 100);

        this.mainCharactorLabel.setOpacity(0.5);
        this.mainCharactorLabel.setFontSize(12);
        this.mainCharactorLabel.setSize(100, 15);
        
        this.addChild(this.mainCharactor);
        this.addChild(this.mainCharactorLabel);
    }

    setup (then=null) {
        super.setup(then);

        this.mainCharactor.setup((obj) => {
            obj.loop((obj) => {
                this.mainCharactorLabel.setText(obj.x + ", " + obj.y);
                this.mainCharactorLabel.setPosition(obj.x, obj.y-15);
            });
        });
    }
}