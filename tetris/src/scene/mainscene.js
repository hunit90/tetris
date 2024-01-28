import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    this.add.text(100,100,'hello world', {fill: '#0f0'})
  }

  update() {
    
  }
}