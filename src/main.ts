import "phaser";
import "./style.css";

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
  }

  preload() {
    this.load.image("circle", "circle.png");
    this.load.image("square", "square.png");
  }

  create() {
    let keys = this.input.keyboard?.addKeys("W,S,A,D");
    console.log(keys);
    let [w, h] = [this.sys.canvas.width, this.sys.canvas.height];
    this.matter.world.setBounds(0, 0, w, h, 32).disableGravity();
    let ball = create_ball(this, 8)
      .setPosition((1 / 2) * w, (1 / 2) * h)
      .setVelocity(10, 10);
    let paddle = create_paddle(this, keys).setPosition(
      (1 / 2) * w,
      (3 / 4) * h
    );
  }

  update(t: number, dt: number) {
    this.children.each((c) => {
      c.emit("update", t, dt);
    });
  }
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
    .setFriction(0, 0, 0);
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
      console.log("foo");
      if (keys.D.isDown) vx += 1;
      if (keys.A.isDown) vx += -1;
      obj.setPosition(obj.x + vx * 10, obj.y);
    });

  return obj;
}

let game = new Phaser.Game({
  width: 800,
  height: 600,
  scene: [MainScene],
  physics: {
    default: "matter",
    matter: {
      enableSleeping: true,
    },
  },
});
