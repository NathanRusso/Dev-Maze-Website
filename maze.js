// The current available width and height of the screen.
var screenWidth = window.screen.availWidth;
var screenHeight = window.screen.availHeight;

// Changes screen variables when screen chnages.
window.addEventListener('resize', function () {
    screenWidth = window.screen.availWidth;
    screenHeight = window.screen.availHeight;
});

/**
 * This gets the available screen width.
 * 
 * @returns available screen width.
 */
function getScreenWidth() { return screenWidth; }

/**
 * This gets the available screen height.
 * 
 * @returns available screen height.
 */
function getScreenHeight() { return screenHeight; }

/**
 * This function finds the maximum number of rows that the maze can have,
 *  given the current window size.
 */
function getMaxRow() { return 40; } // temporary 40

/**
 * This function finds the maximum number of columns that the maze can have,
 *  given the current window size.
 */
function getMaxColumns() { return 40; } // temporary 40

/**
 * This ensures that the row value inside the input is valid.
 * It must be any whole number between 1 and 40.
 * 
 * @param {any} event - The event that triggers the function.
 */
function resetRow(event) {
    var row_input = document.getElementById("row_input").value;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (isNaN(row_input)) {
        document.getElementById("row_input").value = null;
    } else if (charCode > 32 && (charCode < 48 || charCode > 57)) {
        document.getElementById("row_input").value = 1;
    } else if (row_input.length != 0) {
        if (!Number.isInteger(Number(row_input))) {
            row_input = Math.floor(Number(row_input));
            document.getElementById("row_input").value = row_input;
        }
        if (row_input < 1) {
            document.getElementById("row_input").value = 1;
        } else if (row_input > getMaxRow()) {
            document.getElementById("row_input").value = 40;
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
    var col_input = document.getElementById("col_input").value;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (isNaN(col_input)) {
        document.getElementById("col_input").value = null;
    } else if (charCode > 32 && (charCode < 48 || charCode > 57)) {
        document.getElementById("col_input").value = 1;
    } else if (col_input.length != 0) {
        if (!Number.isInteger(Number(col_input))) {
            col_input = Math.floor(Number(col_input));
            document.getElementById("col_input").value = col_input;
        }
        if (col_input < 1) {
            document.getElementById("col_input").value = 1;
        } else if (col_input > getMaxColumns()) {
            document.getElementById("col_input").value = 40;
        }
    }
}
