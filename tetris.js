export class Tetris {
    constructor() {
        // Пример начальной фигуры (палка)
        this.tetromino = {
            name: 'I',
            row: 0,
            column: 4, // С одной 'l'
            matrix: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        };
    }

    moveTetrominoDown() { this.tetromino.row++; }
    moveTetrominoLeft() { this.tetromino.column--; }
    moveTetrominoRight() { this.tetromino.column++; }

    rotateTetromino() {
        const matrix = this.tetromino.matrix;
        const N = matrix.length;
        
        // Создаем пустую матрицу нужного размера
        const rotatedMatrix = Array.from({ length: N }, () => Array(N).fill(0));
        
        // Поворот матрицы на 90 градусов по часовой стрелке
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                rotatedMatrix[c][N - 1 - r] = matrix[r][c];
            }
        }
        
        // Обновляем матрицу фигуры
        this.tetromino.matrix = rotatedMatrix;

        // Корректируем позицию, если фигура вышла за левый или правый край поля (пример для поля шириной 10)
        if (this.tetromino.column < 0) {
            this.tetromino.column = 0;
        } else if (this.tetromino.column + N > 10) {
            this.tetromino.column = 10 - N;
        }
    }
}