import GameConfig from "../config/gameconfig.js";
import TetrisBlockFactory from "./tetrisblockfactory.js";
import {checkBlockCollision, checkBlockWithInArea} from "./tetrisblock/helper.js";
import TimerManager from "../manager/timermanager.js";

export default class GameBoard {
  constructor(scene) {
    this.scene = scene;
    this.board = [];
    this.renderBoard = [];
    this.currentTetrisBlock = undefined;
    this.tetrisBlockFactory = new TetrisBlockFactory()
    this.timerManager = new TimerManager()
    this.gameEnd = false
  }

  init() {
    this._initBoard(this.board, 0)
    this._initBoard(this.renderBoard, 0)

    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.scene.input.keyboard.on('keydown', this.handleKeyUp.bind(this))
  }

  handleKeyUp(event) {
    if (this.currentTetrisBlock === undefined || this.gameEnd) return
    if(event.keyCode === Phaser.Input.Keyboard.KeyCodes.J && this.canMoveBlock(-1, 0)) {
      this.currentTetrisBlock.move(-1,0)
    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.L && this.canMoveBlock(1,0)) {
      this.currentTetrisBlock.move(1,0)
    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.K && this.canMoveBlock(0,1)) {
      this.currentTetrisBlock.move(0,1)
    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.I && this.canRotateBlock()) {
       this.currentTetrisBlock.rotate()
    } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
      this.dropBlock()
    }
  }

  canMoveBlock(offsetX, offsetY) {
    if (this.currentTetrisBlock === undefined) return false
    const blockInfo = this.currentTetrisBlock.getNextMoveInfo(offsetX, offsetY)
    if (!checkBlockWithInArea(blockInfo, this.board)) return false;
    if (checkBlockCollision(blockInfo, this.board)) return false
    return true
  }

  canRotateBlock() {
    if(this.currentTetrisBlock === undefined) return false;
    const blockInfo = this.currentTetrisBlock.getNextRotateInfo()
    if(!checkBlockWithInArea(blockInfo, this.board)) return false
    if(checkBlockCollision(blockInfo, this.board)) return false

    return true
  }

  _initBoard(tiles, value) {
    for (let i = 0; i < GameConfig.MainScene.GAME_BOARD_HEIGHT_CNT; i++) {
      let tempArr = [];
      for (let j = 0; j < GameConfig.MainScene.GAME_BOARD_WIDTH_CNT; j++) {
        tempArr.push(value);
      }
      tiles[i] = tempArr;
    }
  }

  moveBlock(offsetX, offsetY) {
    if (this.currentTetrisBlock === undefined) return
    this.currentTetrisBlock.move(offsetX, offsetY)
  }

  dropBlock() {
    for(let y = 0; y< GameConfig.MainScene.GAME_BOARD_HEIGHT_CNT; y++) {
      if (!this.canMoveBlock(0, y)) {
        this.currentTetrisBlock.move(0,y-1)
        break
      }
    }
    this.placeBlock()
  }

  spawnRandomBlock(x,y) {
    const block = this.tetrisBlockFactory.createRandomBlock()
    block.setPosition(x,y)
    return block
  }

  _boardToRenderBoard() {
    for(let y = 0 ; y < GameConfig.MainScene.GAME_BOARD_HEIGHT_CNT; y++){
      for(let x = 0; x < GameConfig.MainScene.GAME_BOARD_WIDTH_CNT; x++) {
        this.renderBoard[y][x] = this.board[y][x]
      }
    }
  }

  _currentBlockToRenderBoard() {
    if(this.currentTetrisBlock === undefined) return
    const renderInfo = this.currentTetrisBlock.getRenderInfo()
    for (let y = renderInfo.startY, y2 = 0; y < renderInfo.endY; y++, y2++) {
      for (let x = renderInfo.startX, x2 = 0; x < renderInfo.endX; x++, x2++) {
        if(y < 0 || x < 0) continue
        if (renderInfo.tiles[y2][x2] !== 0) {
          this.renderBoard[y][x] = renderInfo.tiles[y2][x2];
        }
      }
    }
  }

  update(time, delta) {
    if (this.gameEnd) return
    const {isClear, line} = this.checkForClearableLines()
    if (isClear) {
      this.clearLines(line)
      this.lineDown(line)
    } else {
      if(this.currentTetrisBlock === undefined){
        const block = this.spawnRandomBlock(GameConfig.MainScene.GAME_BOARD_WIDTH_CNT/2,0)
        if (this.canSpawnBlock(block)) {
          this.currentTetrisBlock = block
        } else {
          this.currentTetrisBlock = this.setLastBlockPos(block)
          this.gameEnd = true
          this.scene.cameras.main.shake(500)
        }
      } else {
        if (this.timerManager.checkBlockDropTime()) {
          if (this.canMoveBlock(0, 1)) {
            this.currentTetrisBlock.move(0, 1)
          } else {
            this.placeBlock()
          }
        }

      }
    }
  }

  setLastBlockPos(block) {
    let blockInfo = block.getRenderInfo()
    while(checkBlockCollision(blockInfo, this.board)) {
      block.move(0,-1)
      blockInfo = block.getRenderInfo()
    }
    return block
  }

  canSpawnBlock(block) {
    const blockInfo = block.getRenderInfo()
    if(!checkBlockWithInArea(blockInfo, this.board)) return false
    if(checkBlockCollision(blockInfo, this.board)) return false
    return true
  }

  placeBlock() {
    if(this.currentTetrisBlock === undefined) return

    const renderInfo = this.currentTetrisBlock.getRenderInfo()
    for (let y = renderInfo.startY, y2=0; y<renderInfo.endY; y++, y2++){
      for (let x = renderInfo.startX, x2 = 0; x < renderInfo.endX; x++, x2++) {
        if (renderInfo.tiles[y2][x2] !== 0) {
          this.board[y][x] = renderInfo.tiles[y2][x2]
        }
      }
    }
    this.currentTetrisBlock = undefined
  }

  checkForClearableLines() {
    for(let y = GameConfig.MainScene.GAME_BOARD_HEIGHT_CNT-1; y>=0; y--){
      let isClear = true
      for(let x = 0; x < GameConfig.MainScene.GAME_BOARD_WIDTH_CNT;x++) {
        if(this.board[y][x] === 0) {
          isClear = false;
          break;
        }
      }
      if (isClear) {
        return { isClear:true, line: y }
      }
    }
    return {isClear: false}
  }

  clearLines(line) {
    for (let x = 0; x < GameConfig.MainScene.GAME_BOARD_WIDTH_CNT; x++) {
      this.board[line][x] = 0
    }
  }

  lineDown(line) {
    for(let x = 0; x < GameConfig.MainScene.GAME_BOARD_WIDTH_CNT; x++){
      for(let y=line; y>=1; y--) {
        this.board[y][x] = this.board[y-1][x]
        this.board[y-1][x] = 0
      }
    }
  }

  render() {
    this.scene.children.removeAll()
    this._boardToRenderBoard()
    this._currentBlockToRenderBoard()
    this._renderBackgroundGameBoard()
  }

  _renderBackgroundGameBoard() {
    for(let i=0; i<GameConfig.MainScene.GAME_BOARD_HEIGHT_CNT; i++) {
      for(let j = 0; j < GameConfig.MainScene.GAME_BOARD_WIDTH_CNT; j++) {
        if (this.renderBoard[i][j] === 0) {
          this.scene.add.image(j * GameConfig.MainScene.RENDER_TILE_SIZE, i * GameConfig.MainScene.RENDER_TILE_SIZE, GameConfig.MainScene.BACKGROUND_TILE_SPRITE_SHEET_KEY, 0)
              .setScale(GameConfig.MainScene.RENDER_TILE_SIZE/GameConfig.MainScene.RENDTER_TILE_SPRITE_ORIGIN_SIZE)
              .setOrigin(0,0)
        } else {
          this.scene.add.image(j * GameConfig.MainScene.RENDER_TILE_SIZE, i * GameConfig.MainScene.RENDER_TILE_SIZE, GameConfig.MainScene.RENDER_TILE_SPRITE_SHEET_KEY, this.renderBoard[i][j]-1)
              .setScale(GameConfig.MainScene.RENDER_TILE_SIZE/GameConfig.MainScene.RENDTER_TILE_SPRITE_ORIGIN_SIZE)
              .setOrigin(0,0)
        }
      }
    }
  }
}