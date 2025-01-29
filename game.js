// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 40; // Each cell size

const rows = 10;
const cols = 13;
const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

function generateMaze(x, y) {
    maze[y][x] = 0; // Mark as visited

    const directions = [
        { dx: 1, dy: 0 },  // right
        { dx: -1, dy: 0 }, // left
        { dx: 0, dy: 1 },  // down
        { dx: 0, dy: -1 }  // up
    ];

    shuffleArray(directions);

    directions.forEach(({ dx, dy }) => {
        const nx = x + 2 * dx;
        const ny = y + 2 * dy;

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 1) {
            maze[ny][nx] = 0; // Connect cells
            maze[y + dy][x + dx] = 0;
            generateMaze(nx, ny);
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

maze[0][0] = 0; // Starting point
generateMaze(0, 0);

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
