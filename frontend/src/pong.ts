// frontend/src/pong.ts
const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const scoreboard = document.getElementById("scoreboard")!;
const score1 = document.getElementById("score1")!;
const score2 = document.getElementById("score2")!;
const countdownEl = document.getElementById("countdown")!;
const winnerMsg = document.getElementById("winner-msg")!;
const winnerText = document.getElementById("winner-text")!;
const restartBtn = document.getElementById("restart-btn")!;
const homeBtn = document.getElementById("home-btn");
const returnBtn = document.getElementById("return-btn");
const profileBtn = document.getElementById("profile-btn")!;

// Detect AI mode
const isAI = new URLSearchParams(window.location.search).get("ai") === "1";

// Modal login player 2
const user2Modal = document.getElementById("player2-modal")!;
const player2Input = document.getElementById("player2-username") as HTMLInputElement;
const player2Pass = document.getElementById("player2-password") as HTMLInputElement;
const player2Error = document.getElementById("player2-error")!;
const confirmBtn = document.getElementById("confirm-btn")!;

// Users
const user = JSON.parse(localStorage.getItem("user") || "null");
let user2: any = null;

if (!user) {
  window.location.href = "./login.html";
} else {
  profileBtn.textContent = `👤 ${user.username}`;
  profileBtn.addEventListener("click", () => window.location.href = "./profile.html");
}

localStorage.removeItem("user2");

homeBtn?.addEventListener("click", () => window.location.href = "./index.html");
returnBtn?.addEventListener("click", () => window.history.back());

// Game state
let player1Y = 150;
let player2Y = 150;
let ballX = 400;
let ballY = 200;
let ballSpeedX = 8;
let ballSpeedY = 5;
let wKey = false, sKey = false, upKey = false, downKey = false;
let animationId: number | null = null;
let scoreP1 = 0;
let scoreP2 = 0;
let winner: string | null = null;
let ballMoving = false;
let predictedY: number = 0;
let aiPredictionInterval: number | null = null;
let aiMoveInterval: number | null = null;

// Nuevas variables para efectos y aceleración
let lastPlayer1Y = 150;
let lastPlayer2Y = 150;
let player1Velocity = 0;
let player2Velocity = 0;
let accelerationInterval: number | null = null;
let gameStartTime = 0;
const baseSpeedX = 8;
const baseSpeedY = 5;
const accelerationFactor = 0.15; // 15% de aumento cada 5 segundos
const maxSpeedMultiplier = 3; // Límite máximo de velocidad

// AI controls
let aiInterval: number | null = null;
const aiPressDuration = 100;

// Initialize game or modal
user2 = JSON.parse(localStorage.getItem("user2") || "null");
if (isAI) {
  user2 = { username: "IA" };
  startGame();
  startAI();
} else if (!user2) {
  user2Modal.classList.remove("hidden");
} else {
  startGame();
}

// Player 2 login when not AI
confirmBtn.addEventListener("click", async () => {
  const username = player2Input.value;
  const password = player2Pass.value;
  if (!username || !password) { player2Error.textContent = "Faltan campos"; return; }
  try {
    const res = await fetch("https://localhost:3000/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    if (!res.ok) { player2Error.textContent = "Usuario o contraseña incorrectos"; return; }
    const data = await res.json();
    if (data.username === user.username) { player2Error.textContent = "Player 2 no puede ser el mismo que Player 1"; return; }
    localStorage.setItem("user2", JSON.stringify(data));
    user2 = data;
    user2Modal.classList.add("hidden");
    startGame();
  } catch { player2Error.textContent = "Error de conexión"; }
});

// Función para acelerar la pelota progresivamente
function startAcceleration() {
  if (accelerationInterval) clearInterval(accelerationInterval);
  gameStartTime = Date.now();
  
  accelerationInterval = window.setInterval(() => {
    if (!ballMoving || winner) return;
    
    const currentSpeedX = Math.abs(ballSpeedX);
    const currentSpeedY = Math.abs(ballSpeedY);
    const maxSpeedX = baseSpeedX * maxSpeedMultiplier;
    const maxSpeedY = baseSpeedY * maxSpeedMultiplier;
    
    // Solo acelerar si no hemos llegado al límite
    if (currentSpeedX < maxSpeedX || currentSpeedY < maxSpeedY) {
      const direction = ballSpeedX > 0 ? 1 : -1;
      const directionY = ballSpeedY > 0 ? 1 : -1;
      
      ballSpeedX = Math.min(maxSpeedX, currentSpeedX * (1 + accelerationFactor)) * direction;
      ballSpeedY = Math.min(maxSpeedY, currentSpeedY * (1 + accelerationFactor)) * directionY;
    }
  }, 5000); // Cada 5 segundos
}

// Game draw loop
function draw() {
  // Guardar posiciones anteriores para calcular velocidad
  lastPlayer1Y = player1Y;
  lastPlayer2Y = player2Y;

  // Clear
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Paddles
  ctx.fillStyle = "#00d9ff";
  ctx.fillRect(0, player1Y, 10, 100);
  ctx.fillRect(canvas.width - 10, player2Y, 10, 100);
  // Ball
  if (!winner) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Movement
  const previousPlayer1Y = player1Y;
  const previousPlayer2Y = player2Y;
  
  // Paleta 1 (W/S)
  if (wKey && player1Y > 0) player1Y -= 10;
  if (sKey && player1Y < canvas.height - 100) player1Y += 10;
  
  // Paleta 2 (respuesta a eventos de tecla, ya sea humano o IA)
  if (upKey && player2Y > 0) player2Y -= 10;
  if (downKey && player2Y < canvas.height - 100) player2Y += 10;
  
  // Calcular velocidades de las paletas
  player1Velocity = player1Y - previousPlayer1Y;
  player2Velocity = player2Y - previousPlayer2Y;
  
  if (ballMoving) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }
  
  // Wall collision
  if (ballY - 10 <= 0 || ballY + 10 >= canvas.height) ballSpeedY *= -1;
  
  // Paddle collision con efectos
  if (ballX - 10 <= 10 && ballY >= player1Y && ballY <= player1Y + 100) {
    ballX = 21;
    ballSpeedX = Math.abs(ballSpeedX); // Asegurar dirección positiva
    
    // Aplicar efecto basado en movimiento de la paleta
    const spinEffect = player1Velocity * 0.3; // Factor de efecto
    ballSpeedY += spinEffect;
    
    // Limitar velocidad Y para mantener jugabilidad
    ballSpeedY = Math.max(-15, Math.min(15, ballSpeedY));
  }
  
  if (ballX + 10 >= canvas.width - 10 && ballY >= player2Y && ballY <= player2Y + 100) {
    ballX = canvas.width - 21;
    ballSpeedX = -Math.abs(ballSpeedX); // Asegurar dirección negativa
    
    // Aplicar efecto basado en movimiento de la paleta
    const spinEffect = player2Velocity * 0.3; // Factor de efecto
    ballSpeedY += spinEffect;
    
    // Limitar velocidad Y para mantener jugabilidad
    ballSpeedY = Math.max(-15, Math.min(15, ballSpeedY));
  }
  
  // Score
  if (ballX <= 0) {
    scoreP2++; updateScore(); checkWinner(); 
    if (!winner) { 
      resetBall("left"); 
      startCountdown(); 
    } else { 
      resetBall("zero"); 
      if (aiPredictionInterval) clearInterval(aiPredictionInterval); 
      if (aiMoveInterval) clearInterval(aiMoveInterval);
      if (accelerationInterval) clearInterval(accelerationInterval);
    }
  }
  if (ballX >= canvas.width) {
    scoreP1++; updateScore(); checkWinner(); 
    if (!winner) { 
      resetBall("right"); 
      startCountdown(); 
    } else { 
      resetBall("zero"); 
      if (aiPredictionInterval) clearInterval(aiPredictionInterval); 
      if (aiMoveInterval) clearInterval(aiMoveInterval);
      if (accelerationInterval) clearInterval(accelerationInterval);
    }
  }
  animationId = requestAnimationFrame(draw);
}

function updateScore() {
  score1.textContent = String(scoreP1);
  score2.textContent = String(scoreP2);
}

function checkWinner() {
  if (scoreP1 === 3) winner = user.username;
  else if (scoreP2 === 3) winner = isAI ? "IA" : user2.username;
  if (winner) {
    ballMoving = false; cancelAnimationFrame(animationId!);
    if (aiInterval) clearInterval(aiInterval);
    if (accelerationInterval) clearInterval(accelerationInterval);
    winnerText.textContent = `${winner} wins!`;
    winnerMsg.classList.remove("hidden");
    sendMatchResult();
  }
}

function resetBall(direction: "left" | "right" | "zero") {
  ballX = 400; ballY = 200;
  if (direction === "zero") { 
    ballSpeedX = 0; 
    ballSpeedY = 0; 
  } else { 
    // Resetear a velocidades base
    ballSpeedX = direction === "left" ? -baseSpeedX : baseSpeedX; 
    ballSpeedY = Math.random() > 0.5 ? baseSpeedY : -baseSpeedY; 
  }
}

function predictBallY(): number {
  // 10% de probabilidad de error (reducido del 15% original)
  const errorChance = 0.10;
  if (Math.random() < errorChance) {
    // Devuelve uno de los extremos aleatoriamente (0 o 300)
    return Math.random() < 0.5 ? 0 : canvas.height;
  }

  // Predicción normal si no hay error
  let simX = ballX, simY = ballY;
  let simSpeedX = Math.abs(ballSpeedX), simSpeedY = ballSpeedY;
  while (simX < canvas.width - 20) {
    simX += simSpeedX;
    simY += simSpeedY;
    if (simY - 10 <= 0 || simY + 10 >= canvas.height) {
      simSpeedY *= -1;
    }
  }
  return simY;
}

function startCountdown() {
  ballMoving = false;
  let count = 3;
  countdownEl.textContent = String(count);
  countdownEl.classList.remove("hidden");
  const interval = setInterval(() => {
    count--;
    if (count === 0) { 
      countdownEl.classList.add("hidden"); 
      clearInterval(interval); 
      ballMoving = true;
      // Iniciar aceleración cuando empiece el movimiento de la pelota
      startAcceleration();
    } else {
      countdownEl.textContent = String(count);
    }
  }, 1000);
}

function startAI() {
  // Limpia intervalos anteriores si existen
  if (aiPredictionInterval) clearInterval(aiPredictionInterval);
  if (aiMoveInterval) clearInterval(aiMoveInterval);

  // Actualiza predicción cada 1 segundo
  aiPredictionInterval = window.setInterval(() => {
    if (!ballMoving) return;
    predictedY = predictBallY();
  }, 1000);

  // Mueve la pala cada 250 ms en función de la predicción más reciente
  aiMoveInterval = window.setInterval(() => {
    if (!ballMoving) return;
    if (ballSpeedX < 0) return;
    const centerPaddle = player2Y + 50;
    const delta = predictedY - centerPaddle;
    let key: "ArrowUp" | "ArrowDown" | null = null;
    if (Math.abs(delta) > 10) key = delta > 0 ? "ArrowDown" : "ArrowUp";
    if (key) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key }));
      setTimeout(() => window.dispatchEvent(new KeyboardEvent("keyup", { key })), aiPressDuration);
    }
  }, 250);
}

async function sendMatchResult() {
  const winnerUsername = scoreP1 === 3 ? user.username : user2.username;
  const loserUsername = scoreP1 === 3 ? user2.username : user.username;
  try {
    await fetch("https://localhost:3000/auth/match-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner: winnerUsername, loser: loserUsername, winner_goals: Math.max(scoreP1, scoreP2), loser_goals: Math.min(scoreP1, scoreP2), game_type: isAI ? "IA" : "1vs1" }),
    });
  } catch (err) { console.error("Error registrando partida:", err); }
}

// Keyboard listeners (human + AI)
window.addEventListener("keydown", e => {
  if (e.key === "w") wKey = true;
  if (e.key === "s") sKey = true;
  if (e.key === "ArrowUp") { upKey = true; e.preventDefault(); }
  if (e.key === "ArrowDown") { downKey = true; e.preventDefault(); }
});
window.addEventListener("keyup", e => {
  if (e.key === "w") wKey = false;
  if (e.key === "s") sKey = false;
  if (e.key === "ArrowUp") { upKey = false; e.preventDefault(); }
  if (e.key === "ArrowDown") { downKey = false; e.preventDefault(); }
});

restartBtn.addEventListener("click", () => {
  // Ocultar mensaje de victoria
  winnerMsg.classList.add("hidden");

  // Reset variables del juego
  scoreP1 = 0;
  scoreP2 = 0;
  player1Y = 150;
  player2Y = 150;
  lastPlayer1Y = 150;
  lastPlayer2Y = 150;
  player1Velocity = 0;
  player2Velocity = 0;
  updateScore();
  winner = null;

  // Limpiar intervalos de aceleración
  if (accelerationInterval) clearInterval(accelerationInterval);

  // Reiniciar IA si está activa
  if (isAI) {
    if (aiPredictionInterval) clearInterval(aiPredictionInterval);
    if (aiMoveInterval) clearInterval(aiMoveInterval);
    startAI();
  }

  // Reiniciar pelota y empezar con cuenta atrás
  resetBall("right");
  startCountdown();

  // Iniciar de nuevo el bucle de dibujo
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(draw);
});

function startGame() {
  resetBall("left"); 
  startCountdown(); 
  draw();
}