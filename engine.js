class Component {
    document;

    display = false;

    #previous = null;
    #children = [];

    constructor (id=null) {
        var element = document.getElementById(id);

        if (element == null) {
            this.document = document.createElement("div");
            this.document.id = id;
        } else {
            this.document = element;
        }

        this.hide();
    }
    
    getPrevious () {return this.#previous;}
    getChildren() {return this.#children;};
    setPrevious (component) {this.#previous = component;}

    add (component) {
        component.setPrevious(component);

        this.document.appendChild(component.document);
        this.#children.push(component);
    }

    hide () {
        this.display = false;
        this.document.style.display = "none";
    }

    open () {
        this.display = true;
        this.document.style.display = "block";
    }
};

class Scene extends Component {
    information;

    events = {
        window: {resize: () => {},},
        scene: {
            mousemove: () => {},
            keypress: () => {},
        }
    };

    player = {
        mouse: {
            position: {x:0, y: 0},
            click: {isClick: false, object: null},
        },
    };

    shape = {
        type: "px",
        size: {width: 0, height: 0},
        obstruction: {top: 0, bottom: 0, left: 0, right: 0},
    };

    style = {
        backgroundColor: "#ddd",
        position: "absolute",
        top: 0, 
        left: 0
    };

    constructor (id=null) {
        super(id=id);

        this.document.style.backgroundColor = this.style.backgroundColor;

        this.document.style.position = this.style.position;
        this.document.style.top = this.style.top + this.shape.type;
        this.document.style.left = this.style.left + this.shape.type;

        window.addEventListener("resize", (event) => { this.#resizeEvent(event); });
        this.document.addEventListener("mousemove", (event) => { this.#mousemoveEvent(event); });

        this.information = new Information(id=id+":info");
        this.add(this.information);

        this.#resizeEvent();
        this.#mousemoveEvent();
    }

    #resizeEvent (event) {
        this.shape.size.width = window.innerWidth;
        this.shape.size.height = window.innerHeight;

        this.shape.obstruction.left = 0;
        this.shape.obstruction.top = 0;
        this.shape.obstruction.right = this.shape.size.width;
        this.shape.obstruction.bottom = this.shape.size.height;

        this.document.style.width = this.shape.size.width;
        this.document.style.height = this.shape.size.height;

        this.information.setText("window", 
            "x=" + this.shape.size.width + ", "
            + "y=" + this.shape.size.height
        );

        this.information.setText("obstruction", 
            "top=" + this.shape.obstruction.top + ", "
            + "bottom=" + this.shape.obstruction.bottom + ", "
            + "left=" + this.shape.obstruction.left + ", "
            + "right=" + this.shape.obstruction.right
        );

        this.events.window.resize();
    }

    #mousemoveEvent (event) {
        if (event != null) {
            this.player.mouse.position.x = event.clientX;
            this.player.mouse.position.y = event.clientY;
        }

        this.information.setText("player", 
            "x=" + this.player.mouse.position.x + ", "
            + "y=" + this.player.mouse.position.y
        );

        this.events.scene.mousemove();
    }
}

class Information extends Component {
    #info = [];

    shape = {
        position: {x:0, y: 0}
    };

    style = {
        position: "absolute",
        zIndex: 1, 
        font: {
            family: "Segoe UI, Arial,sans-serif"
        }
    };

    constructor (id=null) {
        super(id=id);

        this.document.style.position = this.style.position;
        this.document.style.zIndex = this.style.zIndex;
        this.document.style.fontFamily = this.style.font.family;

        this.document.style.left = this.shape.position.x;
        this.document.style.top = this.shape.position.y;
    }

    setPosition(x=0, y=0) {
        this.shape.x = x;
        this.shape.y = y;

        this.document.style.left = x;
        this.document.style.top = y;
    }

    #refresh () {
        this.document.innerHTML = this.getString();
    }
    setText(attr, text) {
        for (var i in this.#info) {
            if (Object.keys(this.#info[i]).includes(attr)) {
                this.#info[i][attr] = text;
                this.#refresh();
                return;
            }
        }

        this.#info.push(JSON.parse("{\""+ attr +"\" : \""+ text +"\" }"));
        this.#refresh();
    }

    getText(attr) {
        for (var i in this.#info) {
            if (Object.keys(this.#info[i]).includes(attr)) {
                return this.#info[i][attr];
            }
        }

        return null;
    }

    getString () {
        var str = "";

        for (var i in this.#info) {
            var key = Object.keys(this.#info[i])[0];
            str += key + ": " + this.#info[i][key] + "<br>"; 
        }

        return str;
    }
}

class Charactor extends Component {
    inScene;
    player = {};

    shape = {
        type: "px",
        position: {x: 200, y: 100},
        obstruction: {top: 0, bottom: 0, left: 0, right: 0},
        size: {width: 50, height: 50},
    };

    style = {
        backgroundColor: "#ff944d",
        position: "absolute",
        top: 0, 
        left: 0
    };

    constructor (id=null) {
        super(id=id);

        this.document.style.width = this.shape.size.width + this.shape.type;
        this.document.style.height = this.shape.size.height + this.shape.type;

        this.document.style.left = this.shape.position.x;
        this.document.style.top = this.shape.position.y;

        this.document.style.position = this.style.position;
        this.document.style.backgroundColor = this.style.backgroundColor;
    }

    setPosition(x=0, y=0) {
        this.player.x = x;
        this.player.y = y;

        this.document.style.left = x;
        this.document.style.top = y;
    }
}

class DemoScene extends Scene {
    constructor (id=null) {
        super(id);

        this.events.window.resize = () => {
        };

        this.events.scene.mousemove = () => {
        };

        var player = new Charactor(id=id+":player");
        this.add(player);
    }

    begin () {
    }
}

class System {
    env = {
        scene: {
            primary: null,
            queue: []
        },
        memory: []
    };

    #setPrimaryScene (sceneClassName) { this.env.scene.primary = sceneClassName; }
    #shiftScene () { return this.env.scene.queue.shift(); }

    #buildScene (sceneClassName) {
        this.#setPrimaryScene(sceneClassName);

        var remainSceneDoc = document.getElementById("primary-scene");
        var primaryScene = new sceneClassName("primary-scene");

        var invited = [primaryScene];
        var visited = [];

        while (invited.length != 0) {
            var current = invited.shift();
            var children = current.getChildren();

            if (this.env.memory.includes(current))
                continue;

            if (visited.includes(current))
                continue;
            
            if (!current.display)
                current.open();

            if (!this.env.memory.includes(current))
                this.env.memory.push(current);

            for (var i in children) {
                invited.push(children[i]);
            }

            visited.push(current);
        }

        if (remainSceneDoc != null) {
            document.body.replaceChild(primaryScene.document, remainSceneDoc);
        } else {
            document.body.appendChild(primaryScene.document);
        }

        return primaryScene;
    }

    setup () {
        var scene = this.#buildScene(this.#shiftScene());

        console.log(this.env.memory);
    }

    start () {
    }

    #gameEvent () {
    }

    #gameLoop () {}
}

sys = new System();
sys.env.scene.queue = [DemoScene];
sys.setup();