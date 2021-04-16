class Scene extends Component {
    constructor (id="scene", className="scene", type="scene") {
        super(id=id, className=className, type=type);

        this.getDOM((d) => {
            d.style.zIndex = -1;
        });
    }

    autoEquipLayer (component, layerSize=1) {
        this.setLayer(component, Math.floor((this.height-component.bottom)/layerSize));
    }
}