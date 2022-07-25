kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  clearColor: [0, 0, 1, 0.7],
});

loadRoot("./sprites/");
loadSprite("mario", "spongebob.png");
loadSprite("redbrick", "block.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("coin", "coin.png");
loadSprite("lootbox", "surprise.png");
loadSprite("shrooms", "mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("unboxedLoot", "unboxed.png");
loadSprite("castle", "castle.png");
loadSound("gameSound", "newMusic.mp3");
loadSound("jump", "jumpSound.mp3");
/////////////////////////////////////////////////////////////////////////////////////////
scene("lose", (score) => {
  add([
    text("L\n press R to restart", 32),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);
  keyPress("r", () => {
    go("game");
  });
});
////////////////////////////////////////////////////////////////////////////////////////
scene("win", (score) => {
  add([
    text("GG EZ\nfinal Score:" + score + "\n press R to restart", 32),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);
  keyPress("r", () => {
    go("game");
  });
});
////////////////////////////////////////////////////////////////////////////////////////
scene("start", () => {
  add([
    text("GLORY TO KHAZAKSTAN", 32),
    pos(width() / 2, height() / 2 - 50),
    origin("center"),
  ]);
  keyPress("enter", () => {
    go("game");
  });
  const button = add([
    rect(300, 70),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);
  add([
    text("hit enter", 32),
    pos(width() / 2, height() / 2),
    origin("center"),
    color(0, 0, 0),
  ]);
  button.action(() => {
    if (button.isHovered()) {
      button.color = (0.5, 0.5, 0.5);
    } else {
      button.color = (0, 0, 0);
    }
    if (mouseIsClicked()) {
      go("game");
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////
scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                                                       ",
    "                                     =====           =                 ",
    "                        ====                                  R        ",
    "                                    T                                  ",
    "        =+==$           ======???====$$$=====                          ",
    "            T     T                                                    ",
    "==================================================  ===================",
    "==================   ============================  ====================",
    "==================   ============================  ====================",
    "==================   =============================  ===================",
  ];
  const mapsymbols = {
    width: 20,
    height: 20,
    "=": [sprite("redbrick"), solid()],
    $: [sprite("lootbox"), solid(), "lootBoxcoin"],
    "?": [sprite("lootbox"), solid(), "lootBoxHP"],
    C: [sprite("coin"), "coin"],
    S: [sprite("shrooms"), "HP", body()],
    E: [sprite("unboxedLoot"), solid(), "emptyBox"],
    T: [sprite("goomba"), solid(), "goomba", body()],
    R: [sprite("castle"), "castle"],
  };
  const moveSpeed = 200;
  const jumpForce = 400;
  let isJumping = false;
  let isBig = false;
  const gamelevel = addLevel(map, mapsymbols);
  play("gameSound");
  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(jumpForce),
  ]);

  let score = 0;
  const scorelabel = add([
    text("score:" + score),
    pos(player.pos.x, player.pos.y - 150),
    layer("ui"),
    {
      value: score,
    },
  ]);

  keyDown("d", () => {
    player.move(moveSpeed, 0);
  });
  keyDown("a", () => {
    player.move(-moveSpeed, 0);
  });
  keyDown("w", () => {
    if (player.grounded()) {
      player.jump(jumpForce);
      play("jump");
      let isJumping = true;
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("lootBoxcoin")) {
      gamelevel.spawn("C", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("E", obj.gridPos.sub(0, 0));
    }
    if (obj.is("lootBoxHP")) {
      gamelevel.spawn("S", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("E", obj.gridPos.sub(0, 0));
    }
  });
  player.collides("HP", (obj) => {
    destroy(obj), player.biggify(10), (isBig = true);
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    scorelabel.value += 100;
    scorelabel.text = "score:" + scorelabel.value;
  });
  player.action(() => {
    camPos(player.pos);
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
    if (player.pos.x >= 1280) {
      go("win", scorelabel.value);
    }
  });
  action("HP", (x) => {
    x.move(100, 0);
  });
  action("goomba", (x) => {
    x.move(100, 0);
  });
  player.collides("goomba", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      if ((isBig = true)) {
        destroy(obj);
        player.smallify;
      } else {
        destroy(player);
        go("lose");
      }
    }
  });
});
start("start");
