require('phaser');

// How much to shift the grid of blocks
const gridDisplacement = {
  x: 100,
  y: 100,
};

const config = {
  title: 'FBLA',
  width: 600,
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

    let level = 1;
    let levelText = this.add.text(
      gridDisplacement.x,
      gridDisplacement.y - 80, // 100 - (32+16+32)
      `Level ${level}`,
      {
        fontSize: '32px',
        fill: '#fff',
      }
    );

    let score = 0;
    let scoreText = this.add.text(
      gridDisplacement.x,
      gridDisplacement.y - 48, // 100 - (32+16)
      `Score: ${score}`,
      { fontSize: '32px', fill: '#fff' }
    );

    let lives = 5;
    let livesText = this.add.text(
      gridDisplacement.x + 225,
      gridDisplacement.y - 80, // 100 - (32+16+32)
      `Lives: ${lives}`,
      { fontSize: '32px', fill: '#fff' }
    );

    const setUpMap = () => {
      // Set up field
      let map = [[]];
      for (let i = 0; i < rows; i++) {
        map[i] = [];
        for (let j = 0; j < cols; j++) {
          const xCord = 64 * i + 32 + gridDisplacement.x;
          const yCord = 64 * j + 32 + gridDisplacement.y;

          // 0 - 3 (inclusive)
          const number = Math.floor(Math.random() * 4);

          const sprite = this.add
            .sprite(xCord, yCord, gems[number])
            .setInteractive();

          this.input.setDraggable(sprite);

          map[i][j] = { xCord, yCord, color: gems[number], sprite };
        }
      }

      return map;
    };

    let map = setUpMap();

    // On click of gem
    this.input.on('pointerdown', (pointer, gameObject) => {
      try {
        // x = col (x-axis, straight up)
        // y = row
        let destroyed = 0;

        // Deletes all nearby blocks with same color.
        const findDuplicates = (sprite, prev) => {
          if (sprite === null || sprite === undefined) {
            return;
          }

          // To get a number bt 0 - 5 to be used in the maps variable.
          const row = (sprite.x - gridDisplacement.x - 32) / 64;
          const col = (sprite.y - gridDisplacement.y - 32) / 64;

          // Function to check if gem is already included
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
          if (map[row][col - 1]) {
            // Check if it is the same as prev piece && same color
            if (
              !checkPrev(map[row][col - 1], prev) &&
              map[row][col].color === map[row][col - 1].color
            ) {
              // Add it to previous array.
              prev.push({
                x: map[row][col].xCord,
                y: map[row][col].yCord,
              });
              // Recursively call the function on the new gem
              findDuplicates(map[row][col - 1].sprite, prev);
            }
          }

          // Check Bottom Color
          if (map[row][col + 1]) {
            // Check if it is the same as prev piece && same color
            if (
              !checkPrev(map[row][col + 1], prev) &&
              map[row][col].color === map[row][col + 1].color
            ) {
              // Add it to previous array.
              prev.push({
                x: map[row][col].xCord,
                y: map[row][col].yCord,
              });
              // Recursively call the function on the new gem
              findDuplicates(map[row][col + 1].sprite, prev);
            }
          }

          // Check Left Color
          if (map[row - 1]) {
            // Check if it is the same as prev piece && same color
            if (
              !checkPrev(map[row - 1][col], prev) &&
              map[row][col].color === map[row - 1][col].color
            ) {
              prev.push({
                x: map[row][col].xCord,
                y: map[row][col].yCord,
              });
              findDuplicates(map[row - 1][col].sprite, prev);
            }
          }

          // Check Right Color
          if (map[row + 1]) {
            // Check if it is the same as prev piece && same color
            if (
              !checkPrev(map[row + 1][col], prev) &&
              map[row][col].color === map[row + 1][col].color
            ) {
              prev.push({
                x: map[row][col].xCord,
                y: map[row][col].yCord,
              });
              findDuplicates(map[row + 1][col].sprite, prev);
            }
          }

          // Destroy gem and log it.
          map[row][col].sprite.destroy();
          map[row][col].sprite = null;
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
              if (map[i][j].sprite !== null) {
                let h = j;
                let lowestIndex = 6;
                let lowest = false;
                // Should be for loop but oh well.
                // Check if bottom gem is empty, look for most bottomest space
                while (h < 6) {
                  if (map[i][h].sprite === null) {
                    if (j !== h) {
                      lowest = true;
                      lowestIndex = h;
                    }
                  }
                  h++;
                }

                // replace bottomest space with top space
                if (lowest) {
                  map[i][lowestIndex].sprite = map[i][j].sprite;
                  map[i][lowestIndex].color = map[i][j].color;
                  map[i][j].sprite = null;
                  map[i][j].color = null;

                  // Add animation
                  this.tweens.add({
                    targets: map[i][lowestIndex].sprite,
                    y: map[i][lowestIndex].yCord,
                    duration: 250,
                    ease: 'Sine.easeIn',
                  });
                }
              }
            }
          }
        };

        // Look for similar gems around. Initial funciton call.
        findDuplicates(gameObject[0], []);
        if (destroyed === 0) {
          return;
        }

        // Update gem field.
        fallDown();

        // Update scoreboard.
        // Amt Destroyed*100*multiplier
        // Todo: Fix Multiplier
        score += destroyed * 100 * 1.3;
        scoreText.setText(`Score ${score}`);

        // Check if there are still gems on the screen
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            // If there are still gems then return;
            if (map[i][j].sprite !== null) {
              return;
            }
          }
        }

        // Add req to level up. If they get enough they lose a life & reset level.
        const reqToLevelup = level * 2 + 1000;
        if (score >= reqToLevelup) {
          if (level === 3) {
            // Show you win screen


            // Reset game.
            level = 1;
            levelText.setText(`Level ${level}`);
            lives = 5;
            livesText.setText(`Lives ${lives}`);
            score = 0;
            scoreText.setText(`Score ${score}`);
            map = setUpMap();
          } else {
            // Show level up screen.
            level++;
            levelText.setText(`Level ${level}`);

            // Reset map.
            map = setUpMap();
          }
        } else {
          if (lives === 0) {
            // Game over.
          } else {
            // Show you lost screen.
            lives--;
            livesText.setText(`Lives ${lives}`);
          }
        }

        // Show congrats & level up screen
      } catch (e) {
        // Fix errors later.
        console.log(e);
      }
    });
  }
}

config.scene = GameScene;

new Phaser.Game(config);
