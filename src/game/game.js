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
      let destroyed = 0;

      // Deletes all nearby blocks with same color.
      const findDuplicates = (sprite, prev) => {
        if (sprite === null || sprite === undefined) {
          return;
        }

        const row = (sprite.x - gridDisplacement.x - 32) / 64;
        const col = (sprite.y - gridDisplacement.y - 32) / 64;

        // default to -1, -1 aka no prev.
        const checkPrev = (s, p) => {
          for (let i = 0; i < p.length; i++) {
            if (p[i]) {
              if (s.xCord === p[i].x && s.yCord === p[i].y) {
                return true;
              }
            }
          }

          return false;
        };

        // Check Top Color
        // If Not a corner piece
        if (level[row][col - 1]) {
          // Check if it is the same as prev piece && same color
          if (
            !checkPrev(level[row][col - 1], prev) &&
            level[row][col].color === level[row][col - 1].color
          ) {
            prev.push({
              x: level[row][col].xCord,
              y: level[row][col].yCord,
            });
            findDuplicates(level[row][col - 1].sprite, prev);
          }
        }

        // Check Bottom Color
        if (level[row][col + 1]) {
          // Check if it is the same as prev piece && same color
          if (
            !checkPrev(level[row][col + 1], prev) &&
            level[row][col].color === level[row][col + 1].color
          ) {
            prev.push({
              x: level[row][col].xCord,
              y: level[row][col].yCord,
            });
            findDuplicates(level[row][col + 1].sprite, prev);
          }
        }

        // Check Left Color
        if (level[row - 1]) {
          // Check if it is the same as prev piece && same color
          if (
            !checkPrev(level[row - 1][col], prev) &&
            level[row][col].color === level[row - 1][col].color
          ) {
            prev.push({
              x: level[row][col].xCord,
              y: level[row][col].yCord,
            });
            findDuplicates(level[row - 1][col].sprite, prev);
          }
        }

        // Check Right Color
        if (level[row + 1]) {
          // Check if it is the same as prev piece && same color
          if (
            !checkPrev(level[row + 1][col], prev) &&
            level[row][col].color === level[row + 1][col].color
          ) {
            prev.push({
              x: level[row][col].xCord,
              y: level[row][col].yCord,
            });
            findDuplicates(level[row + 1][col].sprite, prev);
          }
        }

        level[row][col].sprite.destroy();
        level[row][col].sprite = null;
        destroyed++;
      };

      findDuplicates(gameObject[0], []);
      console.log(destroyed);
      

      // Stick Block Falling Down code here.

      // if (gameObject[0]) {
      //   gameObject[0].destroy();
      // }
    });
  }
}

config.scene = GameScene;

new Phaser.Game(config);
