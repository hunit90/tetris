import Phaser from "phaser";
import MainScene from "./scene/mainscene";

const config = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 400,
  height: 800,
  scene: [MainScene]
}

export default new Phaser.Game(config)