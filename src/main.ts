import "phaser";
import "./style.css";

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
  }

  create() {
    console.log(this.scene.key + ".create()");
  }
}
let game = new Phaser.Game({ width: 800, height: 600, scene: [MainScene] });
