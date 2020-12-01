require('phaser');

const config = {
  title: 'FBLA',
  width: 800,
  height: 600,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  backgroundColor: '#18216D',
};

class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('black', 'game/assets/black.png');
  }

  create() {
    this.add.image(400, 300, 'black');
  }
}

config.scene = GameScene

new Phaser.Game(config);
