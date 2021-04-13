class Scene extends Component {
    #layers;
    #layerWeight;
    #layerLimit;

    layerDetp;
    layerPeak;

    constructor (id="scene", className="scene", type="scene") {
        super(id, className, type);

        this.getDOM((d) => {
            d.style.zIndex = -1;
        });
    }

    begin (func = () => {}) {
        this.#layers = [];
        this.#layerWeight = 5;
        this.#layerLimit = Math.floor(this.height/this.#layerWeight);
        this.layerDetp = 0;
        this.layerPeak = this.#layerLimit-1;

        for (var i=0; i < this.#layerLimit+1; i += 1)
            this.#layers[i] = [];
        super.setup(func);
    }

    getLayers () { return this.#layers; }
    equipLayers (func = () => {}) {
        for (var child of this.getChildren()) {
            for (var layer of this.#layers)
                RemoveElement(layer, child);

            this.#layers[Math.floor(child.bottom/this.#layerWeight)].push(child);
        }

        this.destroy();
        this.setChildren([]);

        for (var layer of this.#layers)
            for (var item of layer)
                this.addChild(item);

        this.build();
        func(this.#layers);

        return this.#layers;
    }
}