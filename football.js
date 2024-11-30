const canvas = document.getElementById("footballGame");
const ctx = canvas.getContext("2d");

// Game Objects
const player1 = { x: 100, y: 200, width: 20, height: 20, color: "blue", dx: 0, dy: 0 };
const player2 = { x: 700, y: 200, width: 20, height: 20, color: "red", dx: 0, dy: 0 };
const ball = { x: 400, y: 200, radius: 10, color: "white", dx: 3, dy: 3 };

// Goals
const goal1 = { x: 0, y: 150, width: 20, height: 100, color: "yellow" };
const goal2 = { x: 780, y: 150, width: 20, height: 100, color: "yellow" };

// Scores
let score1 = 0;
let score2 = 0;

// Draw rectangle
function drawRect({ x, y, width, height, color }) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw circle
function drawCircle({ x, y, radius, color }) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// Update player positions
function updatePlayer(player) {
    player.x += player.dx;
    player.y += player.dy;

    // Prevent players from going out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Update ball position and collisions
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }

    // Ball collision with players
    [player1, player2].forEach((player) => {
        if (
            ball.x + ball.radius > player.x &&
            ball.x - ball.radius < player.x + player.width &&
            ball.y + ball.radius > player.y &&
            ball.y - ball.radius < player.y + player.height
        ) {
            ball.dx *= -1; // Reverse ball's horizontal direction
        }
    });

    // Ball collision with goals
    if (ball.x - ball.radius < goal1.x + goal1.width && ball.y > goal1.y && ball.y < goal1.y + goal1.height) {
        score2++; // Player 2 scores
        resetBall();
    } else if (ball.x + ball.radius > goal2.x && ball.y > goal2.y && ball.y < goal2.y + goal2.height) {
        score1++; // Player 1 scores
        resetBall();
    }

    // Ball collision with canvas edges
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
}

// Reset ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1; // Reverse direction to make gameplay dynamic
}

// Draw everything
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw goals
    drawRect(goal1);
    drawRect(goal2);

    // Draw players
    drawRect(player1);
    drawRect(player2);

    // Draw ball
    drawCircle(ball);

    // Draw scores
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Player 1: ${score1}`, 50, 30);
    ctx.fillText(`Player 2: ${score2}`, canvas.width - 150, 30);
}

// Game loop
function gameLoop() {
    updatePlayer(player1);
    updatePlayer(player2);
    updateBall();
    render();
    requestAnimationFrame(gameLoop);
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
    // Player 1 controls (WASD)
    if (e.key === "w") player1.dy = -4;
    if (e.key === "s") player1.dy = 4;
    if (e.key === "a") player1.dx = -4;
    if (e.key === "d") player1.dx = 4;

    // Player 2 controls (Arrow Keys)
    if (e.key === "ArrowUp") player2.dy = -4;
    if (e.key === "ArrowDown") player2.dy = 4;
    if (e.key === "ArrowLeft") player2.dx = -4;
    if (e.key === "ArrowRight") player2.dx = 4;
});

document.addEventListener("keyup", (e) => {
    // Stop player 1 movement
    if (["w", "s"].includes(e.key)) player1.dy = 0;
    if (["a", "d"].includes(e.key)) player1.dx = 0;

    // Stop player 2 movement
    if (["ArrowUp", "ArrowDown"].includes(e.key)) player2.dy = 0;
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) player2.dx = 0;
});

// Start the game loop
gameLoop();
