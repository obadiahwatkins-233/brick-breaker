const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 5;
let ballSpeedY = -5;
const ballRadius = 10;

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 10;

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 100;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];

// Score
let score = 0;

// Initialize bricks
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Draw the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.closePath();
}

// Draw the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

// Draw the bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Check collision with bricks
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('Congratulations! You won!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Update game state and redraw elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();

  // Bounce the ball off walls
  if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballSpeedY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      alert('Game Over!');
      document.location.reload();
    }
  }

  // Move the paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  // Move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Update the score
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 20, 30);

  requestAnimationFrame(draw);
}

// Handle keyboard controls
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') {
    rightPressed = true;
  } else if (event.key === 'ArrowLeft') {
    leftPressed = true;
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowRight') {
    rightPressed = false;
  } else if (event.key === 'ArrowLeft') {
    leftPressed = false;
  }
});

// Start the game when the button is clicked
document.getElementById('startButton').addEventListener('click', function () {
  draw();
});
