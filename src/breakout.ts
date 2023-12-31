class BreakoutScene extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
  }

  preload() {
    this.load.image("circle", "circle.png");
    this.load.image("square", "square.png");
  }

  create() {
    let keys = this.input.keyboard?.addKeys("R,W,S,A,D");
    let [w, h] = [this.sys.canvas.width, this.sys.canvas.height];
    this.matter.world.setBounds(0, 0, w, h, 32).disableGravity();
    let ball = create_ball(this, 8);
    let paddle = create_paddle(this, keys);
    let blocks = create_blocks(this);
    let border = create_border(this);
    let [score, reset_score] = create_score(this, blocks.flat());
    let startText = this.add
      .text(w / 2, h / 2, "Start", { fontSize: 50 })
      .setOrigin(0.5, 0.5)
      .setVisible(false);
    let gameOverText = this.add
      .text(w / 2, h / 2, "Game Over", { fontSize: 50 })
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    let pause = () => {
      this.children.each((c) => c.setActive(false));
      this.matter.pause();
    };
    let resume = () => {
      this.children.each((c) => c.setActive(true));
      this.matter.resume();
    };
    let reset = () => {
      ball.setPosition((1 / 2) * w, (1 / 2) * h).setVelocity(5, 5);
      paddle.setPosition((1 / 2) * w, (3 / 4) * h);
      blocks
        .flat()
        .forEach((block) =>
          block.setActive(true).setVisible(true).setCollisionCategory(1)
        );
      reset_score();
    };
    let start = () => {
      reset();
      startText.setVisible(true);
      pause();
      keys.R.once("down", () => {
        startText.setVisible(false);
        resume();
      });
    };
    let gameOver = () => {
      gameOverText.setVisible(true);
      pause();
      keys.R.once("down", () => {
        gameOverText.setVisible(false);
        start();
      });
    };

    start();
    border.on("game over", () => {
      gameOver();
    });
  }

  update(t: number, dt: number) {
    this.children.each((c) => {
      if (c.active) {
        c.emit("update", t, dt);
      }
    });
  }
}

function create_border(scene: Phaser.Scene): Phaser.GameObjects.GameObject {
  let [w, h] = [scene.sys.canvas.width, scene.sys.canvas.height];
  let obj = scene.matter.add
    .image(0, 0, "square")
    .setAlpha(0)
    .setDisplaySize(w, 30)
    .setRectangle(w, 30)
    .setPosition(w / 2, h - 15)
    .setStatic(true);
  return obj.setOnCollide((e) => {
    obj.emit("game over");
  });
}

function create_score(
  scene: Phaser.Scene,
  sources: Phaser.Events.EventEmitter[]
): [Phaser.GameObjects.GameObject, CallableFunction] {
  let [w, h] = [scene.sys.canvas.width, scene.sys.canvas.height];
  let state = { score: 0 };
  let obj = scene.add.text(0, h, "Score: " + state.score, {}).setOrigin(0, 1);
  sources.forEach((x) => {
    x.on("get score", (score: number) => {
      state.score += score;
      obj.setText("Score: " + state.score);
    });
  });
  let reset = () => {
    state.score = 0;
    obj.setText("Score: " + state.score);
  };
  return [obj, reset];
}

function create_ball(
  scene: Phaser.Scene,
  radius: number
): Phaser.Physics.Matter.Image {
  return scene.matter.add
    .image(0, 0, "circle")
    .setDisplaySize(2 * radius, 2 * radius)
    .setCircle(radius)
    .setFixedRotation()
    .setBounce(1)
    .setFriction(0, 0, 0)
    .setName("ball")
    .setData("name", "ball");
}

function create_paddle(
  scene: Phaser.Scene,
  keys: { D: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key }
): Phaser.Physics.Matter.Image {
  let obj = scene.matter.add
    .image(0, 0, "square")
    .setDisplaySize(200, 30)
    .setRectangle(200, 30)
    .setBounce(1)
    .setStatic(true)
    .on("update", () => {
      let vx = 0;
      if (keys.D.isDown) vx += 1;
      if (keys.A.isDown) vx += -1;
      obj.setPosition(obj.x + vx * 10, obj.y);
    });

  return obj;
}

function create_blocks(scene: Phaser.Scene): Phaser.Physics.Matter.Image[][] {
  let pad = 10;
  let [w, h] = [scene.sys.canvas.width, scene.sys.canvas.height / 2];
  let [bw, bh] = [50, 30];
  let [rows, cols] = [8, 14];

  let [x0, y0] = [pad + bw / 2, pad + bh / 2];
  let [ws, hs] = [
    (w - 2 * pad - bw * cols) / (cols - 1),
    (h - 2 * pad - bh * rows) / (rows - 1),
  ];
  let blocks = Array.from(Array(rows).keys()).map((i) =>
    Array.from(Array(cols).keys())
      .map((j) => [x0 + j * (bw + ws), y0 + i * (bh + hs)])
      .map((p) => create_block(scene).setPosition(...p))
  );
  return blocks;
}

function create_block(scene: Phaser.Scene): Phaser.Physics.Matter.Image {
  return scene.matter.add
    .image(0, 0, "square")
    .setDisplaySize(50, 30)
    .setRectangle(50, 30)
    .setFixedRotation()
    .setBounce(1)
    .setStatic(true)
    .setOnCollide((e) => {
      if (e.bodyA.gameObject.name == "ball") {
        e.bodyB.gameObject.emit("get score", 10);
        e.bodyB.gameObject
          .setVisible(false)
          .setActive(false)
          .setCollisionCategory(null);
      }
    });
}

export { BreakoutScene };

