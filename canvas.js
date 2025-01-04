// Exports the Maze class to be used in other files
import { Maze } from "./maze.js";

// The current available width and height of the screen
let screenWidth = Math.min(window.innerWidth, screen.availWidth);
let screenHeight = Math.min(window.innerHeight, screen.availHeight);
console.log(screenWidth);
console.log(screenHeight);

// This saves the total height of the elements above the maze
const playTitle = document.getElementById("play_title");
const sizeInput = document.getElementById("size_input");
let upperHeight = playTitle.clientHeight + sizeInput.clientHeight;
console.log(playTitle.clientHeight);
console.log(sizeInput.clientHeight);
console.log(upperHeight);

// This is the current maze canvas, and sets its dimensions
// The width and height of the maze canvas are multiples of 20
const mazeCanvas = document.getElementById("maze_canvas");
let context = mazeCanvas.getContext('2d');
mazeCanvas.width = getMaxMazeWidth();
mazeCanvas.height = getMaxMazeHeight();
console.log(mazeCanvas.width);
console.log(mazeCanvas.height);

// This declares the objects which will be used to create the maze
let theMaze;

// The minimum pixel size for a block in the maze
let minBlockSize = 20;

// These are the row and columns input elements
// There maximum row and column values are set
const rowInput = document.getElementById("row_input");
const colInput = document.getElementById("col_input");
rowInput.max = getMaxRow();
colInput.max = getMaxCol();

// This is the form that houses the row and column inputs
const sizeForm = document.getElementById("size_form");

// This holds which key presses are allowed for row and column inputs
const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];

// These are the signs to show where the start and end of the maze are.
const imgStart = document.getElementById("img_start");
const imgStop = document.getElementById("img_stop");

// These are the arrow image that will be used to show the player's movement
const imgArrowN = document.getElementById("img_arrow_n");
const imgArrowE = document.getElementById("img_arrow_e");
const imgArrowS = document.getElementById("img_arrow_s");
const imgArrowW = document.getElementById("img_arrow_w");


//------------------------------ EVENT LISTENERS BELOW ------------------------------//


// Changes variables when screen changes sizes
window.addEventListener('resize', function () {
    console.log("WINDOE EVENT");

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

/**
 * This ensures that the row value inside the input is valid.
 * It must be any whole number between 1 and the max.
 */
rowInput.addEventListener('keyup', function resetRow(event) {
    console.log("ROW EVENT");


    let rowValue = rowInput.value;
    if (isNaN(rowValue)) {
        rowInput.value = null;
    } else if (!allowedKeys.includes(event.key)) {
        console.log(rowInput.value);
        rowInput.value = 1;
        console.log(event.key);
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
});

/**
 * This ensures that the col value inside the input is valid.
 * It must be any whole number between 1 and the max.
 */
colInput.addEventListener('keyup', function resetCol(event) {
    console.log("COL EVENT");



    let colValue = colInput.value;
    if (isNaN(colValue)) {
        colInput.value = null;
    } else if (!allowedKeys.includes(event.key)) {
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
});

// This creates and displays a new maze when given new input
sizeForm.addEventListener('submit', function (event) {
    console.log("FORM EVENT");

    // This prevents the form from refreshing the page
    event.preventDefault();

    // This clears the canvas of any previous maze
    context.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    // This saves the row and column values from the input
    let rows = rowInput.value;
    let columns = colInput.value;

    // This creates and generates a new maze with 20 rows and 20 columns 
    theMaze = new Maze(rows, columns);
    theMaze.generateMaze();
    const maze = theMaze.maze;

    // This draws the maze on the canvas
    drawMaze(maze, rows, columns, context);

    // This sets the start and end positions in the canvas maze
    let start = [2, (rows - 1) * minBlockSize + 2];
    let end = [(columns - 1) * minBlockSize + 2, 2];

    // This sets the player's position to the start of the maze
    let arrowE = [0, rows - 1]; // The exact position of the player
    let arrowP = [start[0], start[1]]; // The pixel position of the player

    // This draws the start and end positions on the canvas
    context.drawImage(imgStart, start[0], start[1], 16, 16);
    context.drawImage(imgStop, end[0], end[1], 16, 16);

    // This sets the player's position to the start of the maze
    console.log("ROWS: " + rows);
    console.log("COLS: " + columns);
    context.drawImage(imgArrowN, arrowP[0], arrowP[1], 16, 16);

    // This moves the player based on input
    document.addEventListener("keydown", (event) => {
        // THis clears the arrow and maybe the start or stop sign
        context.clearRect(arrowP[0], arrowP[1], 16, 16);

        // This redraws the start or stop sign if the player is on it
        if ( arrowP[0] == start[0] && arrowP[1] == start[1] ) {
            context.drawImage(imgStart, start[0], start[1], 16, 16);
        } else if ( arrowP[0] == end[0] && arrowP[1] == end[1] ) {
            context.drawImage(imgStop, end[0], end[1], 16, 16);
        }

        // This redraws the player where needed
        switch (event.key) {
            case "ArrowUp":
            case "W":
            case "w":
                if ( arrowE[1] > 0 && maze[arrowE[1]][arrowE[0]].northWall == false 
                    && maze[arrowE[1] - 1][arrowE[0]].southWall == false ) {
                    arrowE[1]--;
                    arrowP[1] -= minBlockSize;
                }
                context.drawImage(imgArrowN, arrowP[0], arrowP[1], 16, 16);
                break;
            case "ArrowRight":
            case "D":
            case "d":
                if ( arrowE[0] < columns - 1 && maze[arrowE[1]][arrowE[0]].eastWall == false
                    && maze[arrowE[1]][arrowE[0] + 1].westWall == false ) {
                    arrowE[0]++;
                    arrowP[0] += minBlockSize;
                }
                context.drawImage(imgArrowE, arrowP[0], arrowP[1], 16, 16);
                break;
            case "ArrowDown":
            case "S":
            case "s":
                if ( arrowE[1] < rows - 1 && maze[arrowE[1]][arrowE[0]].southWall == false
                    && maze[arrowE[1] + 1][arrowE[0]].northWall == false ) {
                    arrowE[1]++;
                    arrowP[1] += minBlockSize;
                }
                context.drawImage(imgArrowS, arrowP[0], arrowP[1], 16, 16);
                break;
            case "ArrowLeft":
            case "A":
            case "a":
                if ( arrowE[0] > 0 && maze[arrowE[1]][arrowE[0]].westWall == false
                    && maze[arrowE[1]][arrowE[0] - 1].eastWall == false ) {
                    arrowE[0]--;
                    arrowP[0] -= minBlockSize;
                }
                context.drawImage(imgArrowW, arrowP[0], arrowP[1], 16, 16);
                break;
        }

        // The player has reached the end of the maze.
        if ( arrowP[0] == end[0] && arrowP[1] == end[1] ) {
            console.log("Congratulations! You have reached the end of the maze!");
        }
    });
});


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
            if (completedMaze[r][c].northWall) {
                ct.moveTo(c * minBlockSize, r * minBlockSize);
                ct.lineTo((c + 1) * minBlockSize, r * minBlockSize);
                ct.stroke();
            }
            if (completedMaze[r][c].eastWall) {
                ct.beginPath();
                ct.moveTo((c + 1) * minBlockSize, r * minBlockSize);
                ct.lineTo((c + 1) * minBlockSize, (r + 1) * minBlockSize);
                ct.stroke()
            }
            if (completedMaze[r][c].southWall) {
                ct.beginPath();
                ct.moveTo((c + 1) * minBlockSize, (r + 1) * minBlockSize);
                ct.lineTo(c * minBlockSize, (r + 1) * minBlockSize);
                ct.stroke();
            }
            if (completedMaze[r][c].westWall) {
                ct.beginPath();
                ct.moveTo(c * minBlockSize, (r + 1) * minBlockSize);
                ct.lineTo(c * minBlockSize, r * minBlockSize);
                ct.stroke();
            }
        }
    }
}
