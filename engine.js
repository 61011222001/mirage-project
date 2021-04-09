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
        component.setPrevious(this);

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
    shape = {
        type: "px",
        size: {width: window.innerWidth, height: window.innerHeight},
        obstruction: {top: 10, bottom: window.innerHeight-10, left: 10, right: window.innerWidth-10},
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

        this.document.style.width = this.shape.size.width;
        this.document.style.height = this.shape.size.height;
    }

    setSize(width, height) {
        this.shape.size.width = width;
        this.shape.size.height = height;

        this.shape.obstruction.left = 10;
        this.shape.obstruction.top = 10;
        this.shape.obstruction.right = width-10;
        this.shape.obstruction.bottom = height-10;

        this.document.style.width = width;
        this.document.style.height = height;
    }
}

class Label extends Component {
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

    setMove () {
    }

    setPosition(x=0, y=0) {
        this.player.x = x;
        this.player.y = y;

        this.document.style.left = x;
        this.document.style.top = y;
    }
}


class Physics {
    #fps;
    #gravity;
    #objectList;

    isBegin;

    constructor (fps=23, gravity=1, objectList=[]) {
        this.#fps =fps;
        this.#gravity = gravity;
        this.#objectList = objectList;

        this.isBegin = false;
    }
    
    setFps (fps) { this.#fps = fps; }
    setGravity (gravity) { this.#gravity = gravity}
    setObjects (objectList) {this.#objectList = objectList;}

    getFps () { return this.#fps; }
    getGravity () { return this.#gravity; }
    getObjects () { return this.#objectList; }

    begin () { this.isBegin = true; this.#physicsLoop(); }
    end () { this.isBegin = false; }

    async #physicsLoop () {
        var interval = setInterval(function(){
            if (!this.isBegin) clearInterval(interval);

            console.log("asd");

        }, 1000/this.#fps);
    }
}

class DemoScene extends Scene {
    physics;

    label;
    charactor;

    constructor (id=null) {
        super(id);

        this.physics = new Physics();

        this.label = new Label(id=id+":info");
        this.charactor = new Charactor(id=id+":charactor@demo");

        this.add(this.label);
        this.add(this.charactor);

        this.physics.setObjects([this.label, this.charactor]);
        this.physics.begin();
    }
}

class System {
    env = {
        user: {
            mouse: {
                position: {x: 0, y: 0}
            },
            keyboard: {
                controllers: {
                    w: 119,
                    a: 97,
                    s: 115,
                    d: 100,
                    space: 32
                },
                press: false,
                up: true,
                key: null,
                action: null                
            }
        },
        scene: {
            primary: null,
            queue: []
        },
        runtime: {
            components: []
        }
    };

    #setPrimaryScene (component) { 
        var remainSceneDoc = document.getElementById("primary-scene");

        if (remainSceneDoc != null) {
            document.body.replaceChild(component.document, remainSceneDoc);
        } else {
            document.body.appendChild(component.document);
        }

        this.env.scene.primary = component;
    }

    #enqScene (className) { this.env.scene.queue.push(className); }
    #deqtScene () { return this.env.scene.queue.shift(); }

    #buildScene (className) {
        var primaryScene = new className("primary-scene");

        var invited = [primaryScene];
        var visited = [];

        while (invited.length != 0) {
            var current = invited.shift();
            var children = current.getChildren();

            if (visited.includes(current)) continue;
            if (!current.display) current.open();
            if (!this.env.runtime.components.includes(current)) this.env.runtime.components.push(current);

            for (var i in children) invited.push(children[i]);

            visited.push(current);
        }

        return primaryScene;
    }

    setup () {
        var primaryScene = this.#buildScene(this.#deqtScene());
        this.#setPrimaryScene(primaryScene);
        this.#setGameEvents();
    }

    #setGameEvents () {
        var setSceneLabel = () => {
            this.env.scene.primary.label.setText("window", 
                "width=" + this.env.scene.primary.shape.size.width + ", "
                + "height=" + this.env.scene.primary.shape.size.height
            );
    
            this.env.scene.primary.label.setText("obstruction", 
                "(" + this.env.scene.primary.shape.obstruction.top + ", "
                + this.env.scene.primary.shape.obstruction.bottom + ", "
                + this.env.scene.primary.shape.obstruction.left + ", "
                + this.env.scene.primary.shape.obstruction.right + ")"
            );
    
            this.env.scene.primary.label.setText("mouse", 
                "x=" + this.env.user.mouse.position.x 
                + ", y=" + this.env.user.mouse.position.y
            );
    
            this.env.scene.primary.label.setText("keyboard", 
                "key=" + this.env.user.keyboard.key
                + ", action=" + this.env.user.keyboard.action
            );
        }

        setSceneLabel();

        window.addEventListener("resize", async (events) => {
            this.env.scene.primary.setSize(window.innerWidth, window.innerHeight);
            setSceneLabel();
        });

        window.addEventListener("mousemove", async (events) => {
            this.env.user.mouse.position.x = events.clientX;
            this.env.user.mouse.position.y = events.clientY;

            setSceneLabel();
        });
        
        window.addEventListener("keypress", async (events) => {
            this.env.user.keyboard.press = true;
            this.env.user.keyboard.up = false;
            this.env.user.keyboard.key = events.keyCode;

            /*
            keyCode     key
            119         w
            97          a
            115         s
            100         d
            32          space
            */

            if (events.keyCode == this.env.user.keyboard.controllers.w) {
                this.env.user.keyboard.action = "up";
            } else if (events.keyCode == this.env.user.keyboard.controllers.a) {
                this.env.user.keyboard.action = "left";
            } else if (events.keyCode == this.env.user.keyboard.controllers.s) {
                this.env.user.keyboard.action = "down";
            } else if (events.keyCode == this.env.user.keyboard.controllers.d) {
                this.env.user.keyboard.action = "left";
            } else if (events.keyCode == this.env.user.keyboard.controllers.space) {
                this.env.user.keyboard.action = "jump";
            }

            setSceneLabel();
        });

        window.addEventListener("keyup", async (events) => {
            this.env.user.keyboard.press = false;
            this.env.user.keyboard.up = true;
            this.env.user.keyboard.key = null;
            this.env.user.keyboard.action = null;

            setSceneLabel();
        });
    }

    #setGameLoop () {}
}

sys = new System();
sys.env.scene.queue = [DemoScene];
sys.setup();