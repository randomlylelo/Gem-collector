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
    this.load.image('blue', 'game/assets/blue.png');
    this.load.image('green', 'game/assets/green.png');
    this.load.image('red', 'game/assets/red.png');
    this.load.image('orange', 'game/assets/orange.png');
  }

  create() {
    const gems = ['blue', 'green', 'red', 'orange'];

    const rows = 6;
    const cols = 6;

    let level = [[]];

    for (let i = 0; i < rows; i++) {
      level[i] = [];
      for (let j = 0; j < cols; j++) {
        const xCord = 64 * i + 32 + gridDisplacement.x;
        const yCord = 64 * j + 32 + gridDisplacement.y;

        // 0 - 3 (inclusive)
        const number = Math.floor(Math.random() * 4);

        const sprite = this.add
          .sprite(xCord, yCord, gems[number])
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

      // Stick Block Falling Down code here.
      // Start at first col, x = 0;
      // Check bottom most row first, if it has a block then go up, if it doesn't remember and check block above. Keep doing until checks last row.
      const fallDown = () => {
        for (let i = 0; i < cols; i++) {
          // Start at 5 aka the bottommost block.
          for (let j = rows - 2; j >= 0; j--) {
            // check until index reaches 5 to move the block to the most bottom.
            if (level[i][j].sprite !== null) {
              let h = j;
              let lowestIndex = 6;
              let lowest = false;
              while (h < 6) {
                if (level[i][h].sprite === null) {
                  if (j !== h) {
                    lowest = true;
                    lowestIndex = h;
                  }
                }
                h++;
              }
              // replace
              if (lowest) {
                level[i][lowestIndex].sprite = level[i][j].sprite;
                level[i][lowestIndex].color = level[i][j].color;
                level[i][j].sprite = null;
                level[i][j].color = null;

                this.tweens.add({
                  targets: level[i][lowestIndex].sprite,
                  y: level[i][lowestIndex].yCord,
                  duration: 250,
                  ease: 'Sine.easeIn',
                });
              }
            }
          }
        }
      };

      findDuplicates(gameObject[0], []);
      console.log(destroyed);

      if (destroyed === 0) {
        return;
      }

      fallDown();

      // Check if everything is gone via forloops. If so, reset.
    });
  }
}

config.scene = GameScene;

new Phaser.Game(config);
