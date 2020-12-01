require('phaser');

const config = {
  title: 'FBLA',
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#18216D',
};

class PuzzleGame extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}

const game = new PuzzleGame(config);
