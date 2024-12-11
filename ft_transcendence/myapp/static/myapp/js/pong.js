document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const canvas = document.getElementById('pongCanvas');
    const context = canvas.getContext('2d');

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 3;
    const ballRadius = 10;

    let isGameRunning = false;

    // Función para dibujar la pelota
    function drawBall() {
        context.beginPath();
        context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        context.fillStyle = '#00d9ff';
        context.fill();
        context.closePath();
    }

    // Función principal para actualizar el juego
    function updateGame() {
        if (!isGameRunning) return;

        context.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

        drawBall();

        // Movimiento de la pelota
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Rebote en los bordes
        if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
            ballSpeedX = -ballSpeedX;
        }

        if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        requestAnimationFrame(updateGame);
    }

    // Iniciar el juego
    startButton.addEventListener('click', function () {
        canvas.style.display = 'block'; // Mostrar el canvas
        isGameRunning = true;
        updateGame();
    });
});
