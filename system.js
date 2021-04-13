var ENV = [/* componnent, ... */];
var CONSOLE = "";

var FPS = 60;
var DELAY = 60;
var LAYER = 10;
var FAR = 500;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var MOUSE_X = 0;
var MOUSE_Y = 0;

var ON_KEY_PRESSED = false;
var KEY_MULTI_PRESSED = [/* "shift", ... */];
var KEY_MAP = {/* shift: true, ... */};
var KEY_SET = {shift: 16, space: 32, a: 65, d: 68, s: 83, w: 87};
var KEY_CODE = {16: "shift", 32: "space", 65: "a", 68: "d", 83: "s", 87: "w"};

var SpringId = (name) => { return name + "@" + Math.floor(Math.random() * 1000); };

var Print = (str) => {
    if (CONSOLE.length < 500) {
        if (str == "cls") {
            CONSOLE = "";
            return;
        }

        CONSOLE += str + "<br>";
        return;
    }

    CONSOLE = "";
};

var BuildAll = (componnent) => {
    var invited = [componnent];

    while (invited.length != 0) {
        var current = invited.shift();

        current.build();

        for (var child of current.getChildren())
            invited.push(child);
        ENV.push(current);
    }
};

var DestroyAll = (componnent) => {
    var invited = [componnent];

    while (invited.length != 0) {
        var current = invited.shift();

        current.destroy();

        for (var child of current.getChildren())
            invited.push(child);
        RemoveElement(ENV, current);
    }
};

var Setup = (task=null) => {
    window.addEventListener("resize", (e) => {
        WIDTH = window.innerWidth
        HEIGHT = window.innerHeight;
    });

    window.addEventListener("keydown", (e) => {
        ON_KEY_PRESS = true;
        KEY_MAP[KEY_CODE[e.keyCode]] = true;
        KEY_MULTI_PRESSED = KeyMultiPressed();
    });

    window.addEventListener("keyup", (e) => {
        ON_KEY_PRESS = false;
        KEY_MAP[KEY_CODE[e.keyCode]] = false;
        KEY_MULTI_PRESSED = KeyMultiPressed();
    });

    window.addEventListener("mousemove", (e) => {
        MOUSE_X = e.clientX;
        MOUSE_Y = e.clientY;
    });

    if (task != null)
        task();
};

var Loop = (task=null) => {
    var runtime = async () => {
        setTimeout(() => {
            if (task != null)
                task();
            runtime();
        }, DELAY)
    }; runtime();
};

var KeyMultiPressed = () => {
    var keys = [];

    for (var key of Object.keys(KEY_MAP))
        if (KEY_MAP[key] != undefined && KEY_MAP[key] != false)
            keys.push(key);

    return keys;
}

var RemoveElement = (list, item) => {
    var index = list.indexOf(item);

    if (index > -1) {
        list.splice(index, 1);
    }
};

var InSingleOverlap = (componnent1, componnent2) => {
    var l1 = componnent1.shape.p1, r1 = componnent1.shape.p4;
    var l2 = componnent2.shape.p1, r2 = componnent2.shape.p4;

    if (l1.x == r1.x || l1.y == r2.y || l2.x == r2.x || l2.y == r2.y) return false;
    if (l1.x >= r2.x || l2.x >= r1.x) return false;
    if (l1.y >= r2.y || l2.y >= r1.y) return false;

    return true;
};

var InMultiOverlap = (component) => {
    var obstructs = [];

    for (var obs of ENV)
        if (component != obs)
            if (InSingleOverlap(component, obs))
                obstructs.push(obs);

    return obstructs;
};

var OutMultiOverlap = (component) => {
    var obstructs = [];

    for (var obs of ENV)
        if (component != obs)
            if (!InSingleOverlap(component, obs))
                obstructs.push(obs);

    return obstructs;
};

var ZReduceRate = (x1, y1, x2, y2,) => {
    var dx = x2-x1, dy = y2-y1;
    var steps = Math.max(Math.abs(dx), Math.abs(dy));

    return dy/steps;
};

var ZGapRate = (y, zr) => {
    return ((HEIGHT-y)/LAYER)*zr;
};