class Component {
    id;
    className;
    type;

    #DOM = null;
    
    #parent = null;
    #layers = null;

    loopTime = null;
    layer;

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
    border = null;
    opacity = null;

    pading = null;
    margin = null;

    textAlign = null;
    fontSize = null;
    fontFamily = null;

    constructor (id="componnent", className="componnent", type="componnent") {
        this.id = SpringId(id);
        this.className = className;
        this.type = type;

        this.#DOM = document.createElement("div");
        this.#DOM.id = this.id;
        this.#DOM.className = this.className;

        this.#layers = { /* 0: [componnent, ...], ... */ };
        this.loopTime = false;
    }

    paint () {
        var invited = [this];
        
        while (invited.length != 0) {
            var current = invited.shift();
            var layers = current.getLayers();
            var keys = Object.keys(layers);

            for (var i=keys.length-1; i >= 0; i--) {
                for (var component of layers[keys[i]]) {
                    current.getDOM((d) => {
                        d.appendChild(component.getDOM());
                    });

                    invited.push(component);
                }
            }

            if (!ENV.includes(current))
                ENV.push(current);
        }

        if (this.#parent == null) {
            this.#parent = document.body;
            this.#parent.appendChild(this.getDOM());
        }
    }

    add (component, layer=0) {
        if (this.#layers[layer] == undefined)
            this.#layers[layer] = [];
        this.#layers[layer].push(component);

        component.layer = layer;
        component.setParent(this);
    }

    setLayer (component, layer) {
        if (this.#layers[layer] == undefined)
            this.#layers[layer] = [];
        RemoveElement(this.#layers[component.layer], component);

        this.#layers[layer].push(component);
        component.layer = layer;
    }

    getDOM (func = () => {}) {
        func(this.#DOM);
        return this.#DOM;
    }

    getParent () {
        return this.#parent;
    }

    getLayers () { 
        return this.#layers; 
    }

    setParent (component) { 
        this.#parent = component; 
    }

    with (func = () => {}) {
        func(this);
    }

    setup (func = () => {}) {
        func(this);
    }
    
    end (func = () => {}) {
        this.loopTime=false; func(this);
    }

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

    setBorder (value) {
        this.border = value;
        this.#DOM.style.border = value;
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

    setTextAlign (value) {
        this.textAlign = value;
        this.#DOM.style.textAlign = value;
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