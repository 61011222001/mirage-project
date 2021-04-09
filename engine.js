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

class Obstruct extends Component {
    inScene;

    status = {
        fps: 60,
        movement: {
            isMove: false,
            speed: 4.5,
            acc: 50,
            vectors: {
                left: {dx: -1, dy: 0},
                right: {dx: 1, dy: 0},
                up: {dx: 0, dy: -1},
                down: {dx: 0, dy: 1},
                jump: {dx: 0, dy: -1}
            }
        }
    };

    shape = {
        type: "px",
        position: {x: 50, y: 50},
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

    setScene (component) { this.inScene = component; }
    setPosition(x=0, y=0) {
        if (true) {
            this.shape.position.x = x;
            this.shape.position.y = y;

            this.shape.obstruction.left = x - this.shape.size.width/2;
            this.shape.obstruction.top = y - this.shape.size.height/2;
            this.shape.obstruction.right = x + this.shape.size.width + this.shape.size.width/2;
            this.shape.obstruction.bottom = y + this.shape.size.height + this.shape.size.height/2;

            this.document.style.left = x + this.shape.size.width/2;
            this.document.style.top = y + this.shape.size.height/2;
        }
    }
    
    goto (option) {
        if (this.status.movement.isMove) return;

        var vector = this.status.movement.vectors[option];

        this.movementByDDA(
            this.shape.position.x + this.status.movement.acc * vector.dx, 
            this.shape.position.y + this.status.movement.acc * vector.dy
        );
    }

    async movementByDDA (tx, ty) {
        this.status.movement.isMove = true;

        var x1 = this.shape.position.x;
        var y1 = this.shape.position.y;
        var x2 = tx;
        var y2 = ty;

        var dx = x2 - x1;
        var dy = y2 - y1;

        var steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

        var xinc = dx / steps;
        var yinc = dy / steps;

        var x = x1;
        var y = y1;

        var speed = this.status.movement.speed;

        var movement = (reach=0) => {
            setTimeout(() => {
                if (reach < steps-reach*speed) {
                    this.setPosition(x, y);

                    x += xinc + (xinc * speed);
                    y += yinc + (yinc * speed);

                    movement(reach + 1);
                } else {
                    this.status.movement.isMove = false;
                }
            }, 1000/this.status.fps);
        };

        movement();
    }


}

class Physics {
    #fps;
    #gravity;
    #obstructList;

    isBegin;
    inScene;

    constructor (fps=60, gravity=4, obstructList=[], inScene=null) {
        this.#fps =fps;
        this.#gravity = gravity;
        this.#obstructList = obstructList;

        this.isBegin = false;
        this.inScene = inScene;
    }
    
    setFps (fps) { this.#fps = fps; }
    setGravity (gravity) { this.#gravity = gravity}
    setObstructs (obstructList) {this.#obstructList = obstructList;}
    setScene (component) { this.inScene = component; }

    getFps () { return this.#fps; }
    getGravity () { return this.#gravity; }
    getObstructs () { return this.#obstructList; }
    getScene () { return this.inScene; }

    begin () { this.isBegin = true; this.#physicsLoop(); }
    end () { this.isBegin = false; }

    async #physicsLoop () {
        var fall = (count=0) => {
            setTimeout(() => {
                if (this.isBegin) {
                    for (var i in this.#obstructList) {
                        var obstruct = this.#obstructList[i];
                        var shape = obstruct.shape;

                        if (shape.obstruction.bottom < this.inScene.shape.obstruction.bottom) {
                            obstruct.setPosition(shape.position.x, shape.position.y + this.#gravity);
                        }
                    }

                    fall(count + 1);
                }
            }, 1000/this.#fps);
        };

        fall();
    }
}

class DemoScene extends Scene {
    physics;

    label;
    obstruct;

    constructor (id=null) {
        super(id);

        this.physics = new Physics();

        this.label = new Label(id=id+":info");
        this.obstruct = new Obstruct(id=id+":obstruct@demo");

        this.add(this.label);
        this.add(this.obstruct);

        this.obstruct.setScene(this);
        this.obstruct.setPosition(200, 100);
        // this.obstruct.movementByDDA(400, 100);

        this.physics.setScene(this);
        this.physics.setObstructs([this.obstruct]);
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
                this.env.scene.primary.obstruct.goto("up");
            } else if (events.keyCode == this.env.user.keyboard.controllers.a) {
                this.env.user.keyboard.action = "left";
                this.env.scene.primary.obstruct.goto("left");
            } else if (events.keyCode == this.env.user.keyboard.controllers.s) {
                this.env.user.keyboard.action = "down";
                this.env.scene.primary.obstruct.goto("down");
            } else if (events.keyCode == this.env.user.keyboard.controllers.d) {
                this.env.user.keyboard.action = "right";
                this.env.scene.primary.obstruct.goto("right");
            } else if (events.keyCode == this.env.user.keyboard.controllers.space) {
                this.env.user.keyboard.action = "jump";
                this.env.scene.primary.obstruct.goto("jump");
            }

            setSceneLabel();
        });

        window.addEventListener("keyup", async (events) => {
            this.env.user.keyboard.press = false;
            this.env.user.keyboard.up = true;
            this.env.user.keyboard.key = null;
            this.env.user.keyboard.action = null;

            // this.env.scene.primary.obstruct.status.movement.isMove = false;

            setSceneLabel();
        });
    }

    #setGameLoop () {}
}

sys = new System();
sys.env.scene.queue = [DemoScene];
sys.setup();