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
    this.load.image('green', 'game/assets/green.png');
    this.load.image('red', 'game/assets/red.png');
    this.load.image('yellow', 'game/assets/yellow.png');
  }

  create() {
    const level = this.makeGrid();

  }

  makeGrid() {
    const gems = ['black', 'green', 'red', 'yellow'];

    const rows = 6;
    const cols = 6;

    let level = [[]];

    for (let i = 0; i < rows; i++) {
      level[i] = [];
      for (let j = 0; j < cols; j++) {
        // 0 - 3 (inclusive)
        const number = Math.floor(Math.random() * 4);

        // change the +100 to move the grid.
        level[i][j] = this.add.image((64 * i)+32+100, (64 * j)+32+100, gems[number]);
      }
    }

    return level
  }
}

config.scene = GameScene;

new Phaser.Game(config);
