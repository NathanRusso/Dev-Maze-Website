// Exports the Maze class to be used in other files
import { Maze } from "/JS/maze.js";


//------------------------------ CONSTANTS BELOW ------------------------------//


// This is the margin of the body element
const bodyMargin = parseInt(window.getComputedStyle(document.body).marginRight, 10);

// This the d-pad that can move the player
const imgDPad = document.getElementById("img_d-pad");

// These are the signs to show where the start and end of the maze are
const imgStart = document.getElementById("img_start");
const imgStop = document.getElementById("img_stop");

// These are the arrow image that will be used to show the player's movement
const imgArrowN = document.getElementById("img_arrow_n");
const imgArrowE = document.getElementById("img_arrow_e");
const imgArrowS = document.getElementById("img_arrow_s");
const imgArrowW = document.getElementById("img_arrow_w");

// These are the objects for the completed maze screen and button
const completedScreen = document.getElementById("completed_screen");
const completedButton = document.getElementById("completed_button");

// These are the elements above the maze, used for measurements
const playTitle = document.getElementById("play_title");
const sizeInput = document.getElementById("size_input");

// This is the form that houses the row and column inputs
const sizeForm = document.getElementById("size_form");

// These are the row and columns input elements
const rowInput = document.getElementById("row_input");
const colInput = document.getElementById("col_input");

// This is the div that holds the d-pad and maze canvas
const mazeDiv = document.getElementById("maze");

// This is the maze's canvas and its context
const mazeCanvas = document.getElementById("maze_canvas");
const context = mazeCanvas.getContext('2d');

// This holds which key presses are allowed for row and column inputs
const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Enter'];

// This holds the allowed movement key strings
const allowedMovement = new Set(["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "W", "w", "A", "a", "S", "s", "D", "d"]);

// This saves the areas on the d-pad the player can click
const upPad = document.getElementById("up_pad");
const downPad = document.getElementById("down_pad");
const leftPad = document.getElementById("left_pad");
const rightPad = document.getElementById("right_pad");

// This sets the minimum maze block size to 20 pixels
const minBlockSize = 20;


//------------------------------ VARIABLES AND ACTIONS BELOW ------------------------------//


// This sets current available width and height of the screen
let screenWidth = document.documentElement.clientWidth - bodyMargin * 2;
let screenHeight = document.documentElement.clientHeight - bodyMargin * 2;
let playTotalMargins = parseInt(window.getComputedStyle(playTitle).margin, 10) * 2;
let screenHeightLimited = screenHeight - playTotalMargins - playTitle.offsetHeight - sizeInput.offsetHeight;

// This sets the maze canvas's and d-pad's dimensions
// This changes the orientation of those elements based on the screen ratio
adjustMaze(mazeCanvas, imgDPad);

// This sets the maximum values the row and column inputs can be
rowInput.max = getMaxRow();
colInput.max = getMaxCol();

// This sets the maze to being not completed
let mazeSolved = false;

/**
 * These values are declared early to handle removing an event listener
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


//------------------------------ EVENT LISTENERS BELOW ------------------------------//


// Anonymous function for keyboard input keys
const keyUpHandler = (event) => { movePlayer(event.key); };

// Anonymous functions for d-pad input 
const clickHandlerUp = () => { movePlayer("ArrowUp"); };
const clickHandlerDown = () => { movePlayer("ArrowDown"); };
const clickHandlerLeft = () => { movePlayer("ArrowLeft"); };
const clickHandlerRight = () => { movePlayer("ArrowRight"); };

// Ensure imageMapResize is called after the page has loaded
window.addEventListener('load', function() { 
    imageMapResize();
});

// Changes variables when screen changes sizes
window.addEventListener('resize', function () {
    // This is here to account for android soft keyboard 
    if ( document.activeElement != rowInput && this.document.activeElement != colInput ) {
        // This resets the variables for the maze to avoid unwanted behavior
        resetMazeVariables();

        // This updates the screen width and height and the upper height
        screenWidth = document.documentElement.clientWidth - bodyMargin * 2;
        screenHeight = document.documentElement.clientHeight - bodyMargin * 2;
        screenHeightLimited = screenHeight - playTotalMargins - playTitle.clientHeight - sizeInput.clientHeight;

        // This updates the maze canvas's and d-pad's dimensions
        // This updates the orientation of those elements based on the screen ratio
        adjustMaze(mazeCanvas, imgDPad);

        // This updates the maximum values for the row and column inputs.
        // It also resets their values
        rowInput.max = getMaxRow();
        colInput.max = getMaxCol();
    }
    
    // This keeps the row and column inputs within the max
    if (Number(rowInput.value) > rowInput.max) {
        rowInput.value = rowInput.max;
    } else if (Number(colInput.value) > colInput.max) {
        colInput.value = colInput.max;
    }
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

    // This resets the variables for the maze to avoid unwanted behavior
    resetMazeVariables();

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

    // This moves the player based on input
    document.addEventListener("keyup", keyUpHandler);
    upPad.addEventListener("click", clickHandlerUp);
    downPad.addEventListener("click", clickHandlerDown);
    leftPad.addEventListener("click", clickHandlerLeft);
    rightPad.addEventListener("click", clickHandlerRight);
});

// This removes the completed message
completedButton.addEventListener('click', function () {
    completedScreen.style.display = 'none';
});


//------------------------------ FUNCTIONS BELOW ------------------------------//


/**
 * This finds the size of the maze canvas width based on the screen width and limiter.
 * The canvas width is a multiple of 20.
 * 
 * @param {*} limiter - Decimal to restrict size for d-pad
 * @param {*} margin - The margin of either the canvas or d-pad
 * @returns the possible width of the maze canvas
 */
function getMaxMazeWidth(limiter, margin) { return Math.floor((screenWidth * limiter - margin) / 20) * 20; }

/**
 * This finds the size of the maze canvas height based on the screen height and limiter.
 * The canvas height is a multiple of 20.
 * 
 * @param {*} limiter - Decimal to restrict size for d-pad
 * @param {*} margin - The margin of either the canvas or d-pad
 * @returns the possible height of the maze canvas
 */
function getMaxMazeHeight(limiter, margin) { return Math.floor((screenHeightLimited * limiter - margin) / 20) * 20; }

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
 * This sets the dimensions of the maze canvas and the d-pad.
 * It also adjust the orientation of those elements.
 * It switches between vertical and horizontal styles.
 * 
 * @param {*} canvas - The canvas for the maze
 * @param {*} dPad - The d-pad to move the player
 */
function adjustMaze(canvas, dPad) {
    if ( screenWidth >= screenHeight ) {
        // This sets the maze canvas's dimensions
        canvas.width = getMaxMazeWidth(0.8, 5);
        canvas.height = getMaxMazeHeight(1.0, 0);

        // This sets the width of the d-pad
        dPad.width = getMaxMazeWidth(0.2, 5);
        dPad.height = getMaxMazeWidth(0.2, 5);

        // This adjust the orientation
        mazeDiv.style.flexDirection = 'row';
        canvas.style.marginRight = '5px';
        dPad.style.marginLeft = '5px';
        canvas.style.marginBottom = '0px';
        dPad.style.marginTop = '0px';
    } else {
        // This sets the maze canvas's dimensions
        canvas.width = getMaxMazeWidth(1.0, 0);
        canvas.height = getMaxMazeHeight(0.7, 5);

        // This sets the width of the d-pad
        dPad.width = getMaxMazeHeight(0.3, 5);
        dPad.height = getMaxMazeHeight(0.3, 5);

        // This adjust the orientation
        mazeDiv.style.flexDirection = 'column';
        canvas.style.marginRight = '0px';
        dPad.style.marginLeft = '0px';
        canvas.style.marginBottom = '5px';
        dPad.style.marginTop = '5px';
    }
}

/**
 * This resets the variables for the maze during submits or resizing.
 * The maze is no longer solves.
 * The movement listeners are removed.
 */
function resetMazeVariables() {
    // This sets the maze being solved to false
    mazeSolved = false;

    // This removes the event listeners to avoid duplicates
    document.removeEventListener("keyup", keyUpHandler);
    upPad.removeEventListener("click", clickHandlerUp);
    downPad.removeEventListener("click", clickHandlerDown);
    leftPad.removeEventListener("click", clickHandlerLeft);
    rightPad.removeEventListener("click", clickHandlerRight);
}

/**
 * This draws the given maze on the canvas.
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
 * This moves the player in the canvas maze.
 * This only happens when the movement key is allowed.
 * 
 * @param {*} key - The event's key when triggered
 */
function movePlayer(key) {
    if ( allowedMovement.has(key)) {
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
        }

        // The player has reached the end of the maze.
        if ( mazeSolved == false && arrowP[0] == end[0] && arrowP[1] == end[1] ) {
            mazeSolved = true;
            completedScreen.style.display = 'block';
        }
    }
}
