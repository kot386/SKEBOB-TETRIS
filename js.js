import { Tetris } from "./tetris.js";
import { convertPositionToIndex } from "./constants.js";

const tetris = new Tetris();
const cells = document.querySelectorAll('.grid > div');

function draw() {
    // 1. Полностью очищаем CSS-классы у всех ячеек (стираем шлейфы и прошлые кадры)
    cells.forEach(cell => {
        cell.className = ''; 
    });

    // 2. Отрисовываем зафиксированные кубики в стакане
    for (let r = 0; r < tetris.PLAYGROUND_ROWS; r++) {
        for (let c = 0; c < tetris.PLAYGROUND_COLUMNS; c++) {
            const blockName = tetris.playField[r][c];
            // Если в ячейке лежит строка с именем фигуры (например, 'I', 'O', 'T')
            if (blockName) {
                const index = convertPositionToIndex(r, c);
                if (cells[index]) {
                    cells[index].classList.add(blockName);
                }
            }
        }
    }

    // 3. Отрисовываем текущую активную (падающую) фигуру
    const matrix = tetris.tetromino.matrix;
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] !== 0) {
                const globalRow = tetris.tetromino.row + r;
                const globalCol = tetris.tetromino.column + c;

                if (globalRow >= 0 && globalRow < tetris.PLAYGROUND_ROWS && globalCol >= 0 && globalCol < tetris.PLAYGROUND_COLUMNS) {
                    const index = convertPositionToIndex(globalRow, globalCol);
                    if (cells[index]) {
                        cells[index].classList.add(tetris.tetromino.name);
                    }
                }
            }
        }
    }
}

// Управление кнопками клавиатуры
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        tetris.moveTetrominoLeft();
    } else if (event.key === 'ArrowRight') {
        tetris.moveTetrominoRight();
    } else if (event.key === 'ArrowDown') {
        tetris.moveTetrominoDown();
    } else if (event.key === 'ArrowUp') {
        tetris.rotateTetromino();
    }
    draw(); // Мгновенно перерисовываем поле после действия игрока
});

// Автоматический игровой таймер (каждые 600мс)
setInterval(() => {
    tetris.moveTetrominoDown();
    draw();
}, 600);

// Самый первый вызов отрисовки при старте страницы
draw();