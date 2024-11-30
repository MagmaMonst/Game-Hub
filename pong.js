const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const player1 = { x: 10, y: canvas.height / 2 - 50, width: 10, height: 100, dy: 0 };
const player2 = { x: canvas.width - 20, y: canvas.height / 2 - 50, width: 10, height: 100, dy: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 4, dy: 4 };

function drawRect(x, y, width, height) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function movePaddle(paddle) {
    paddle.y += paddle.dy;
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y < 0 || ball.y > canvas.height) ball.dy *= -1;

    if (
        (ball.x - ball.radius < player1.x + player1.width && 
         ball.y > player1.y && 
         ball.y < player1.y + player1.height) ||
        (ball.x + ball.radius > player2.x && 
         ball.y > player2.y && 
         ball.y < player2.y + player2.height)
    ) {
        ball.dx *= -1;
    }
}

function update() {
    movePaddle(player1);
    movePaddle(player2);
    moveBall();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRect(player1.x, player1.y, player1.width, player1.height);
    drawRect(player2.x, player2.y, player2.width, player2.height);
    drawBall(ball.x, ball.y, ball.radius);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "w") player1.dy = -5;
    if (e.key === "s") player1.dy = 5;
    if (e.key === "ArrowUp") player2.dy = -5;
    if (e.key === "ArrowDown") player2.dy = 5;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") player1.dy = 0;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") player2.dy = 0;
});

gameLoop();
