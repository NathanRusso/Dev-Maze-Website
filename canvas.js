// Exports the Maze class to be used in other files
import { Maze } from "./maze.js";

// The current available width and height of the screen
let screenWidth = Math.min(window.innerWidth, screen.availWidth);
let screenHeight = Math.min(window.innerHeight, screen.availHeight);

// This saves the total height of the elements above the maze
const playTitle = document.getElementById("play_title");
const sizeInput = document.getElementById("size_input");
let upperHeight = playTitle.clientHeight + sizeInput.clientHeight;

// This is the current maze canvas, and sets its dimensions
// The width and height of the maze canvas are multiples of 20
const mazeCanvas = document.getElementById("maze_canvas");
const context = mazeCanvas.getContext('2d');
mazeCanvas.width = getMaxMazeWidth();
mazeCanvas.height = getMaxMazeHeight();

console.log(screenWidth);
console.log(screenHeight);
console.log(playTitle.clientHeight);
console.log(sizeInput.clientHeight);
console.log(upperHeight);
console.log(mazeCanvas.width);
console.log(mazeCanvas.height);

// This sets the mimumum block size
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
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Enter'];

let mazeSolved = false;

// These are the signs to show where the start and end of the maze are.
const imgStart = document.getElementById("img_start");
const imgStop = document.getElementById("img_stop");

// These are the arrow image that will be used to show the player's movement
const imgArrowN = document.getElementById("img_arrow_n");
const imgArrowE = document.getElementById("img_arrow_e");
const imgArrowS = document.getElementById("img_arrow_s");
const imgArrowW = document.getElementById("img_arrow_w");

// This is the fireworks GIF for when the player finishes the maze
const gifFireworks = document.getElementById("gif_fireworks");
gifFireworks.width = screenWidth;
gifFireworks.height = screenHeight;

/**
 * These values are declares early to handle removing an event listenener
 * maze - This will hold the 2d array for the maze
 * rows - This will hold the number of rows in the maze
 * columns - This will hold the number of columns in the maze.
 * start - This will hold the start coordinates in pixels
 * end - This will hold the stop coordinates in pixels
 * arrowE - This will hold the player's coordinates in exact indexes
 * arrowP - This will hold the player's coordinates in pixels
 * blockSize - This will hold the maze's block size
 * imageSize - Ths will hold the size of the images in the maze
 */
let maze, rows, columns, start, end, arrowE, arrowP, blockSize, imageSize;

// These are the objects for the completed message and button
const completedMessage = document.getElementById("completed_message");
const messageButton = document.getElementById("button_message");


//------------------------------ EVENT LISTENERS BELOW ------------------------------//


// Store the anonymous function in a variable
const keyUpHandler = (event) => {
    movePlayer(event.key);
};

// Changes variables when screen changes sizes
window.addEventListener('resize', function () {
    // This updates the screen width and height and the upper height
    screenWidth = Math.min(window.innerWidth, screen.availWidth);
    screenHeight = Math.min(window.innerHeight, screen.availHeight);
    upperHeight = playTitle.clientHeight + sizeInput.clientHeight;

    // This updates the maze canvas width and height, its maximum row and column values, and more
    mazeCanvas.width = getMaxMazeWidth();
    mazeCanvas.height = getMaxMazeHeight();
    rowInput.max = getMaxRow();
    colInput.max = getMaxCol();
    rowInput.value = 1;
    colInput.value = 1;

    // This streches the GIF to the entire screen
    gifFireworks.width = screenWidth;
    gifFireworks.height = screenHeight;
});

/**
 * This ensures that the row value inside the input is valid.
 * It must be any whole number between 1 and the max.
 */
rowInput.addEventListener('keyup', function resetRow(event) {
    let rowValue = rowInput.value;
    if (isNaN(rowValue)) {
        rowInput.value = 1;
    } else if (!allowedKeys.includes(event.key)) {
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
});

/**
 * This ensures that the col value inside the input is valid.
 * It must be any whole number between 1 and the max.
 */
colInput.addEventListener('keyup', function resetCol(event) {
    let colValue = colInput.value;
    if (isNaN(colValue)) {
        colInput.value = 1;
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
    // This prevents the form from refreshing the page
    event.preventDefault();

    // This sets the maze being solved to false
    mazeSolved = false;

    // This clears the canvas of any previous maze
    context.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    // This unselects the row and column inputs.
    rowInput.blur();
    colInput.blur();

    // This saves the row and column values from the input
    rows = rowInput.value;
    columns = colInput.value;

    // This creates and generates a new maze with 20 rows and 20 columns 
    const theMaze = new Maze(rows, columns);
    theMaze.generateMaze();
    maze = theMaze.maze;

    // This calculates the size of the blocks in the maze
    blockSize = Math.floor(Math.min(mazeCanvas.height / rows, mazeCanvas.width / columns) / 2) * 2;
    if ( blockSize < 20 ) { blockSize = minBlockSize; }
    imageSize = Math.floor(blockSize * 0.8);
    let imageBuffer = Math.floor((blockSize - imageSize) / 2);

    // This sets a buffer to center the maze horizontally
    const widthBuffer = (mazeCanvas.width - columns * blockSize) / 2;

    // This draws the maze on the canvas
    drawMaze(maze, rows, columns, context, blockSize, widthBuffer);

    // This sets the start and end positions in the canvas maze
    start = [imageBuffer + widthBuffer, (rows - 1) * blockSize + imageBuffer];
    end = [(columns - 1) * blockSize + imageBuffer + widthBuffer, imageBuffer];

    // This sets the player's position to the start of the maze
    arrowE = [0, rows - 1]; // The exact position of the player
    arrowP = [start[0], start[1]]; // The pixel position of the player

    // This draws the start and end positions on the canvas
    context.drawImage(imgStop, end[0], end[1], imageSize, imageSize);
    context.drawImage(imgStart, start[0], start[1], imageSize, imageSize);

    // This sets the player's position to the start of the maze
    context.drawImage(imgArrowN, arrowP[0], arrowP[1], imageSize, imageSize);

    // This removes the event listener to avoid duplicates
    document.removeEventListener("keyup", keyUpHandler);

    // This moves the player based on input
    document.addEventListener("keyup", keyUpHandler);
});

// This removes the completed message
messageButton.addEventListener('click', function () {
    completedMessage.style.display = 'none';
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
 * @param {*} blockSize - The size of each block in the maze.
 */
function drawMaze(completedMaze, rows, columns, ct, blockSize, widthBuffer) {
    for ( let r = 0; r < rows; r++ ) {
        for ( let c = 0; c < columns; c++ ) {
            ct.beginPath();
            if (completedMaze[r][c].northWall) {
                ct.moveTo(c * blockSize + widthBuffer, r * blockSize);
                ct.lineTo((c + 1) * blockSize + widthBuffer, r * blockSize);
                ct.stroke();
            }
            if (completedMaze[r][c].eastWall) {
                ct.beginPath();
                ct.moveTo((c + 1) * blockSize + widthBuffer, r * blockSize);
                ct.lineTo((c + 1) * blockSize + widthBuffer, (r + 1) * blockSize);
                ct.stroke()
            }
            if (completedMaze[r][c].southWall) {
                ct.beginPath();
                ct.moveTo((c + 1) * blockSize + widthBuffer, (r + 1) * blockSize);
                ct.lineTo(c * blockSize + widthBuffer, (r + 1) * blockSize);
                ct.stroke();
            }
            if (completedMaze[r][c].westWall) {
                ct.beginPath();
                ct.moveTo(c * blockSize + widthBuffer, (r + 1) * blockSize);
                ct.lineTo(c * blockSize + widthBuffer, r * blockSize);
                ct.stroke();
            }
        }
    }
}

/**
 * This moves the player in the cnavas maze.
 * 
 * @param {*} key - The event's key when triggered
 */
function movePlayer(key) {
    // This clears the arrow and maybe the start or stop sign
    context.clearRect(arrowP[0], arrowP[1], imageSize, imageSize);

    // This redraws the start or stop sign if the player is on it
    if ( arrowP[0] == end[0] && arrowP[1] == end[1] ) {
        context.drawImage(imgStop, end[0], end[1], imageSize, imageSize);
    } else if ( arrowP[0] == start[0] && arrowP[1] == start[1] ) {
        context.drawImage(imgStart, start[0], start[1], imageSize, imageSize);
    }

    // This redraws the player where needed
    switch (key) {
        case "ArrowUp":
        case "W":
        case "w":
            if ( arrowE[1] > 0 && maze[arrowE[1]][arrowE[0]].northWall == false 
                && maze[arrowE[1] - 1][arrowE[0]].southWall == false ) {
                arrowE[1]--;
                arrowP[1] -= blockSize;
            }
            context.drawImage(imgArrowN, arrowP[0], arrowP[1], imageSize, imageSize);
            break;
        case "ArrowRight":
        case "D":
        case "d":
            if ( arrowE[0] < columns - 1 && maze[arrowE[1]][arrowE[0]].eastWall == false
                && maze[arrowE[1]][arrowE[0] + 1].westWall == false ) {
                arrowE[0]++;
                arrowP[0] += blockSize;
            }
            context.drawImage(imgArrowE, arrowP[0], arrowP[1], imageSize, imageSize);
            break;
        case "ArrowDown":
        case "S":
        case "s":
            if ( arrowE[1] < rows - 1 && maze[arrowE[1]][arrowE[0]].southWall == false
                && maze[arrowE[1] + 1][arrowE[0]].northWall == false ) {
                arrowE[1]++;
                arrowP[1] += blockSize;
            }
            context.drawImage(imgArrowS, arrowP[0], arrowP[1], imageSize, imageSize);
            break;
        case "ArrowLeft":
        case "A":
        case "a":
            if ( arrowE[0] > 0 && maze[arrowE[1]][arrowE[0]].westWall == false
                && maze[arrowE[1]][arrowE[0] - 1].eastWall == false ) {
                arrowE[0]--;
                arrowP[0] -= blockSize;
            }
            context.drawImage(imgArrowW, arrowP[0], arrowP[1], imageSize, imageSize);
            break;
        default:
            context.drawImage(imgArrowN, arrowP[0], arrowP[1], imageSize, imageSize);
    }

    // The player has reached the end of the maze.
    if ( mazeSolved == false && arrowP[0] == end[0] && arrowP[1] == end[1] ) {
        mazeSolved = true;
        completedMessage.style.display = 'block';
    }
}
