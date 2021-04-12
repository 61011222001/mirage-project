var COMPONENTS_SPRING = [];
var COMPONENTS_BUILDED = [];
var COMPONENTS_DESTROYED = [];

var OBSTRUCT_TYPE = ["obstruct", "charactor", "main_charactor"];

var PRIMARY_SCENE = null;

var FPS = 60;
var DELAY = 50;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var MOUSE_X = 0;
var MOUSE_Y = 0;

var KEY_PRESS = false;
var KEY_PRESS_LIST = [];
var KEY_MAP = {};

var KEY_SET = {
    shift: 16,
    space: 32, 
    a: 65, 
    d: 68, 
    s: 83, 
    w: 87
};

var KEY_NAMES = {
    16: "shift",
    32: "space", 
    65: "a", 
    68: "d", 
    83: "s", 
    87: "w"
};

function SpringId (name) {
    var id = name + "@" + Math.floor(Math.random() * 1000);

    if (!COMPONENTS_SPRING.includes(id)) {
        COMPONENTS_SPRING.push(id);
    } else {
        SpringId(name);
    }

    return id;
}

function BuildAll (componnent) {
    var invited = [componnent];

    while (invited.length != 0) {
        var current = invited.shift();
        var children = current.getChildren();

        current.build();

        for (var i in children)
            invited.push(children[i]);
        COMPONENTS_BUILDED.push(current);
    }

    return componnent;
}

function DestroyAll (componnent) {
    var invited = [componnent];

    while (invited.length != 0) {
        var current = invited.shift();
        var children = current.getChildren();

        current.destroy();

        for (var i in children)
            invited.push(children[i]);
    }

    return componnent;
}

function Setup (func=() => {}) {
    func();
    SetWindow();
    SetMouse();
    SetKeybord();
}

function Loop (func=() => {}) {
    var runtime = async () => {
        setTimeout(() => {
            func();
            runtime();
        }, DELAY);
    }; runtime();
}

function SetWindow () {
    var windowResizeEvent = (e) => {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        if (PRIMARY_SCENE != null)
            PRIMARY_SCENE.setSize(WIDTH, HEIGHT);

    }; windowResizeEvent();

    window.addEventListener("resize", windowResizeEvent);
}

function SetMouse () {
    PRIMARY_SCENE.getDOM().addEventListener("mousemove", (e) => {
        MOUSE_X = e.clientX;
        MOUSE_Y = e.clientY;
    });
}

function SetKeybord () {
    window.addEventListener("keydown", (e) => {
        KEY_PRESS = true;
        KEY_MAP[e.keyCode] = true;
        KEY_PRESS_LIST = GetKeys();
    });

    window.addEventListener("keyup", (e) => {
        KEY_PRESS = false;
        KEY_MAP[e.keyCode] = false;
        KEY_PRESS_LIST = GetKeys();
    });
}

function GetKeys () {
    var result = [];

    for (var [key, val] of Object.entries(KEY_MAP))
        if (KEY_NAMES[key] != undefined && val == true)
            result.push(KEY_NAMES[key]);

    return result;
}

function IsObstructOverlap (u, v, func=() => {}) {
    var l1 = u.shape.p1, r1 = u.shape.p4;
    var l2 = v.shape.p1, r2 = v.shape.p4;

    if (l1.x == r1.x || l1.y == r2.y || l2.x == r2.x || l2.y == r2.y) {
        return false;
    }

    if (l1.x >= r2.x || l2.x >= r1.x) {
        return false;
    }

    if (l1.y >= r2.y || l2.y >= r1.y) {
        return false;
    }

    return true;
}

function ObstructsOverlap (u, func = () => {}) {
    var obstructs = [];

    for (var ob of COMPONENTS_BUILDED)
        if (ob != u && ob.type == "obstruct")
            if (IsObstructOverlap(u, ob))
                obstructs.push(ob);

    func(obstructs);
    return obstructs;
}

function ObstructsNotOverlap (u, func = () => {}) {
    var obstructs = [];

    for (var ob of COMPONENTS_BUILDED)
        if (ob != u && ob.type == "obstruct")
            if (!IsObstructOverlap(u, ob))
                obstructs.push(ob);

    func(obstructs);
    return obstructs;
}

