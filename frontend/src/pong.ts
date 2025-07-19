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
const isAI = new URLSearchParams(window.location.search).get("ai") === "1";

// Modal login player 2
const user2Modal = document.getElementById("player2-modal")!;
const player2Input = document.getElementById("player2-username") as HTMLInputElement;
const player2Pass = document.getElementById("player2-password") as HTMLInputElement;
const player2Error = document.getElementById("player2-error")!;
const confirmBtn = document.getElementById("confirm-btn")!;

// --- Usuarios ---
const user = JSON.parse(localStorage.getItem("user") || "null");
let user2: any = null;

if (!user) {
  window.location.href = "./login.html";
} else {
  profileBtn.textContent = `👤 ${user.username}`;
  profileBtn.addEventListener("click", () => {
    window.location.href = "./profile.html";
  });
}

localStorage.removeItem("user2");

homeBtn?.addEventListener("click", () => {
  window.location.href = "./index.html";
});
returnBtn?.addEventListener("click", () => {
  window.history.back();
});

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

// Mostrar modal si no hay user2
user2 = JSON.parse(localStorage.getItem("user2") || "null");
if (isAI) {
  user2 = { username: "IA" };
  startGame();
} else if (!user2) {
  user2Modal.classList.remove("hidden");
} else {
  startGame();
}

// Confirmar login de player2
confirmBtn.addEventListener("click", async () => {
  const username = player2Input.value;
  const password = player2Pass.value;

  if (!username || !password) {
    player2Error.textContent = "Faltan campos";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      player2Error.textContent = "Usuario o contraseña incorrectos";
      return;
    }

    const data = await res.json();

    if (data.username === user.username) {
      player2Error.textContent = "Player 2 no puede ser el mismo que Player 1";
      return;
    }

    localStorage.setItem("user2", JSON.stringify(data));
    user2 = data;
    user2Modal.classList.add("hidden");
    startGame();

  } catch (err) {
    player2Error.textContent = "Error de conexión";
  }
});

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00d9ff";
  ctx.fillRect(0, player1Y, 10, 100);
  ctx.fillRect(canvas.width - 10, player2Y, 10, 100);

  if (!winner) {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  if (wKey && player1Y > 0) player1Y -= 10;
  if (sKey && player1Y < canvas.height - 100) player1Y += 10;
  if (isAI) {
    if (ballSpeedX > 0) {
      // Solo predecimos cuando la pelota se acerca
      const predictedY = predictBallY();
      const targetY = predictedY - 50;           // centra la pala (100px alto / 2)
      const centerY = player2Y + 50;             // punto medio actual de la pala
      const delta = targetY - centerY;
      const aiMaxSpeed = 6;                      // velocidad máxima movimiento IA
      const threshold = 2;                       // umbral para considerar "ya en posición"

      if (Math.abs(delta) > aiMaxSpeed) {
        // mover a velocidad tope si falta mucho
        player2Y += delta > 0 ? aiMaxSpeed : -aiMaxSpeed;
      } else if (Math.abs(delta) > threshold) {
        // moverse muy despacio si queda poca distancia
        player2Y += delta > 0 ? 1 : -1;
      }
      // si |delta| <= threshold → NO actualizar player2Y: permanece quieta
    } else {
      // cuando la bola retrocede, vuelve al centro suavemente
      const centerCourt = (canvas.height - 100) / 2;
      const backDelta = (player2Y) - centerCourt;
      if (Math.abs(backDelta) > 1) {
        player2Y += backDelta > 0 ? -1 : 1;
      }
    }

    // Limitar dentro del canvas
    player2Y = Math.max(0, Math.min(canvas.height - 100, player2Y));

  } else {
    // control manual
    if (upKey && player2Y > 0)    player2Y -= 10;
    if (downKey && player2Y < canvas.height - 100) player2Y += 10;
  }

  if (ballMoving) {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }

  if (ballY - 10 <= 0 || ballY + 10 >= canvas.height) ballSpeedY *= -1;

  // Colisión paddle izquierda
  if (ballX - 10 <= 10 && ballY >= player1Y && ballY <= player1Y + 100) {
    ballX = 21;
    ballSpeedX *= -1;
  }

  // Colisión paddle derecha
  if (ballX + 10 >= canvas.width - 10 && ballY >= player2Y && ballY <= player2Y + 100) {
    ballX = canvas.width - 21;
    ballSpeedX *= -1;
  }

  if (ballX <= 0) {
    scoreP2++;
    updateScore();
    checkWinner();
    if (!winner) {
      resetBall("left");
      startCountdown();
    } else {
      resetBall("zero");
    }
  }

  if (ballX >= canvas.width) {
    scoreP1++;
    updateScore();
    checkWinner();
    if (!winner) {
      resetBall("right");
      startCountdown();
    } else {
      resetBall("zero");
    }
  }

  animationId = requestAnimationFrame(draw);
}

function updateScore() {
  score1.textContent = String(scoreP1);
  score2.textContent = String(scoreP2);
}

function checkWinner() {
  winner = scoreP1 === 3 ? user.username : (isAI ? "IA" : user2.username);

  if (winner) {
    ballMoving = false;
    cancelAnimationFrame(animationId!);
    winnerText.textContent = `${winner} wins!`;
    winnerMsg.classList.remove("hidden");
    sendMatchResult();
  }
}

function resetBall(direction: "left" | "right" | "zero") {
  ballX = 400;
  ballY = 200;
  if (direction === "zero") {
    ballSpeedX = 0;
    ballSpeedY = 0;
  } else {
    ballSpeedX = direction === "left" ? -8 : 8;
    ballSpeedY = Math.random() > 0.5 ? 5 : -5;
  }
}

function predictBallY(): number {
  let simX = ballX;
  let simY = ballY;
  let simSpeedX = ballSpeedX;
  let simSpeedY = ballSpeedY;

  if (simSpeedX < 0) simSpeedX = -simSpeedX;

  while (simX < canvas.width - 20) {
    simX += simSpeedX;
    simY += simSpeedY;

    if (simY - 10 <= 0 || simY + 10 >= canvas.height) {
      simSpeedY *= -1;
    }
  }

  return simY + 10;
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
    } else {
      countdownEl.textContent = String(count);
    }
  }, 1000);
}

function restartGame() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scoreP1 = 0;
  scoreP2 = 0;
  winner = null;
  updateScore();
  winnerMsg.classList.add("hidden");
  player1Y = player2Y = 150;
  resetBall(Math.random() > 0.5 ? "left" : "right");
  startCountdown();
  draw();
}

async function sendMatchResult() {
  if (isAI) return;
  const winnerUsername = scoreP1 === 3 ? user.username : user2.username;
  const loserUsername = scoreP1 === 3 ? user2.username : user.username;
  const winnerGoals = Math.max(scoreP1, scoreP2);
  const loserGoals = Math.min(scoreP1, scoreP2);

  try {
    const response = await fetch("http://localhost:3000/auth/match-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        winner: winnerUsername,
        loser: loserUsername,
        winner_goals: winnerGoals,
        loser_goals: loserGoals
      })
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("Error registrando partida:", data.error || response.statusText);
    }
  } catch (err) {
    console.error("Error de conexión al registrar partida:", err);
  }
}

// Event listeners
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

restartBtn.addEventListener("click", restartGame);

// ⬇️ Solo llamamos a startGame() cuando ambos usuarios estén listos
function startGame() {
  resetBall("left");
  startCountdown();
  draw();
}
