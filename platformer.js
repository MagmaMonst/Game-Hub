const canvas = document.getElementById("platformer");
const ctx = canvas.getContext("2d");

// Player properties
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    color: "red",
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -10,
    onGround: false,
};

// Platforms
const platforms = [
    { x: 0, y: 350, width: 800, height: 50, color: "green" }, // Ground
    { x: 150, y: 280, width: 100, height: 10, color: "brown" },
    { x: 300, y: 220, width: 120, height: 10, color: "brown" },
    { x: 500, y: 180, width: 100, height: 10, color: "brown" },
];

// Goal
const goal = {
    x: 700,
    y: 140,
    width: 30,
    height: 30,
    color: "gold",
};

// Draw rectangle
function drawRect({ x, y, width, height, color }) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Check collision with a rectangle
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Handle player physics
function updatePlayer() {
    player.dy += player.gravity; // Apply gravity
    player.onGround = false;

    // Horizontal movement
    player.x += player.dx;

    // Check for horizontal collisions with platforms
    platforms.forEach((platform) => {
        if (isColliding(player, platform)) {
            if (player.dx > 0) {
                player.x = platform.x - player.width; // Hit from the left
            } else if (player.dx < 0) {
                player.x = platform.x + platform.width; // Hit from the right
            }
            player.dx = 0; // Stop horizontal movement
        }
    });

    // Vertical movement
    player.y += player.dy;

    // Check for vertical collisions with platforms
    platforms.forEach((platform) => {
        if (isColliding(player, platform)) {
            if (player.dy > 0) {
                // Landing on top of the platform
                player.y = platform.y - player.height;
                player.dy = 0;
                player.onGround = true;
            } else if (player.dy < 0) {
                // Hitting the bottom of the platform
                player.y = platform.y + platform.height;
                player.dy = 0;
            }
        }
    });

    // Prevent falling below the canvas
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    // Prevent going off screen horizontally
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Check if the player reaches the goal
function checkWin() {
    if (isColliding(player, goal)) {
        alert("You Win!");
        resetGame();
    }
}

// Reset the game
function resetGame() {
    player.x = 50;
    player.y = 300;
    player.dx = 0;
    player.dy = 0;
}

// Draw the game elements
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(drawRect);

    // Draw goal
    drawRect(goal);

    // Draw player
    drawRect(player);
}

// Game loop
function gameLoop() {
    updatePlayer();
    checkWin();
    render();
    requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") player.dx = 5;
    if (e.key === "ArrowLeft") player.dx = -5;
    if (e.key === "ArrowUp" && player.onGround) player.dy = player.jumpStrength;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") player.dx = 0;
});

// Start the game loop
gameLoop();
