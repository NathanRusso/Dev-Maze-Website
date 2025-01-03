// Exports the Maze class to be used in other files
import { Maze } from "./maze.js";

// The current available width and height of the screen
let screenWidth = Math.min(window.innerWidth, screen.availWidth);
let screenHeight = Math.min(window.innerHeight, screen.availHeight);
console.log(screenWidth);
console.log(screenHeight);

// This saves the total height of the elements above the maze
let playTitle = document.getElementById("play_title");
let sizeInput = document.getElementById("size_input");
let upperHeight = playTitle.clientHeight + sizeInput.clientHeight;
console.log(playTitle.clientHeight);
console.log(sizeInput.clientHeight);
console.log(upperHeight);

// The minimum pixel size for a block in the maze
let minBlockSize = 20;

// This is the current maze canvas, and sets its dimensions
// The width and height of the maze canvas are multiples of 20
let mazeCanvas = document.getElementById("maze_canvas");
mazeCanvas.width = getMaxMazeWidth();
mazeCanvas.height = getMaxMazeHeight();
console.log(mazeCanvas.width);
console.log(mazeCanvas.height);

// These are the row and columns input elements
// There maximum row and column values are set
let rowInput = document.getElementById("row_input");
let colInput = document.getElementById("col_input");
rowInput.max = getMaxRow();
colInput.max = getMaxCol();

// Changes variables when screen changes sizes
window.addEventListener('resize', function () {
    // This updates the screen width and height and the upper height
    screenWidth = Math.min(window.innerWidth, screen.availWidth);
    screenHeight = Math.min(window.innerHeight, screen.availHeight);
    upperHeight = playTitle.clientHeight + sizeInput.clientHeight;

    // This updates the maze canvas width and height and its maximum row and column values
    mazeCanvas.width = getMaxMazeWidth();
    mazeCanvas.height = getMaxMazeHeight();
    rowInput.max = getMaxRow();
    colInput.max = getMaxCol();
    rowInput.value = null;
    colInput.value = null;
});


// This creates and generates a new maze with 20 rows and 20 columns 
const theMaze = new Maze(getMaxRow(), getMaxCol());
theMaze.generateMaze();

// This draws the maze on the canvas
let context = mazeCanvas.getContext('2d');
drawMaze(theMaze.maze, theMaze.rows, theMaze.columns, context);


//------------------------------ FUNCTIONS BELOW ------------------------------//


/**
 * This finds the size of the maze canvas width based on the screen width.
 * The canvas width is a multiple of 20.
 * 
 * @returns the possible width of the maze canvas
 */
function getMaxMazeWidth() { return Math.floor(screenWidth * 0.045) * 20; }

/**
 * This finds the size of the maze canvas height based on the screen height.
 * The canvas height is a multiple of 20.
 * 
 * @returns the possible height of the maze canvas
 */
function getMaxMazeHeight() { return Math.floor((screenHeight - upperHeight) * 0.045) * 20; }

/**
 * This function finds the maximum number of rows that the maze can have,
 *  given the current window size.
 */
function getMaxRow() { return mazeCanvas.height / minBlockSize; }

/**
 * This function finds the maximum number of columns that the maze can have,
 *  given the current window size.
 */
function getMaxCol() { return mazeCanvas.width / minBlockSize; }

/**
 * This ensures that the row value inside the input is valid.
 * It must be any whole number between 1 and 40.
 * 
 * @param {any} event - The event that triggers the function.
 */
function resetRow(event) {
    let rowValue = rowInput.value;
    let charCode = (event.which) ? event.which : event.keyCode;
    if (isNaN(rowValue)) {
        rowInput.value = null;
    } else if (charCode > 32 && charCode != 38 && charCode != 40 && (charCode < 48 || charCode > 57)) {
        rowInput.value = 1;
    } else if (rowValue.length != 0) {
        rowValue = Number(rowValue);
        if (!Number.isInteger(rowValue)) {
            rowValue = Math.floor(rowValue);
            rowInput.value = rowValue;
        }
        if (rowValue < 1) {
            rowInput.value = 1;
        } else if (rowValue > Number(rowInput.max)) {
            rowInput.value = Number(rowInput.max);
        }
    }
}

/**
 * This ensures that the col value inside the input is valid.
 * It must be any whole number between 1 and 40.
 * 
 * @param {any} event - The event that triggers the function.
 */
function resetCol(event) {
    let colValue = colInput.value;
    let charCode = (event.which) ? event.which : event.keyCode;
    if (isNaN(colValue)) {
        colInput.value = null;
    } else if (charCode > 32 && charCode != 38 && charCode != 40 && (charCode < 48 || charCode > 57)) {
        colInput.value = 1;
    } else if (colValue.length != 0) {
        colValue = Number(colValue);
        if (!Number.isInteger(colValue)) {
            colValue = Math.floor(colValue);
            colInput.value = colValue;
        }
        if (colValue < 1) {
            colInput.value = 1;
        } else if (colValue > Number(colInput.max)) {
            colInput.value = Number(colInput.max);
        }
    }
}

/**
 * This draws the givren maze on the canvas.
 * 
 * @param {*} completedMaze - The 2d array of blocks that make up the maze.
 * @param {*} rows - The number of rows in the maze.
 * @param {*} columns - The number of columns in the maze.
 * @param {*} ct - The context of the canvas.
 */
function drawMaze(completedMaze, rows, columns, ct) {
    for ( let r = 0; r < rows; r++ ) {
        for ( let c = 0; c < columns; c++ ) {
            ct.beginPath();
            if (completedMaze[r][c].northWall == true) {
                ct.moveTo(c * minBlockSize, r * minBlockSize);
                ct.lineTo((c + 1) * minBlockSize, r * minBlockSize);
                ct.stroke();
            }
            if (completedMaze[r][c].eastWall == true) {
                ct.beginPath();
                ct.moveTo((c + 1) * minBlockSize, r * minBlockSize);
                ct.lineTo((c + 1) * minBlockSize, (r + 1) * minBlockSize);
                ct.stroke()
            }
            if (completedMaze[r][c].southWall == true) {
                ct.beginPath();
                ct.moveTo((c + 1) * minBlockSize, (r + 1) * minBlockSize);
                ct.lineTo(c * minBlockSize, (r + 1) * minBlockSize);
                ct.stroke();
            }
            if (completedMaze[r][c].westwall == true) {
                ct.beginPath();
                ct.moveTo(c * minBlockSize, (r + 1) * minBlockSize);
                ct.lineTo(c * minBlockSize, r * minBlockSize);
                ct.stroke();
            }
        }
    }
}