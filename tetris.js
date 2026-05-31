import { PLAYFIELD_ROWS, PLAYFIELD_COLUMNS, TETROMINO_NAMES, TETROMINOES, getRandomElement } from "./constants.js";

export class Tetris {
    constructor() {
        this.PLAYGROUND_ROWS = PLAYFIELD_ROWS;
        this.PLAYGROUND_COLUMNS = PLAYFIELD_COLUMNS;

        // Создаем пустое игровое поле, заполненное нулями
        this.playField = Array.from({ length: this.PLAYGROUND_ROWS }, () => Array(this.PLAYGROUND_COLUMNS).fill(0));
        
        this.tetromino = null;
        this.resetTetromino();
    }

    resetTetromino() {
        const randomName = getRandomElement(TETROMINO_NAMES);
        const matrix = TETROMINOES[randomName];
        
        this.tetromino = {
            name: randomName,
            matrix: matrix,
            row: 0, // Начинаем строго с 0 строки, чтобы фигура сразу была видна на поле
            column: Math.floor((this.PLAYGROUND_COLUMNS - matrix.length) / 2) // Центрируем фигуру
        };

        // Если при создании новой фигуры она СРАЗУ сталкивается с чем-то — это Game Over
        if (!this._isValidPosition(this.tetromino.matrix, this.tetromino.row, this.tetromino.column)) {
            // Очищаем поле (перезапуск игры)
            this.playField = Array.from({ length: this.PLAYGROUND_ROWS }, () => Array(this.PLAYGROUND_COLUMNS).fill(0));
        }
    }

    _getRotatedMatrix(matrix) {
        const N = matrix.length;
        const rotated = Array.from({ length: N }, () => Array(N).fill(0));
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                rotated[c][N - 1 - r] = matrix[r][c];
            }
        }
        return rotated;
    }

    _isValidPosition(matrix, targetRow, targetColumn) {
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const playgroundRow = targetRow + r;
                    const playgroundCol = targetColumn + c;

                    // Проверяем выход за границы стен и дна
                    if (playgroundCol < 0 || playgroundCol >= this.PLAYGROUND_COLUMNS || playgroundRow >= this.PLAYGROUND_ROWS) {
                        return false;
                    }

                    // Проверяем столкновение с упавшими фигурами (только внутри игрового поля)
                    if (playgroundRow >= 0) {
                        if (this.playField[playgroundRow][playgroundCol] !== 0) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    moveTetrominoDown() { 
        if (this._isValidPosition(this.tetromino.matrix, this.tetromino.row + 1, this.tetromino.column)) {
            this.tetromino.row++; 
        } else {
            this.lockTetromino();
        }
    }

    moveTetrominoLeft() { 
        if (this._isValidPosition(this.tetromino.matrix, this.tetromino.row, this.tetromino.column - 1)) {
            this.tetromino.column--; 
        }
    }

    moveTetrominoRight() { 
        if (this._isValidPosition(this.tetromino.matrix, this.tetromino.row, this.tetromino.column + 1)) {
            this.tetromino.column++; 
        }
    }

    rotateTetromino() {
        const nextMatrix = this._getRotatedMatrix(this.tetromino.matrix);
        const offsets = [0, -1, 1, -2, 2]; 

        for (let offset of offsets) {
            const nextColumn = this.tetromino.column + offset;
            if (this._isValidPosition(nextMatrix, this.tetromino.row, nextColumn)) {
                this.tetromino.matrix = nextMatrix;
                this.tetromino.column = nextColumn;
                return;
            }
        }
    }

    lockTetromino() {
        const matrix = this.tetromino.matrix;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                if (matrix[r][c] !== 0) {
                    const fieldRow = this.tetromino.row + r;
                    const fieldCol = this.tetromino.column + c;
                    
                    // Безопасно записываем строковое имя фигуры ('I', 'J', etc.) в массив стакана
                    if (fieldRow >= 0 && fieldRow < this.PLAYGROUND_ROWS && fieldCol >= 0 && fieldCol < this.PLAYGROUND_COLUMNS) {
                        this.playField[fieldRow][fieldCol] = this.tetromino.name; 
                    }
                }
            }
        }
        
        this.clearLines();       // Удаляем собранные линии (если они есть)
        this.resetTetromino();   // Создаем новую фигуру на самом верху поля
    }

    clearLines() {
        for (let r = this.PLAYGROUND_ROWS - 1; r >= 0; r--) {
            if (this.playField[r].every(cell => cell !== 0)) {
                this.playField.splice(r, 1);
                this.playField.unshift(Array(this.PLAYGROUND_COLUMNS).fill(0));
                r++;
            }
        }
    }
}