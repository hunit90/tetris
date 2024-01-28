import TetrisBlcokO from "./tetrisblock/oblock.js";
import TetrisBlcokT from "./tetrisblock/tblock.js";
import TetrisBlcokI from "./tetrisblock/iblock.js";
import TetrisBlcokJ from "./tetrisblock/jblock.js";
import TetrisBlcokL from "./tetrisblock/lblock.js";
import TetrisBlcokS from "./tetrisblock/sblock.js";
import TetrisBlcokZ from "./tetrisblock/zblock.js";

export default class TetrisBlockFactory {
    static instance;

    constructor() {
        if (!TetrisBlockFactory.instance) {
            TetrisBlockFactory.instance = this

            this._blocks = [
                new TetrisBlcokI(),
                new TetrisBlcokJ(),
                new TetrisBlcokL(),
                new TetrisBlcokO(),
                new TetrisBlcokS(),
                new TetrisBlcokT(),
                new TetrisBlcokZ(),
            ]
        }
        return TetrisBlockFactory.instance
    }

    createRandomBlock() {
        return this._blocks[Math.floor(Math.random() * this._blocks.length)]
    }
}