var primaryScne = new MainScene();

var consoleLabel = new Label();
var statusLabel = new Label();

Setup(() => {
    consoleLabel.setFontSize(16);
    consoleLabel.setFontFamily("monospace");
    consoleLabel.setTextAlign("right");
    consoleLabel.setOpacity(0.8);
    consoleLabel.setPadding(10);
    consoleLabel.setSize(400, 250);
    consoleLabel.getDOM((d) => {
        d.style.overflowWrap = "break-word";
        d.style.overflow = "hidden";
    });

    statusLabel.setOpacity(0.8);
    statusLabel.setPadding(10);
    statusLabel.setSize(260, 180);
    statusLabel.setPosition(10, 10);

    primaryScne.setSize(WIDTH, HEIGHT);
    primaryScne.setup();
    primaryScne.loop();

    consoleLabel.paint();
    statusLabel.paint();
    primaryScne.paint();
});

Loop(() => {
    primaryScne.setSize(WIDTH, HEIGHT);
    primaryScne.player((p) => {
        if (KEY_MAP.shift) {
            p.setSpeed(2.0*2.0);
            p.setOpacity(0.75);
        } else {
            p.setSpeed(2.0);
            p.setOpacity(1.0);
        }

        if (KEY_MAP.w) p.moveSet("up");
        if (KEY_MAP.a) p.moveSet("left");   
        if (KEY_MAP.s) p.moveSet("down"); 
        if (KEY_MAP.d) p.moveSet("right");   
        if (KEY_MAP.w && KEY_MAP.a) p.moveSet("left_up");    
        if (KEY_MAP.s && KEY_MAP.a) p.moveSet("left_down");  
        if (KEY_MAP.w && KEY_MAP.d) p.moveSet("right_up");     
        if (KEY_MAP.s && KEY_MAP.d) p.moveSet("right_down");
    });

    statusLabel.setText(
        "FPS: " + FPS + ", ~" + (1000/FPS).toFixed(2) + "ms<br>"
        + "Delay: " + DELAY + "ms <br>"
        + "<br>"
        + "Window: " + WIDTH + ", " + HEIGHT + "<br>"
        + "Mouse: " + MOUSE_X + ", " + MOUSE_Y + "<br>" 
        + "Keyboard: " + KEY_MULTI_PRESSED + "<br>"
        + "<br>"
        + "Primary Scene: " + primaryScne.id + "<br>"
    );

    consoleLabel.setPosition(WIDTH - consoleLabel.width - 30, 10);
    consoleLabel.setText(CONSOLE);
    consoleLabel.getDOM((d) => {
        d.scrollTop = d.scrollHeight;
    });
});