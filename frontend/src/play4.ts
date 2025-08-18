interface User {
  username: string;
  email: string;
}

const playersInfo: User[] = [];
let currentLogin = 2;

const login_Div = document.getElementById("login-others")!;
const username_In = document.getElementById("username") as HTMLInputElement;
const password_In = document.getElementById("password") as HTMLInputElement;
const confirm_Btn = document.getElementById("confirm-player")!;
const login_Title = document.getElementById("login-title")!;
const error_Msg = document.getElementById("login-error")!;
const principal_msg = document.getElementById("principal_msg")!;
const gameContainer = document.getElementById("game-container")!;
const countdown_El = document.getElementById("countdown")!;
const winner_Msg = document.getElementById("winner-msg")!;
const winner_Text = document.getElementById("winner-name")!;

const livesDisplay = [
  document.getElementById("p1-lives")!,
  document.getElementById("p2-lives")!,
  document.getElementById("p3-lives")!,
  document.getElementById("p4-lives")!
];

const canva = document.getElementById("pongCanvas") as HTMLCanvasElement;
const ctx_ = canva.getContext("2d")!;

const userStr = localStorage.getItem("user");
if (!userStr) {
  window.location.href = "./login.html";
} else {
  playersInfo.push(JSON.parse(userStr));
}

confirm_Btn.addEventListener("click", async () => {
  const username = username_In.value.trim();
  const password = password_In.value.trim();
  error_Msg.textContent = "";

  try {
    const res = await fetch("https://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      error_Msg.textContent = data.error || "Error";
      return;
    }

    const user: User = await res.json();
    if (playersInfo.find(p => p.username === user.username)) {
      error_Msg.textContent = "Jugador ya registrado.";
      return;
    }

    playersInfo.push(user);
    currentLogin++;

    if (playersInfo.length === 4) {
      login_Div.classList.add("hidden");
      start_Game();
    } else {
      username_In.value = "";
      password_In.value = "";
      login_Title.textContent = `Jugador ${currentLogin} - Login`;
    }
  } catch {
    error_Msg.textContent = "Error de conexión.";
  }
});

interface Player {
  side: "left" | "right" | "top" | "bottom";
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  moveUp: boolean;
  moveDown: boolean;
  lives: number;
  eliminated: boolean;
  // Nuevas propiedades para efectos
  lastX: number;
  lastY: number;
  velocity: number;
}

const players_: Player[] = [
  { side: "left", color: "red", x: 0, y: 250, w: 10, h: 100, moveUp: false, moveDown: false, lives: 3, eliminated: false, lastX: 0, lastY: 250, velocity: 0 },
  { side: "right", color: "blue", x: 590, y: 250, w: 10, h: 100, moveUp: false, moveDown: false, lives: 3, eliminated: false, lastX: 590, lastY: 250, velocity: 0 },
  { side: "top", color: "green", x: 250, y: 0, w: 100, h: 10, moveUp: false, moveDown: false, lives: 3, eliminated: false, lastX: 250, lastY: 0, velocity: 0 },
  { side: "bottom", color: "yellow", x: 250, y: 590, w: 100, h: 10, moveUp: false, moveDown: false, lives: 3, eliminated: false, lastX: 250, lastY: 590, velocity: 0 },
];

let ball_X = 300, ball_Y = 300;
let speedX = 0;
let speedY = 0;
let ani_: number;
let allowMove = false;

// Variables para efectos y aceleración
let accelerationInterv: number | null = null;
let gameStartTi = 0;
const baseSpeed = 5;
const accelerationFact = 0.15; // 15% de aumento cada 5 segundos
const maxSpeedMultipl = 3; // Límite máximo de velocidad

// Función para acelerar la pelota progresivamente
function startAccelerat() {
  if (accelerationInterv) clearInterval(accelerationInterv);
  gameStartTi = Date.now();
  
  accelerationInterv = window.setInterval(() => {
    if (!allowMove) return;
    
    const currentSpeedX = Math.abs(speedX);
    const currentSpeedY = Math.abs(speedY);
    const maxSpeed = baseSpeed * maxSpeedMultipl;
    
    // Solo acelerar si no hemos llegado al límite
    if (currentSpeedX < maxSpeed || currentSpeedY < maxSpeed) {
      const directionX = speedX > 0 ? 1 : -1;
      const directionY = speedY > 0 ? 1 : -1;
      
      speedX = Math.min(maxSpeed, currentSpeedX * (1 + accelerationFact)) * directionX;
      speedY = Math.min(maxSpeed, currentSpeedY * (1 + accelerationFact)) * directionY;
    }
  }, 5000); // Cada 5 segundos
}

function startRound() {
  ball_X = 300;
  ball_Y = 300;
  allowMove = false;
  
  // Limpiar aceleración anterior
  if (accelerationInterv) clearInterval(accelerationInterv);
  
  countdown_El.textContent = "3";
  countdown_El.classList.remove("hidden");
  let count = 3;
  const interval = setInterval(() => {
    count--;
    countdown_El.textContent = count > 0 ? String(count) : "";
    if (count <= 0) {
      clearInterval(interval);
      countdown_El.classList.add("hidden");
      // Resetear a velocidades base
      speedX = baseSpeed * (Math.random() < 0.5 ? 1 : -1);
      speedY = baseSpeed * (Math.random() < 0.5 ? 1 : -1);
      allowMove = true;
      // Iniciar aceleración
      startAccelerat();
    }
  }, 1000);
}

document.addEventListener("keydown", e => {
  const target = e.target as HTMLElement;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

  if (["ArrowUp", "ArrowDown", "w", "s", "i", "k", "z", "x"].includes(e.key)) {
    e.preventDefault();
    if (e.key === "w") players_[0].moveUp = true;
    if (e.key === "s") players_[0].moveDown = true;
    if (e.key === "ArrowUp") players_[1].moveUp = true;
    if (e.key === "ArrowDown") players_[1].moveDown = true;
    if (e.key === "i") players_[2].moveUp = true;
    if (e.key === "k") players_[2].moveDown = true;
    if (e.key === "z") players_[3].moveUp = true;
    if (e.key === "x") players_[3].moveDown = true;
  }
});

document.addEventListener("keyup", e => {
  const target = e.target as HTMLElement;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

  if (["ArrowUp", "ArrowDown", "w", "s", "i", "k", "z", "x"].includes(e.key)) {
    e.preventDefault();
    if (e.key === "w") players_[0].moveUp = false;
    if (e.key === "s") players_[0].moveDown = false;
    if (e.key === "ArrowUp") players_[1].moveUp = false;
    if (e.key === "ArrowDown") players_[1].moveDown = false;
    if (e.key === "i") players_[2].moveUp = false;
    if (e.key === "k") players_[2].moveDown = false;
    if (e.key === "z") players_[3].moveUp = false;
    if (e.key === "x") players_[3].moveDown = false;
  }
});

function update() {
  players_.forEach(p => {
    if (p.eliminated) return;
    
    // Guardar posición anterior para calcular velocidad
    const previousX = p.x;
    const previousY = p.y;
    
    if (p.side === "left" || p.side === "right") {
      if (p.moveUp && p.y > 0) p.y -= 8;
      if (p.moveDown && p.y + p.h < canva.height) p.y += 8;
      // Calcular velocidad vertical
      p.velocity = p.y - previousY;
    } else {
      if (p.moveUp && p.x > 0) p.x -= 8;
      if (p.moveDown && p.x + p.w < canva.width) p.x += 8;
      // Calcular velocidad horizontal
      p.velocity = p.x - previousX;
    }
  });

  if (!allowMove) return;

  ball_X += speedX;
  ball_Y += speedY;

  let rebote = false;
  for (const p of players_) {
    if (p.eliminated) continue;
    
    if (p.side === "left" && ball_X <= p.x + p.w && ball_Y >= p.y && ball_Y <= p.y + p.h) {
      speedX = Math.abs(speedX); // Asegurar dirección positiva
      
      // Aplicar efecto basado en movimiento de la paleta
      const spinEffect = p.velocity * 0.3;
      speedY += spinEffect;
      
      // Limitar velocidad Y para mantener jugabilidad
      speedY = Math.max(-20, Math.min(20, speedY));
      rebote = true;
      
    } else if (p.side === "right" && ball_X >= p.x && ball_Y >= p.y && ball_Y <= p.y + p.h) {
      speedX = -Math.abs(speedX); // Asegurar dirección negativa
      
      // Aplicar efecto basado en movimiento de la paleta
      const spinEffect = p.velocity * 0.3;
      speedY += spinEffect;
      
      // Limitar velocidad Y para mantener jugabilidad
      speedY = Math.max(-20, Math.min(20, speedY));
      rebote = true;
      
    } else if (p.side === "top" && ball_Y <= p.y + p.h && ball_X >= p.x && ball_X <= p.x + p.w) {
      speedY = Math.abs(speedY); // Asegurar dirección positiva
      
      // Aplicar efecto basado en movimiento de la paleta
      const spinEffect = p.velocity * 0.3;
      speedX += spinEffect;
      
      // Limitar velocidad X para mantener jugabilidad
      speedX = Math.max(-20, Math.min(20, speedX));
      rebote = true;
      
    } else if (p.side === "bottom" && ball_Y >= p.y && ball_X >= p.x && ball_X <= p.x + p.w) {
      speedY = -Math.abs(speedY); // Asegurar dirección negativa
      
      // Aplicar efecto basado en movimiento de la paleta
      const spinEffect = p.velocity * 0.3;
      speedX += spinEffect;
      
      // Limitar velocidad X para mantener jugabilidad
      speedX = Math.max(-20, Math.min(20, speedX));
      rebote = true;
    }
  }

  if (!rebote) {
    // Colisiones con paredes SIN paleta (jugador eliminado)
    if (ball_X <= 0) {
      if (players_[0].eliminated) speedX *= -1;
      else loseLife(0);
    } else if (ball_X >= canva.width) {
      if (players_[1].eliminated) speedX *= -1;
      else loseLife(1);
    }
  
    if (ball_Y <= 0) {
      if (players_[2].eliminated) speedY *= -1;
      else loseLife(2);
    } else if (ball_Y >= canva.height) {
      if (players_[3].eliminated) speedY *= -1;
      else loseLife(3);
    }
  
    // Prevenir rebote infinito en esquinas (corrección de ángulo mínimo)
    if (Math.abs(speedX) < 2) speedX = 2 * Math.sign(speedX);
    if (Math.abs(speedY) < 2) speedY = 2 * Math.sign(speedY);
  }  
}

function loseLife(index: number) {
  const p = players_[index];
  if (p.eliminated) return;

  p.lives--;
  updateLives();
  if (p.lives === 0) p.eliminated = true;

  const vivos = players_.filter(p => !p.eliminated);
  if (vivos.length === 1) {
    const idx = players_.indexOf(vivos[0]);
    winner_Text.textContent = playersInfo[idx].username;
    cancelAnimationFrame(ani_);
    
    // Limpiar intervalos de aceleración
    if (accelerationInterv) clearInterval(accelerationInterv);
    
    gameContainer.classList.add("hidden");
    principal_msg.classList.add("hidden");
    const endScreen = document.getElementById("end-screen")!;
    endScreen.classList.remove("hidden");
    winner_Text.textContent = playersInfo[idx].username;
    winner_Msg.classList.remove("hidden"); // Asegura que se muestre
    return;
  }

  startRound();
}

function updateLives() {
  players_.forEach((p, i) => {
    const emoji = ["🟥", "🟦", "🟩", "🟨"][i];
    livesDisplay[i].textContent = `${emoji} ${p.eliminated ? "💀 Eliminado" : `${p.lives} vidas`}`;
  });
}

function draw_() {
  ctx_.clearRect(0, 0, canva.width, canva.height);

  players_.forEach(p => {
    if (!p.eliminated) {
      ctx_.fillStyle = p.color;
      ctx_.fillRect(p.x, p.y, p.w, p.h);
    }
  });

  ctx_.fillStyle = "white";
  ctx_.beginPath();
  ctx_.arc(ball_X, ball_Y, 10, 0, Math.PI * 2);
  ctx_.fill();
}

function loop() {
  update();
  draw_();
  ani_ = requestAnimationFrame(loop);
}

function start_Game() {
  gameContainer.classList.remove("hidden");

  document.getElementById("p1-name")!.textContent = playersInfo[0].username;
  document.getElementById("p2-name")!.textContent = playersInfo[1].username;
  document.getElementById("p3-name")!.textContent = playersInfo[2].username;
  document.getElementById("p4-name")!.textContent = playersInfo[3].username;

  // Reiniciar todas las variables del juego
  players_.forEach((p, i) => {
    p.lives = 3;
    p.eliminated = false;
    p.velocity = 0;
    // Resetear posiciones
    if (p.side === "left") { p.x = 0; p.y = 250; }
    else if (p.side === "right") { p.x = 590; p.y = 250; }
    else if (p.side === "top") { p.x = 250; p.y = 0; }
    else if (p.side === "bottom") { p.x = 250; p.y = 590; }
  });

  updateLives();
  startRound();
  loop();
}