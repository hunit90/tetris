import Phaser from 'phaser'
import GameBoard from "../obj/gameboard.js";
import GameConfig from "../config/gameconfig.js";
import TimerManager from "../manager/timermanager.js";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
    this.gameBoard = new GameBoard(this)
    this.timerManager = new TimerManager()
  }

  preload() {
    this.load.spritesheet(GameConfig.MainScene.RENDER_TILE_SPRITE_SHEET_KEY, 'img/block.png', {frameWidth:GameConfig.MainScene.RENDTER_TILE_SPRITE_ORIGIN_SIZE, frameHeight:GameConfig.MainScene.RENDTER_TILE_SPRITE_ORIGIN_SIZE})
    this.load.spritesheet(GameConfig.MainScene.BACKGROUND_TILE_SPRITE_SHEET_KEY, 'img/back.png', {frameWidth:GameConfig.MainScene.RENDTER_TILE_SPRITE_ORIGIN_SIZE, frameHeight:GameConfig.MainScene.RENDTER_TILE_SPRITE_ORIGIN_SIZE})
  }

  create() {
    // this.add.text(100,100,'hello world', {fill: '#0f0'})
    // this.add.image(200,200,'block',0)
    // this.add.image(200,300,'block',1)
    //
    // this.add.image(300,300,'back',0)

    this.gameBoard.init()
    this.gameBoard.spawnRandomBlock(5,0)
    this.gameBoard.render()
  }

  update(time, delta) {
    this.timerManager.update(delta)

    this.gameBoard.update(time, delta)
    this.gameBoard.render()
  }
}