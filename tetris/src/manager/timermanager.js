import GameConfig from "../config/gameconfig.js";

export default class TimerManager {
    static instance;

    constructor() {
        if(!TimerManager.instance) {
            this.fallingBlockTimer = 0
            TimerManager.instance = this
        }
        return TimerManager.instance
    }

    init() {
        this.fallingBlockTimer = 0
    }

    update(delta) {
        this.fallingBlockTimer += delta
    }


    checkBlockDropTime() {
        if(this.fallingBlockTimer > GameConfig.MainScene.TIMER_INTERVAL_BLOCK_DOWN) {
            this.fallingBlockTimer = 0;
            return true
        }
        return false;
    }
}