import "phaser";
import { BreakoutScene } from "./breakout";
import "./style.css";

let game = new Phaser.Game({
  width: 800,
  height: 600,
  scene: [BreakoutScene],
  physics: {
    default: "matter",
    matter: {
      enableSleeping: true,
    },
  },
});
