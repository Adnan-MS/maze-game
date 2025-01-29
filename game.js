// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 40; // Each cell size

// Maze grid (0 = path, 1 = wall)
const maze = [ 
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,0,0,1,1,1,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,1,1,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,0,0,1],
    [1,0,1,0,1,0,0,0,1,1,1,0,1],
    [1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Set canvas dimensions based on maze size
canvas.width = maze[0].length * tileSize;
canvas.height = maze.length * tileSize;

// Function to find a random path point
function findRandomPathPoint() {
    let x, y;
    do {
        x = Math.floor(Math.random() * maze[0].length);
        y = Math.floor(Math.random() * maze.length);
    } while (maze[y][x] !== 0);
    return { x, y };
}

// Randomly select starting and ending points
const startPoint = findRandomPathPoint();
const endPoint = findRandomPathPoint();

// Player object
const player = {
    x: startPoint.x, // Start position
    y: startPoint.y,
    size: tileSize / 2, // Smaller than tile for movement
    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(
            this.x * tileSize + tileSize / 2,
            this.y * tileSize + tileSize / 2,
            this.size / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    },
    move(dx, dy) {
        if (maze[this.y + dy][this.x + dx] === 0) {
            this.x += dx;
            this.y += dy;
        }
    }
};

// Draw the maze
function drawMaze() {
    console.log("Drawing maze..."); // Debugging message
    ctx.lineWidth = 2;

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.strokeStyle = "rgba(0, 255, 0, 1)"; // Bright green lines
                ctx.fillStyle = "rgba(0, 255, 0, 0.8)"; // Fill green with some transparency
                ctx.shadowColor = "rgba(0, 255, 0, 0.8)"; // Glowing green shadow
                ctx.shadowBlur = 10;

                // Fill the wall block
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);

                // Draw the borders inside the filled area
                ctx.beginPath();
                ctx.moveTo(col * tileSize + ctx.lineWidth, row * tileSize + ctx.lineWidth);
                ctx.lineTo((col + 1) * tileSize - ctx.lineWidth, row * tileSize + ctx.lineWidth);
                ctx.lineTo((col + 1) * tileSize - ctx.lineWidth, (row + 1) * tileSize - ctx.lineWidth);
                ctx.lineTo(col * tileSize + ctx.lineWidth, (row + 1) * tileSize - ctx.lineWidth);
                ctx.closePath();
                ctx.stroke();
            } else {
                ctx.fillStyle = "black"; // Dark path
                ctx.shadowBlur = 0; // Remove shadow effect
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw the ending point
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(
        endPoint.x * tileSize + tileSize / 2,
        endPoint.y * tileSize + tileSize / 2,
        tileSize / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") player.move(0, -1);
    if (event.key === "ArrowDown") player.move(0, 1);
    if (event.key === "ArrowLeft") player.move(-1, 0);
    if (event.key === "ArrowRight") player.move(1, 0);
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    player.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
