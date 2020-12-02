require('phaser');

// How much to shift the grid of blocks
const gridDisplacement = {
  x: 100,
  y: 100,
};

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
    const gems = ['black', 'green', 'red', 'yellow'];

    const rows = 6;
    const cols = 6;

    let level = [[]];

    for (let i = 0; i < rows; i++) {
      level[i] = [];
      for (let j = 0; j < cols; j++) {
        const xCord = 64 * i + 32;
        const yCord = 64 * j + 32;

        // 0 - 3 (inclusive)
        const number = Math.floor(Math.random() * 4);

        const sprite = this.add
          .sprite(
            xCord + gridDisplacement.x,
            yCord + gridDisplacement.y,
            gems[number]
          )
          .setInteractive();

        this.input.setDraggable(sprite);

        level[i][j] = { xCord, yCord, color: gems[number], sprite };
      }
    }

    this.input.on('pointerdown', (pointer, gameObject) => {
      // x = col (x-axis, straight up)
      // y = row

      const findDuplicates = (sprite) => {
        const row = (sprite.x - gridDisplacement.x - 32) / 64;
        const col = (sprite.y - gridDisplacement.y - 32) / 64;

        // Find all neighboring sprites with same color and call recursivly.
    
        if (level[row][col - 1] === undefined) {
          level[row][col].sprite.destroy();
          level[row][col].sprite = null;
          console.log(level);
          return;
        }
        // Just Check if one side is not defined^^
        // TODO: ^^
        // As long as one side of not defined then contiune with program... so wrap everything in if loop.

        // Check Top Color
        console.log(col);
        console.log(level);
        if (level[row][col].color === level[row][col - 1].color) {
          findDuplicates(level[row][col - 1].sprite);
        }

        level[row][col].sprite.destroy();
        level[row][col].sprite = null;
        console.log(level);
      };

      findDuplicates(gameObject[0]);

      // if (gameObject[0]) {
      //   gameObject[0].destroy();
      // }
    });
  }
}

config.scene = GameScene;

new Phaser.Game(config);
