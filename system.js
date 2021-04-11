var primaryScene = null;
var components = [];

var fps = 60;
var inputRate = 50;
var width = null;
var height = null;

var mouseX = 0;
var mouseY = 0;

var keyPress = false;
var keyPressList = [];
var keyMap = {};

var keySet = {
    shift: 16,
    space: 32, 
    a: 65, 
    d: 68, 
    s: 83, 
    w: 87
};

var keyNames = {
    16: "shift",
    32: "space", 
    65: "a", 
    68: "d", 
    83: "s", 
    87: "w"
};

function buildAll (componnent) {
    var invited = [componnent];

    while (invited.length != 0) {
        var current = invited.shift();
        var children = current.getChildren();

        current.build();

        for (var i in children) {
            invited.push(children[i]);   
        }
    }

    return componnent;
}

function destroyAll (componnent) {
    var invited = [componnent];

    while (invited.length != 0) {
        var current = invited.shift();
        var children = current.getChildren();

        current.destroy();

        for (var i in children) {
            invited.push(children[i]);   
        }
    }

    return componnent;
}

function setup (then=null) {
    if (then != null) {
        then();
    }

    setWindow();
    setMouse();
    setKeybord();
}

function loop(then=() => {}) {
    var live = async () => {
        setTimeout(() => {
            then();
            live();
        }, inputRate);
    }; live();
}

function getPrimaryScene() { return primaryScene; }
function setPrimaryScene(componnent) {
    setup(() => {
        primaryScene = componnent;
    });
}

function setWindow () {
    var windowResizeEvent = (e=null) => {
        width = window.innerWidth;
        height = window.innerHeight;

        if (primaryScene != null) {
            primaryScene.setSize(width, height);
        }

    }; windowResizeEvent();

    window.addEventListener("resize", windowResizeEvent);
}

function setMouse () {
    var mousemoveEvent = (e=null) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    var mouseclickEvent = (e=null) => {
    };

    var mousedownEvent = (e=null) => {
    };

    var mouseupEvent = (e=null) => {
    };

    primaryScene.getDOM().addEventListener("mousemove", mousemoveEvent);
    primaryScene.getDOM().addEventListener("mouseclick", mouseclickEvent);
    primaryScene.getDOM().addEventListener("mousedown", mousedownEvent);
    primaryScene.getDOM().addEventListener("mouseup", mouseupEvent);
}

function setKeybord () {
    var keydownEvent = (e) => {
        keyPress = true;
        keyMap[e.keyCode] = true;
        keyPressList = getKeys(true);
    };

    var keyupEvent = (e) => {
        keyPress = false;
        keyMap[e.keyCode] = false;
        keyPressList = getKeys(true);
    };

    var getKeys = (option=true) => {
        var keyList = [];

        for (var [key, val] of Object.entries(keyMap)) {
            if (val == option) {
                if (keyNames[key] != undefined) {
                    keyList.push(keyNames[key]);
                }
            }
        }

        return keyList;
    };

    window.addEventListener("keydown", keydownEvent);
    window.addEventListener("keyup", keyupEvent);
}

