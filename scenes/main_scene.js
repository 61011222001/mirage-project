class MainScene extends Scene {
    mainCharactor;

    constructor (id="main_scene", className="scene") {
        super(id, className);

        this.mainCharactor = new MainCharactor();
        this.mainCharactor.setPosition(500, 100);
        
        this.addChild(this.mainCharactor);
    }

    setup (then=null) {
        super.setup(then);

        this.mainCharactor.setup((obj) => {
            obj.loop(() => {
                // code..
            });
        });
    }
}