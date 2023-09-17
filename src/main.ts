import "phaser";
import "./style.css";

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
  }

  create() {
    console.log(this.scene.key + ".create()");
    create_box(this)
  }

  update(t: number, dt: number) {
    this.children.each((c) => {
      c.emit("update", t, dt);
    });
  }
}

function create_box(scene: Phaser.Scene): Phaser.GameObjects.GameObject {
  let box = scene.add
    .rectangle()
    .setOrigin(0, 0)
    .setPosition(100, 100)
    .setSize(200, 100)
    .setFillStyle(0xff0000, 0.5);
  let state = { vx: 1.0 };
  box.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
    console.log("clicked");
    state.vx *= -1;
  });
  box.on("update", function (t: number, dt: number) {
    box.setPosition(box.x + state.vx, box.y);
  });
  return box;
}

let game = new Phaser.Game({ width: 800, height: 600, scene: [MainScene] });
