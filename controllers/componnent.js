class Component {
    #DOM = null;
    
    #parent = null;
    #children = []

    loopTime = null;

    width = null;
    height = null;
    top = null;
    bottom = null;
    left = null;
    right = null;

    x = null;
    y = null;

    backgroundColor = null;
    opacity = null;

    fontSize = null;
    fontFamily = null;

    constructor (id=null, className=null) {
        this.#DOM = document.createElement("div");
        this.#DOM.id = (id == null) ? id="componnent@" + Math.floor(Math.random()*1000) : id;
        this.#DOM.className = (className == null) ? "componnent" : className;

        this.loopTime = false;

        this.setFontSize(16);
        this.setFontFamily('"Segoe UI",Arial,sans-serif');
    }

    getDOM () { return this.#DOM; }
    getParent () { return this.#parent; }
    getChildren () { return this.#children; }

    setParent (component) { this.#parent = component; }
    setChildren (componentList) { this.#children = componentList; }
    addChild (component) { component.setParent(this); this.#children.push(component); }

    build () {
        for (var i in this.#children) {
            this.#DOM.appendChild(this.#children[i].getDOM());
        }

        if (this.#parent == null) {
            document.body.appendChild(this.#DOM);
        }
    }

    destroy () {
        for (var i in this.#children) {
            this.#DOM.removeChild(this.#children[i].getDOM());
        }

        if (this.#parent == null) {
            document.body.removeChild(this.#DOM);
        }
    }

    setup (then=null) {
        if (then != null) {
            then(this);
        }
    }

    end (then=null) {
        this.loopTime = false;

        if (then != null) {
            then(this);
        }
    }

    loop (then=null) {
        this.loopTime = true;

        var runtime = () => {
            setTimeout(() => {
                if (this.loopTime) {
                    if (then != null) {
                        then(this);
                    }

                    runtime();
                }
            }, 1000/fps);
        }; runtime();
    }

    setBackgroundColor (color) {
        this.backgroundColor = color;
        this.getDOM().style.backgroundColor = color;
    }

    setOpacity (value) {
        this.opacity = value;
        this.getDOM().style.opacity = value;
    }

    setSize (width, height) {
        this.width = width;
        this.height = height;

        this.getDOM().style.width = width;
        this.getDOM().style.height = height;
    }

    setPosition (x, y) {
        this.x = x;
        this.y = y;

        this.top = y;
        this.bottom = height;
        this.left = x;
        this.right = width;

        this.getDOM().style.position = "absolute";
        this.getDOM().style.left = x + "px";
        this.getDOM().style.top = y + "px";
    }

    setFontSize (value) {
        this.fontSize = value;
        this.getDOM().style.fontSize = value;
    }

    setFontFamily (value) {
        this.fontFamily = value;
        this.getDOM().style.fontFamily = value;
    }
}