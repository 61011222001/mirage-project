var ENV = [];

var FPS = 60;
var DELAY = 60;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var MOUSE_X = 0;
var MOUSE_Y = 0;

var ON_KEY_PRESSED = false;
var KEY_MULTI_PRESSED = [];
var KEY_MAP = {};
var KEY_SET = {shift: 16, space: 32, a: 65, d: 68, s: 83, w: 87};
var KEY_CODE = {16: "shift", 32: "space", 65: "a", 68: "d", 83: "s", 87: "w"};

var BuildAll = () => {
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
        if (KEY_MAP[key])
            keys.push(key);

    return keys;
}

var InSingleOverlap = () => {
};

var InMultiOverlap = () => {
};