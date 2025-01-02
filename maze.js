/**
 * This is a class to create objects for each block in the maze.
 */
class Block {
    /**
     * This creates a new block with the given corrdinates.
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
     * This resets all values besides the corrdinates.
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
 */
class Maze {
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
        this.avaliblePoints = []; // The points that can be used to generate the maze
        for (let y = 0; y < rows; y++) {
            this.maze.push([]);
            for (let x = 0; x < columns; x++) {
                this.maze[i].push(new Block(y, x));
                this.avaliblePoints.push([y, x]);
            }
        }
    }

    generateMaze() {
        // Returns a random integer from 0 to the number of avaliable points - 1
        let firstIndex = Math.floor(Math.random() * this.avaliblePoints.length);

        // This gets the first point to start the maze generation
        let firstPoint = this.avaliblePoints[firstIndex]; console.log(firstPoint);

        // This adds the first point to the maze
        this.maze[firstPoint[0]][firstPoint[1]].inTheMaze = true;

        // This removes the first point from the avalible points.
        this.avaliblePoints.splice(firstIndex, 1);

        // This loops until there are no more avalible points to add to the maze
        while (this.avaliblePoints.length > 0) {
            // This gets a start point for the new path in the maze.
            let startPoint = this.avaliblePoints[Math.floor(Math.random() * this.avaliblePoints.length)];

            // This will hold the points in the maze that will be added in as a new path
            let visitedPoints = [];

            // This creates a new path of points for the maze
            generatePath(startPoint, visitedPoints);


            /*let currentIndex = this.avaliblePoints.length - 1;
            let currentPoint = this.avaliblePoints[currentIndex];
            let neighbors = this.getNeighbors(currentPoint);
            if (neighbors.length > 0) {
                let randomIndex = Math.floor(Math.random() * neighbors.length);
                let randomNeighbor = neighbors[randomIndex];
                this.removeWall(currentPoint, randomNeighbor);
                this.avaliblePoints.splice(currentIndex, 1);
                this.avaliblePoints.push(randomNeighbor);
            } else {
                this.avaliblePoints.splice(currentIndex, 1);
            }*/
        }
    }

    generatePath(start, visited) {

    }

}
