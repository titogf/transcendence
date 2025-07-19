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
    const res = await fetch("http://localhost:3000/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    if (!res.ok) { player2Error.textContent = "Usuario o contraseña incorrectos"; return; }
    const data = await res.json();
    if (data.username === user.username) { player2Error.textContent = "Player 2 no puede ser el mismo que Player 1"; return; }
    localStorage.setItem("user2", JSON.stringify(data));
    user2 = data;
    user2Modal.classList.add("hidden");
    startGame();
  } catch { player2Error.textContent = "Error de conexión"; }
});

// Game draw loop
function draw() {
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
  // Paleta 1 (W/S)
  if (wKey && player1Y > 0) player1Y -= 10;
  if (sKey && player1Y < canvas.height - 100) player1Y += 10;
  
  // Paleta 2 (respuesta a eventos de tecla, ya sea humano o IA)
  if (upKey && player2Y > 0) player2Y -= 10;
  if (downKey && player2Y < canvas.height - 100) player2Y += 10;
  
  if (ballMoving) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }
  // Wall collision
  if (ballY - 10 <= 0 || ballY + 10 >= canvas.height) ballSpeedY *= -1;
  // Paddle collision
  if (ballX - 10 <= 10 && ballY >= player1Y && ballY <= player1Y + 100) {
    ballX = 21; ballSpeedX *= -1;
  }
  if (ballX + 10 >= canvas.width - 10 && ballY >= player2Y && ballY <= player2Y + 100) {
    ballX = canvas.width - 21; ballSpeedX *= -1;
  }
  // Score
  if (ballX <= 0) {
    scoreP2++; updateScore(); checkWinner(); if (!winner) { resetBall("left"); startCountdown(); } else { resetBall("zero"); if (aiPredictionInterval) clearInterval(aiPredictionInterval); if (aiMoveInterval) clearInterval(aiMoveInterval); }
  }
  if (ballX >= canvas.width) {
    scoreP1++; updateScore(); checkWinner(); if (!winner) { resetBall("right"); startCountdown(); } else { resetBall("zero"); if (aiPredictionInterval) clearInterval(aiPredictionInterval); if (aiMoveInterval) clearInterval(aiMoveInterval); }
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
    winnerText.textContent = `${winner} wins!`;
    winnerMsg.classList.remove("hidden");
    sendMatchResult();
  }
}

function resetBall(direction: "left" | "right" | "zero") {
  ballX = 400; ballY = 200;
  if (direction === "zero") { ballSpeedX = 0; ballSpeedY = 0; }
  else { ballSpeedX = direction === "left" ? -8 : 8; ballSpeedY = Math.random() > 0.5 ? 5 : -5; }
}

function predictBallY(): number {
  let simX = ballX, simY = ballY;
  let simSpeedX = Math.abs(ballSpeedX), simSpeedY = ballSpeedY;
  while (simX < canvas.width - 20) {
    simX += simSpeedX; simY += simSpeedY;
    if (simY - 10 <= 0 || simY + 10 >= canvas.height) simSpeedY *= -1;
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
    if (count === 0) { countdownEl.classList.add("hidden"); clearInterval(interval); ballMoving = true; }
    else countdownEl.textContent = String(count);
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

  // Mueve la pala cada 300 ms en función de la predicción más reciente
  aiMoveInterval = window.setInterval(() => {
    if (!ballMoving) return;
    const centerPaddle = player2Y + 50;
    const delta = predictedY - centerPaddle;
    let key: "ArrowUp" | "ArrowDown" | null = null;
    if (Math.abs(delta) > 10) key = delta > 0 ? "ArrowDown" : "ArrowUp";
    if (key) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key }));
      setTimeout(() => window.dispatchEvent(new KeyboardEvent("keyup", { key })), aiPressDuration);
    }
  }, 300);
}

async function sendMatchResult() {
  if (isAI) return;
  const winnerUsername = scoreP1 === 3 ? user.username : user2.username;
  const loserUsername = scoreP1 === 3 ? user2.username : user.username;
  try {
    await fetch("http://localhost:3000/auth/match-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winner: winnerUsername, loser: loserUsername, winner_goals: Math.max(scoreP1, scoreP2), loser_goals: Math.min(scoreP1, scoreP2) })
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
  updateScore();
  winner = null;

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
  resetBall("left"); startCountdown(); draw();
}
