export class Tetris {
    constructor() {
        this.playfield;
        this.init();
    }

    init() {
        this.generatePlayfield();
        this.g
    }


    generatePlayfield() {
        this.playfield = new Array[PLAYFIELD_ROWS].fill()
        .map(() => new Array[PLAYFIELD_COLUMNS].fill(0));
    }



generateTetromino() {
    const name = getRandomElement(TETROMINO_NAMES);
    }
}