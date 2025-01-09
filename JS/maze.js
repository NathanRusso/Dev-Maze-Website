/**
 * This is a class to create objects for each block in the maze.
 */
class Block {
    /**
     * This creates a new block with the given coordinates.
     * 
     * @param {Number} xIndex - The x coordinate in the maze
     * @param {Number} yIndex - The y coordinates in the maze
     */
    constructor(yIndex, xIndex) {
        this.northWall = true;
        this.eastWall = true;
        this.southWall = true;
        this.westWall = true;
        this.visited = false;
        this.inTheMaze = false;
        this.y = yIndex; // Row
        this.x = xIndex; // Column
    }

    /**
     * This resets all values besides the coordinates.
     */
    reset() {
        this.northWall = true;
        this.eastWall = true;
        this.southWall = true;
        this.westWall = true;
        this.visited = false;
        this.inTheMaze = false;
    }
}

/**
 * This is a class to hold the a maze to play.
 * Exports the Maze class to be used in other files //////////////////////////////////////////
 */
export class Maze {
    // Private variables
    #availablePoints = []; // The points that can be used to generate the maze
    #directions = ["N", "E", "S", "W"]; // The 4 directions that can be taken

    /**
     * This creates a new maze with the given number of rows and columns.
     * 
     * @param {Number} rows - The number of rows in the maze
     * @param {Number} columns - The number of columns in the maze
     */
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.maze = []; // The 2d array of blocks that make up the maze
        for (let y = 0; y < rows; y++) {
            this.maze.push([]);
            for (let x = 0; x < columns; x++) {
                this.maze[y].push(new Block(y, x));
                this.#availablePoints.push([y, x]);
            }
        }
    }

    /**
     * This finds the index of a given point in a 2d array.
     * -1 means it does not exist in the array.
     * 
     * @param {any} array - the 2d array to search through
     * @param {any} point - the point to find in the array
     * @returns the points index
     */
    #indexIn2dArray(array, point) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] == point[0] && array[i][1] == point[1]) {
                return i;
            }
        }
        return -1;
    }

    /**
     * This gets the block at the given point in the maze.
     * 
     * @param {Array} point - the point to get the block from
     * @returns the block in the maze
     */
    #getBlockAt(point) { return this.maze[point[0]][point[1]]; }

    /**
     * This sets the point's block to in the maze.
     * It then removes the point from the available points.
     * 
     * @param {Array} point - The point to remove 
     */
    #addBlockRemovePoint(point) {
        this.#getBlockAt(point).visited = false;
        this.#getBlockAt(point).inTheMaze = true;
        let index = this.#indexIn2dArray(this.#availablePoints, point);
        this.#availablePoints.splice(index, 1);
    }

    /**
     * This generates a random direction string for the maze path to go
     * 
     * @returns a direction string ~ N, E, S, W
     */
    #generateRandomDirection() { return this.#directions[Math.floor(Math.random() * 4)]; }

    /**
     * This removes a loop in the visited points.
     * The unnecessary points are removed and the blocks are reset.
     * 
     * @param {Array} next - the [y, x] coordinate of the next point
     * @param {Array} visited - the array of visited points
     */
    #removeLoop(next, visited) {
        // This saves the initial length of visited
        let length = visited.length;

        // This saves the index of the point after the duplicate
        let after = this.#indexIn2dArray(visited, next) + 1;

        // This resets all blocks after the duplicate
        for (let i = after; i < visited.length; i++) {
            this.#getBlockAt(visited[i]).reset();
        }

        // This removes the loop from the path
        visited.splice(after, length - after);
    }

    /**
     * This creates a new path in the maze starting at the given point.
     * 
     * @param {Array} start - the [y, x] coordinate of the start point
     * @param {Array} visited - the array of visited points
     */
    #generatePath(start, visited) {
        // This saves the current point and block and creates a next point
        let current = start;
        let currentBlock = this.#getBlockAt(current);
        let next;

        // This loops until the current block is in the maze, the path is complete
        while (currentBlock.inTheMaze == false) {
            // This generates a random direction for the path to go
            let direction = this.#generateRandomDirection();

            // This move the maze path in the direction if possible
            if (direction == "N" && current[0] != 0) {
                // This gets the next point and block in the maze
                next = [current[0] - 1, current[1]];
                let nextBlock = this.#getBlockAt(next);

                // This decides what to do with the next block
                if (nextBlock.visited == true) {
                    // A loop in the path need to be removed
                    this.#removeLoop(next, visited);
                } else {
                    // This opens the blocks' walls so the path can go through
                    currentBlock.northWall = false;
                    nextBlock.southWall = false;

                    if (nextBlock.inTheMaze == false) {
                        // This saves the next blocks as visited
                        nextBlock.visited = true;
                        visited.push(next);
                    }
                }

                // This moves the path onto the next point
                current = next;
                currentBlock = this.#getBlockAt(current);
            } else if (direction == "E" && current[1] != this.columns - 1) {
                // This gets the next point and block in the maze
                next = [current[0], current[1] + 1];
                let nextBlock = this.#getBlockAt(next);

                // This decides what to do with the next block
                if (nextBlock.visited == true) {
                    // A loop in the path need to be removed
                    this.#removeLoop(next, visited);
                } else {
                    // This opens the blocks' walls so the path can go through
                    currentBlock.eastWall = false;
                    nextBlock.westWall = false;

                    if (nextBlock.inTheMaze == false) {
                        // This saves the next blocks as visited
                        nextBlock.visited = true;
                        visited.push(next);
                    }
                }

                // This moves the path onto the next point
                current = next;
                currentBlock = this.#getBlockAt(current);

            } else if (direction == "S" && current[0] != this.rows - 1) {
                // This gets the next point and block in the maze
                next = [current[0] + 1, current[1]];
                let nextBlock = this.#getBlockAt(next);

                // This decides what to do with the next block
                if (nextBlock.visited == true) {
                    // A loop in the path need to be removed
                    this.#removeLoop(next, visited);
                } else {
                    // This opens the blocks' walls so the path can go through
                    currentBlock.southWall = false;
                    nextBlock.northWall = false;

                    if (nextBlock.inTheMaze == false) {
                        // This saves the next blocks as visited
                        nextBlock.visited = true;
                        visited.push(next);
                    }
                }

                // This moves the path onto the next point
                current = next;
                currentBlock = this.#getBlockAt(current);

            } else if (direction == "W" && current[1] != 0) {
                // This gets the next point and block in the maze
                next = [current[0], current[1] - 1];
                let nextBlock = this.#getBlockAt(next);

                // This decides what to do with the next block
                if (nextBlock.visited == true) {
                    // A loop in the path need to be removed
                    this.#removeLoop(next, visited);
                } else {
                    // This opens the blocks' walls so the path can go through
                    currentBlock.westWall = false;
                    nextBlock.eastWall = false;

                    if (nextBlock.inTheMaze == false) {
                        // This saves the next blocks as visited
                        nextBlock.visited = true;
                        visited.push(next);
                    }
                }

                // This moves the path onto the next point
                current = next;
                currentBlock = this.#getBlockAt(current);
            }
        }
    }

    /**
     * This generates the maze using a variation of Wilson's Maze Algorithm.
     */
    generateMaze() {
        // Returns a random integer from 0 to the number of available points - 1
        let firstIndex = Math.floor(Math.random() * this.#availablePoints.length);

        // This gets the first point to start the maze generation
        let firstPoint = this.#availablePoints[firstIndex];

        // This adds the first block to the maze
        this.#getBlockAt(firstPoint).inTheMaze = true;

        // This removes the first point from the available points.
        this.#availablePoints.splice(firstIndex, 1);

        // This loops until there are no more available points to add to the maze
        while (this.#availablePoints.length > 0) {
            // This gets a start point for the new path in the maze.
            let startPoint = this.#availablePoints[Math.floor(Math.random() * this.#availablePoints.length)];

            // This will hold the points in the maze that will be added in as a new path
            const visitedPoints = [startPoint];

            // This marks the start point as visited
            this.#getBlockAt(startPoint).visited = true;

            // This creates a new path of points for the maze
            this.#generatePath(startPoint, visitedPoints);

            // This adds all of the visited points to the maze
            // It then removes the points from the available points
            let length = visitedPoints.length;

            for (let i = 0; i < length; i++) {
                this.#addBlockRemovePoint(visitedPoints[i]);
            }
        }
    }
}
