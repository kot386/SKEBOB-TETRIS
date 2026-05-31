import { Tetris } from "./tetris.js";
import { convertPositionToIndex } from "./constants.js";

const tetris = new Tetris();
const cells = document.querySelectorAll(".grid>div");

initKeydown();
// Обязательно проверяем, создалась ли фигура перед первым рендером
draw();

function initKeydown() {
    document.addEventListener('keydown', onKeydown);
}

// function onKeydown(event) {
//     // Если фигура исчезла из памяти, кнопки не должны ломать код
//     if (!tetris.tetromino) return; 

// //  .\\   switch (event.key) {
// //         case 'ArrowUp':
// //             rotate();
// //             break;
// //         case 'ArrowDown':
// //             moveDown();
// //             break;
// //         case 'ArrowLeft':
// //             moveLeft();
// //             break;
// //         case 'ArrowRight':
// //             moveRight();
// //             break;
// //     }\\
// }

function moveDown() {
    tetris.moveTetrominoDown();
    draw();
}

function moveLeft() {
    tetris.moveTetrominoLeft();
    draw();
}

function moveRight() {
    tetris.moveTetrominoRight();
    draw();
}

function rotate() {
    tetris.rotateTetromino();
    draw();
}

function draw() {
    if (!cells.length) return; // Защита, если сетка еще не загрузилась
    cells.forEach(cell => cell.removeAttribute("class"));
    drawTetromino();
}

function drawTetromino() {
    // Безопасная проверка: если фигуры нет, просто выходим, а не «роняем» весь скрипт
    if (!tetris.tetromino || !tetris.tetromino.matrix) {
        console.warn("Фигура не найдена в tetris.tetromino");
        return;
    }

    const name = tetris.tetromino.name;
    const matrix = tetris.tetromino.matrix;
    
    // Пробуем прочитать колонку динамически, чтобы не зависеть от опечаток (column или collumn)
    const startColumn = tetris.tetromino.column !== undefined 
        ? tetris.tetromino.column 
        : tetris.tetromino.collumn;

    const startRow = tetris.tetromino.row;

    matrix.forEach((row, rowIndex) => {
        if (!Array.isArray(row)) return; // Защита от сломанной матрицы
        
        row.forEach((column, columnIndex) => {
            if (!column) return; // Если в матрице 0, нічого не малюємо
            
            const realRow = startRow + rowIndex;
            const realColumn = startColumn + columnIndex;
            
            const cellIndex = convertPositionToIndex(realRow, realColumn);
            
            if (cells[cellIndex]) {
                cells[cellIndex].classList.add(name);
            }
        });
    });
}