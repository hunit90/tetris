import GameConfig from "../../config/gameconfig.js";

export default class TetrisBlock {
    constructor(tiles) {
        this.tiles = tiles
        this.currentTile = tiles[0]
        this.width = this.currentTile[0].length
        this.height = this.currentTile.length
        this.x = undefined
        this.y = undefined
        this.rotateIdx = 0;
        this.rotateSize = tiles.length;
    }

    setPosition(x,y) {
        this.x = x
        this.y = y
    }

    move(offsetX, offsetY) {
        this.x += offsetX
        this.y += offsetY
    }

    rotate() {
        this.rotateIdx = (this.rotateIdx + 1) % this.rotateSize
        this.currentTile = this.tiles[this.rotateIdx]
    }

    getNextMoveInfo(offsetX, offsetY) {
        const nextX = this.x + offsetX
        const nextY = this.y + offsetY

        const startX = nextX - Math.floor(this.width/2)
        const startY = nextY

        const endX = startX + this.width
        const endY = startY + this.height

        return {
            tiles: this.currentTile,
            startX, startY, endX, endY
        }
    }

    getNextRotateInfo() {
        const nextRotateIdx = (this.rotateIdx + 1) % this.rotateSize
        const nextTile = this.tiles[nextRotateIdx]

        const nextBlockWidth = nextTile[0].length
        const nextBlockHeight = nextTile.length
        const startX = this.x - Math.floor(nextBlockWidth/2)
        const startY = this.y

        const endX = startX + nextBlockWidth
        const endY = startY + nextBlockHeight

        return {
            tiles: nextTile,
            startX, startY, endX, endY
        }
    }

    getRenderInfo() {
        const startX = this.x - Math.floor(this.width/2);
        const startY = this.y

        const endX = startX + this.width > GameConfig.MainScene.GAME_BOARD_WIDTH_CNT ? GameConfig.MainScene.GAME_BOARD_WIDTH_CNT : startX + this.width
        const endY = startY + this.height > GameConfig.MainScene.GAME_BOARD_HEIGHT_CNT ? GameConfig.MainScene.GAME_BOARD_HEIGHT_CNT : startY + this.height

        return {
            tiles : this.currentTile,
            startX, startY, endX, endY
        }
    }
}