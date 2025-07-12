const canva = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx_ = canva.getContext("2d")!;

const livesDisplay = [
  document.getElementById("p1-lives")!,
  document.getElementById("p2-lives")!,
  document.getElementById("p3-lives")!,
  document.getElementById("p4-lives")!
];

const winner_Msg = document.getElementById("winner-msg")!;
const winner_Text = document.getElementById("winner-text")!;

type Player = {
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
};

const players_: Player[] = [
  { side: "left", color: "red",    x: 0, y: 250, w: 10, h: 100, moveUp: false, moveDown: false, lives: 3, eliminated: false },
  { side: "right",color: "blue",   x: 590, y: 250, w: 10, h: 100, moveUp: false, moveDown: false, lives: 3, eliminated: false },
  { side: "top",  color: "green",  x: 250, y: 0, w: 100, h: 10, moveUp: false, moveDown: false, lives: 3, eliminated: false },
  { side: "bottom",color: "yellow",x: 250, y: 590, w: 100, h: 10, moveUp: false, moveDown: false, lives: 3, eliminated: false }
];

// Bola
let ball_X = 300, ball_Y = 300;
let speedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let speedY = 5 * (Math.random() < 0.5 ? 1 : -1);

// Movimiento
document.addEventListener("keydown", e => {
  if (e.key === "w") players_[0].moveUp = true;
  if (e.key === "s") players_[0].moveDown = true;
  if (e.key === "ArrowUp") players_[1].moveUp = true;
  if (e.key === "ArrowDown") players_[1].moveDown = true;
  if (e.key === "i") players_[2].moveUp = true;
  if (e.key === "k") players_[2].moveDown = true;
  if (e.key === "z") players_[3].moveUp = true;
  if (e.key === "x") players_[3].moveDown = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "w") players_[0].moveUp = false;
  if (e.key === "s") players_[0].moveDown = false;
  if (e.key === "ArrowUp") players_[1].moveUp = false;
  if (e.key === "ArrowDown") players_[1].moveDown = false;
  if (e.key === "i") players_[2].moveUp = false;
  if (e.key === "k") players_[2].moveDown = false;
  if (e.key === "z") players_[3].moveUp = false;
  if (e.key === "x") players_[3].moveDown = false;
});

function update() {
  // Mover paletas
  players_.forEach(p => {
    if (p.eliminated) return;
    if (p.side === "left" || p.side === "right") {
      if (p.moveUp && p.y > 0) p.y -= 8;
      if (p.moveDown && p.y + p.h < canva.height) p.y += 8;
    } else {
      if (p.moveUp && p.x > 0) p.x -= 8;
      if (p.moveDown && p.x + p.w < canva.width) p.x += 8;
    }
  });

  // Mover bola
  ball_X += speedX;
  ball_Y += speedY;

  // Rebote y colisiones
  let rebote = false;
  for (const p of players_) {
    if (p.eliminated) continue;
    if (p.side === "left" && ball_X <= p.x + p.w && ball_Y >= p.y && ball_Y <= p.y + p.h) {
      speedX *= -1; rebote = true;
    } else if (p.side === "right" && ball_X >= p.x && ball_Y >= p.y && ball_Y <= p.y + p.h) {
      speedX *= -1; rebote = true;
    } else if (p.side === "top" && ball_Y <= p.y + p.h && ball_X >= p.x && ball_X <= p.x + p.w) {
      speedY *= -1; rebote = true;
    } else if (p.side === "bottom" && ball_Y >= p.y && ball_X >= p.x && ball_X <= p.x + p.w) {
      speedY *= -1; rebote = true;
    }
  }

  if (!rebote) {
    if (ball_X <= 0) loseLife(0);
    else if (ball_X >= canva.width) loseLife(1);
    else if (ball_Y <= 0) loseLife(2);
    else if (ball_Y >= canva.height) loseLife(3);
  }
}

function loseLife(index: number) {
  const p = players_[index];
  if (p.eliminated) return;

  p.lives--;
  updateLives();
  if (p.lives === 0) p.eliminated = true;

  // Comprobar si hay un ganador
  const vivos = players_.filter(p => !p.eliminated);
  if (vivos.length === 1) {
    winner_Text.textContent = `¡${vivos[0].color.toUpperCase()} gana!`;
    winner_Msg.classList.remove("hidden");
    cancelAnimationFrame(ani_);
    return;
  }

  // Reset bola
  ball_X = 300;
  ball_Y = 300;
  speedX = 5 * (Math.random() < 0.5 ? 1 : -1);
  speedY = 5 * (Math.random() < 0.5 ? 1 : -1);
}

function updateLives() {
  players_.forEach((p, i) => {
    const emoji = ["🟥", "🟦", "🟩", "🟨"][i];
    livesDisplay[i].textContent = `${emoji} P${i + 1}: ${p.eliminated ? "💀 Eliminado" : `${p.lives} vidas`}`;
  });
}

function draw_() {
  ctx_.clearRect(0, 0, canva.width, canva.height);

  // Dibujar paletas
  players_.forEach(p => {
    if (!p.eliminated) {
      ctx_.fillStyle = p.color;
      ctx_.fillRect(p.x, p.y, p.w, p.h);
    }
  });

  // Dibujar bola
  ctx_.fillStyle = "white";
  ctx_.beginPath();
  ctx_.arc(ball_X, ball_Y, 10, 0, Math.PI * 2);
  ctx_.fill();
}

let ani_: number;
function loop() {
  update();
  draw_();
  ani_ = requestAnimationFrame(loop);
}

updateLives();
loop();


