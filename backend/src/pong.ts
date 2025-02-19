// // Variables globales
// let canvas, ctx, paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
// let player1Y = 150, player2Y = 150, ballX = 400, ballY = 200, ballSpeedX = 10, ballSpeedY = 6;
// let player1Score = 0, player2Score = 0;
// let gameStarted = false; // Variable para saber si el juego ha comenzado

// // Función para iniciar el juego
// function startGame() {
//     gameStarted = true;
//     canvas = document.getElementById("pongCanvas");
//     ctx = canvas.getContext("2d");
//     document.getElementById("start-button").style.display = 'none'; // Esconde el botón de iniciar
//     document.getElementById("scoreboard").style.display = 'block'; // Muestra el marcador
//     canvas.style.display = 'block'; // Muestra el canvas para el juego
//     runGame(); // Comienza el ciclo del juego
// }

// // Función principal que maneja la lógica del juego
// function runGame() {
//     if (!gameStarted) return; // No hacer nada si el juego no ha empezado

//     drawEverything();
//     moveBall();
//     movePaddles();
//     checkCollision();
//     updateScore();

//     if (player1Score === 5 || player2Score === 5) {
//         showWinner();
//         return; // Detiene el juego cuando alguien gana
//     }

//     requestAnimationFrame(runGame); // Vuelve a ejecutar la función en el siguiente frame
// }

// // Dibuja todo en el canvas
// function drawEverything() {
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, canvas.width, canvas.height); // Fondo del juego

//     ctx.fillStyle = "#00d9ff";
//     ctx.fillRect(0, player1Y, paddleWidth, paddleHeight); // Paleta del jugador 1
//     ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight); // Paleta del jugador 2

//     ctx.beginPath();
//     ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false); // Dibuja la pelota
//     ctx.fillStyle = "#00d9ff";
//     ctx.fill();
// }

// // Mueve la pelota
// function moveBall() {
//     ballX += ballSpeedX;
//     ballY += ballSpeedY;

//     if (ballY < 0 || ballY > canvas.height) {
//         ballSpeedY = -ballSpeedY; // Rebota la pelota en la parte superior e inferior
//     }

//     if (ballX < 0 || ballX > canvas.width) {
//         ballSpeedX = -ballSpeedX; // Rebota la pelota en la parte izquierda y derecha
//     }
// }

// // Mueve las paletas con el teclado
// function movePaddles() {
//     if (wKeyPressed && player1Y > 0) player1Y -= 10;
//     if (sKeyPressed && player1Y < canvas.height - paddleHeight) player1Y += 10;
//     if (upKeyPressed && player2Y > 0) player2Y -= 10;
//     if (downKeyPressed && player2Y < canvas.height - paddleHeight) player2Y += 10;
// }

// // Detecta colisiones de la pelota con las palas
// function checkCollision() {
//     if (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
//         ballSpeedX = -ballSpeedX; // Colisión con la pala izquierda
//     }

//     if (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
//         ballSpeedX = -ballSpeedX; // Colisión con la pala derecha
//     }
// }

// // Actualiza el marcador
// function updateScore() {
//     if (ballX < 0) {
//         player2Score++;
//         resetBall();
//     }

//     if (ballX > canvas.width) {
//         player1Score++;
//         resetBall();
//     }

//     document.getElementById("player1-score").textContent = player1Score;
//     document.getElementById("player2-score").textContent = player2Score;
// }

// // Reinicia la pelota cuando sale de los límites
// function resetBall() {
//     ballX = canvas.width / 2;
//     ballY = canvas.height / 2;
//     ballSpeedX = -ballSpeedX;
//     ballSpeedY = 3;
// }

// // Función que muestra el mensaje de ganador
// function showWinner() {
//     const winner = player1Score === 5 ? "Jugador 1" : "Jugador 2";
//     const winnerMessage = document.createElement('div');
//     winnerMessage.id = "winner-message";
//     winnerMessage.style.position = "absolute";
//     winnerMessage.style.top = "50%";
//     winnerMessage.style.left = "50%";
//     winnerMessage.style.transform = "translate(-50%, -50%)";
//     winnerMessage.style.fontSize = "2em";
//     winnerMessage.style.color = "#00d9ff";
//     winnerMessage.style.textAlign = "center";
//     winnerMessage.style.backgroundColor = "#000000"; // Fondo negro para el mensaje
//     winnerMessage.style.padding = "20px"; // Relleno para separar texto y fondo
//     winnerMessage.style.borderRadius = "10px"; // Esquinas redondeadas
//     winnerMessage.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)"; // Sombra para el mensaje
//     winnerMessage.style.display = "flex";
//     winnerMessage.style.flexDirection = "column";
//     winnerMessage.style.alignItems = "center";

//     const winnerText = document.createElement('span');
//     winnerText.textContent = `${winner} ha ganado!`;

//     const restartButton = document.createElement('button');
//     restartButton.textContent = "Reiniciar Juego";
//     restartButton.style.marginTop = "20px"; // Asegura que haya espacio entre el texto y el botón
//     restartButton.style.fontSize = "1.5em";
//     restartButton.onclick = restartGame;

//     // Añadir al contenedor
//     winnerMessage.appendChild(winnerText);
//     winnerMessage.appendChild(restartButton);

//     document.body.appendChild(winnerMessage);

//     // Desaparece el canvas y el marcador
//     canvas.style.display = 'none';
//     document.getElementById("scoreboard").style.display = 'none';
// }

// // Función que reinicia el juego
// function restartGame() {
//     // Reinicia las variables del juego
//     player1Score = 0;
//     player2Score = 0;
//     player1Y = 150;
//     player2Y = 150;
//     ballX = canvas.width / 2;
//     ballY = canvas.height / 2;
//     ballSpeedX = 5;
//     ballSpeedY = 3;

//     // Muestra de nuevo el juego
//     document.getElementById("start-button").style.display = 'none';
//     document.getElementById("scoreboard").style.display = 'block';
//     canvas.style.display = 'block';

//     // Elimina el mensaje de ganador
//     document.getElementById("winner-message").remove();

//     // Reinicia el juego
//     gameStarted = true;
//     runGame();
// }

// // Variables para las teclas
// let wKeyPressed = false;
// let sKeyPressed = false;
// let upKeyPressed = false;
// let downKeyPressed = false;

// // Función para escuchar teclas presionadas
// window.addEventListener('keydown', function(event) {
//     if (event.key === "w") wKeyPressed = true;
//     if (event.key === "s") sKeyPressed = true;
//     if (event.key === "ArrowUp") upKeyPressed = true;
//     if (event.key === "ArrowDown") downKeyPressed = true;
// });

// window.addEventListener('keyup', function(event) {
//     if (event.key === "w") wKeyPressed = false;
//     if (event.key === "s") sKeyPressed = false;
//     if (event.key === "ArrowUp") upKeyPressed = false;
//     if (event.key === "ArrowDown") downKeyPressed = false;
// });

// Variables globales con tipos
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
const paddleWidth: number = 10;
const paddleHeight: number = 100;
const ballRadius: number = 10;

let player1Y: number = 150;
let player2Y: number = 150;
let ballX: number = 400;
let ballY: number = 200;
let ballSpeedX: number = 10;
let ballSpeedY: number = 6;
let player1Score: number = 0;
let player2Score: number = 0;
let gameStarted: boolean = false;

// Variables para las teclas
let wKeyPressed: boolean = false;
let sKeyPressed: boolean = false;
let upKeyPressed: boolean = false;
let downKeyPressed: boolean = false;

// Función para iniciar el juego
function startGame(): void {
    gameStarted = true;
    canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (!canvas || !ctx) {
        console.error("Error: No se pudo obtener el canvas o el contexto.");
        return;
    }

    const startButton = document.getElementById("start-button") as HTMLElement;
    const scoreboard = document.getElementById("scoreboard") as HTMLElement;

    startButton.style.display = 'none'; // Esconde el botón de iniciar
    scoreboard.style.display = 'block'; // Muestra el marcador
    canvas.style.display = 'block'; // Muestra el canvas para el juego

    runGame(); // Comienza el ciclo del juego
}

// Función principal que maneja la lógica del juego
function runGame(): void {
    if (!gameStarted) return;

    drawEverything();
    moveBall();
    movePaddles();
    checkCollision();
    updateScore();

    if (player1Score === 5 || player2Score === 5) {
        showWinner();
        return;
    }

    requestAnimationFrame(runGame);
}

// Dibuja todo en el canvas
function drawEverything(): void {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00d9ff";
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
    ctx.fill();
}

// Mueve la pelota
function moveBall(): void {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX < 0 || ballX > canvas.width) {
        ballSpeedX = -ballSpeedX;
    }
}

// Mueve las paletas con el teclado
function movePaddles(): void {
    if (wKeyPressed && player1Y > 0) player1Y -= 10;
    if (sKeyPressed && player1Y < canvas.height - paddleHeight) player1Y += 10;
    if (upKeyPressed && player2Y > 0) player2Y -= 10;
    if (downKeyPressed && player2Y < canvas.height - paddleHeight) player2Y += 10;
}

// Detecta colisiones de la pelota con las palas
function checkCollision(): void {
    if (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
}

// Actualiza el marcador
function updateScore(): void {
    if (ballX < 0) {
        player2Score++;
        resetBall();
    }

    if (ballX > canvas.width) {
        player1Score++;
        resetBall();
    }

    const player1ScoreElement = document.getElementById("player1-score") as HTMLElement;
    const player2ScoreElement = document.getElementById("player2-score") as HTMLElement;

    player1ScoreElement.textContent = player1Score.toString();
    player2ScoreElement.textContent = player2Score.toString();
}

// Reinicia la pelota cuando sale de los límites
function resetBall(): void {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3;
}

// Función que muestra el mensaje de ganador
function showWinner(): void {
    const winner = player1Score === 5 ? "Jugador 1" : "Jugador 2";
    const winnerMessage = document.createElement('div');
    winnerMessage.id = "winner-message";
    winnerMessage.innerHTML = `<span>${winner} ha ganado!</span><button onclick="restartGame()">Reiniciar Juego</button>`;
    document.body.appendChild(winnerMessage);

    canvas.style.display = 'none';
    document.getElementById("scoreboard")!.style.display = 'none';
}

// Función que reinicia el juego
function restartGame(): void {
    player1Score = 0;
    player2Score = 0;
    player1Y = 150;
    player2Y = 150;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 3;

    document.getElementById("start-button")!.style.display = 'none';
    document.getElementById("scoreboard")!.style.display = 'block';
    canvas.style.display = 'block';

    document.getElementById("winner-message")?.remove();

    gameStarted = true;
    runGame();
}

// Función para escuchar teclas presionadas
window.addEventListener('keydown', function(event: KeyboardEvent): void {
    if (event.key === "w") wKeyPressed = true;
    if (event.key === "s") sKeyPressed = true;
    if (event.key === "ArrowUp") upKeyPressed = true;
    if (event.key === "ArrowDown") downKeyPressed = true;
});

window.addEventListener('keyup', function(event: KeyboardEvent): void {
    if (event.key === "w") wKeyPressed = false;
    if (event.key === "s") sKeyPressed = false;
    if (event.key === "ArrowUp") upKeyPressed = false;
    if (event.key === "ArrowDown") downKeyPressed = false;
});

// Asegurar que el botón de inicio tenga el event listener correcto
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button") as HTMLElement;
    startButton.addEventListener("click", startGame);
});
