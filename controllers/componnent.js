class Component {
    id;
    className;
    type;

    #DOM = null;
    
    #parent = null;
    #children = []

    loopTime = null;

    x = null;
    y = null;

    width = null;
    height = null;
    top = null;
    bottom = null;
    left = null;
    right = null;

    shape = {
        p1: {x: null, y: null},
        p2: {x: null, y: null},
        p3: {x: null, y: null},
        p4: {x: null, y: null},
    };

    backgroundImage = null;
    backgroundColor = null;
    opacity = null;

    pading = null;
    margin = null;

    fontSize = null;
    fontFamily = null;

    constructor (id="componnent", className="componnent", type="componnent") {
        this.id = SpringId(id);
        this.className = className;
        this.type = type;

        this.#DOM = document.createElement("div");
        this.#DOM.id = this.id;
        this.#DOM.className = this.className;

        this.loopTime = false;

        this.setFontSize(16);
        this.setFontFamily('"Segoe UI",Arial,sans-serif');
    }

    getDOM (func = () => {}) { func(this.#DOM); return this.#DOM; }
    getParent () { return this.#parent; }
    getChildren () { return this.#children; }

    setParent (component) { this.#parent = component; }
    setChildren (componentList) { this.#children = componentList; }
    addChild (component) { component.setParent(this); this.#children.push(component); }

    build () {
        for (var i in this.#children)
            this.#DOM.appendChild(this.#children[i].getDOM());

        if (this.#parent == null)
            document.body.appendChild(this.#DOM);
    }

    destroy () {
        for (var i in this.#children)
            this.#DOM.removeChild(this.#children[i].getDOM());

        if (this.#parent == null)
            document.body.removeChild(this.#DOM);
    }

    with (func = () => {}) { func(this) }
    setup (func = () => {}) { func(this) }
    end (func = () => {}) {this.loopTime=false; func(this); }

    loop (func = () => {}) {
        this.loopTime = true;

        var runtime = () => {
            setTimeout(() => {
                if (this.loopTime) {
                    func(this);
                    runtime();
                }
            }, 1000/FPS);
        }; runtime();
    }

    setSize (width, height) {
        this.width = width;
        this.height = height;

        this.#DOM.style.width = width;
        this.#DOM.style.height = height;
    }

    setPosition (x, y) {
        this.x = x;
        this.y = y;

        this.top = y;
        this.bottom = y + this.height;
        this.left = x;
        this.right = x + this.width;

        this.shape = {
            p1: {x: x, y: y},
            p2: {x: x+this.width, y: y},
            p3: {x: x, y: y+this.height},
            p4: {x: x+this.width, y: y+this.height},
        };

        this.#DOM.style.position = "absolute";
        this.#DOM.style.left = x + "px";
        this.#DOM.style.top = y + "px";
    }

    setBackgroundColor (color) {
        this.backgroundColor = color;
        this.#DOM.style.backgroundColor = color;
    }

    setBackgroundImage (image) {
        this.backgroundImage = image;
        this.#DOM.style.backgroundImage = image;
    }

    setOpacity (value) {
        this.opacity = value;
        this.#DOM.style.opacity = value;
    }

    setPadding (value) {
        this.pading = value;
        this.#DOM.style.padding = value + "px";
    }

    setMargin (value) {
        this.margin = value;
        this.#DOM.style.margin = value + "px";
    }

    setFontSize (value) {
        this.fontSize = value;
        this.#DOM.style.fontSize = value;
    }

    setFontFamily (value) {
        this.fontFamily = value;
        this.#DOM.style.fontFamily = value;
    }
}