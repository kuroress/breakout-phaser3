import "phaser";
import "./style.css";

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
  }

  preload() {
    this.load.image("circle", "circle.png");
  }

  create() {
    this.matter.world
      .setBounds(0, 0, this.sys.canvas.width, this.sys.canvas.height, 32)
      .disableGravity();
    let ball = create_ball(this, 8).setPosition().setVelocity(10, 10);
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
