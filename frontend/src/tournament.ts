interface User {
    username: string;
    email: string;
  }
  
  let players: User[] = [];
  let totalPlayers = 0;
  let currentLoginIndex = 0;
  let rounds: { player1: User; player2: User; winner?: string }[] = [];
  let currentMatchIndex = 0;
  
  const numInput = document.getElementById("num-players") as HTMLInputElement;
  const startBtn = document.getElementById("start-register")!;
  const setupDiv = document.getElementById("setup")!;
  const loginDiv = document.getElementById("login-players")!;
  const usernameIn = document.getElementById("player-username") as HTMLInputElement;
  const passwordIn = document.getElementById("player-password") as HTMLInputElement;
  const confirmBt = document.getElementById("confirm-player")!;
  const erMsg = document.getElementById("login-error")!;
  const loginTitle = document.getElementById("login-title")!;
  const boardDiv = document.getElementById("tournament-board")!;
  const matchTable = document.getElementById("match-table-body")!;
  const nextMatchBtn = document.getElementById("next-match-btn")!;
  
  startBtn.addEventListener("click", () => {
    totalPlayers = parseInt(numInput.value);
    if (![2, 4, 8, 16].includes(totalPlayers)) {
      alert("Solo se permiten números de jugadores como 2, 4, 8, 16...");
      return;
    }
  
    setupDiv.classList.add("hidden");
    loginDiv.classList.remove("hidden");
    updateLoginTitle();
  });
  
  confirmBt.addEventListener("click", async () => {
    const username = usernameIn.value.trim();
    const password = passwordIn.value.trim();
    erMsg.textContent = "";
  
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        erMsg.textContent = data.error || "Error";
        return;
      }
  
      const user = await res.json();
  
      if (players.find(p => p.username === user.username)) {
        erMsg.textContent = "Este jugador ya ha sido registrado";
        return;
      }
  
      players.push(user);
      currentLoginIndex++;
  
      if (players.length === totalPlayers) {
        loginDiv.classList.add("hidden");
        startTournament();
      } else {
        usernameIn.value = "";
        passwordIn.value = "";
        updateLoginTitle();
      }
    } catch (err) {
      erMsg.textContent = "Error de conexión";
    }
  });
  
  function updateLoginTitle() {
    loginTitle.textContent = `Jugador ${currentLoginIndex + 1} - Login`;
  }
  
  function startTournament() {
    boardDiv.classList.remove("hidden");
    shuffleArray(players);
  
    for (let i = 0; i < players.length; i += 2) {
      rounds.push({ player1: players[i], player2: players[i + 1] });
    }
  
    updateMatchTable();
  }
  
  function updateMatchTable() {
    matchTable.innerHTML = "";
    rounds.forEach((match, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="border px-4 py-2">Partido ${idx + 1}</td>
        <td class="border px-4 py-2">${match.player1.username}</td>
        <td class="border px-4 py-2">${match.player2.username}</td>
        <td class="border px-4 py-2">${match.winner || ""}</td>
      `;
      matchTable.appendChild(tr);
    });
  }
  
  nextMatchBtn.addEventListener("click", () => {
    if (currentMatchIndex >= rounds.length) {
      alert("🏁 Torneo terminado");
      return;
    }
  
    const match = rounds[currentMatchIndex];
    boardDiv.classList.add("hidden");
    document.getElementById("pong-game")?.classList.remove("hidden");
    startPongMatch(match.player1, match.player2);
  });
  
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function startPongMatch(player1: User, player2: User) {
    const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const score1 = document.getElementById("score1")!;
    const score2 = document.getElementById("score2")!;
    const countdownEl = document.getElementById("countdown")!;
    const winnerMsg = document.getElementById("winner-msg")!;
    const winnerText = document.getElementById("winner-text")!;
    const restartBtn = document.getElementById("restart-btn")!;
  
    let p1Y = 150, p2Y = 150;
    let bX = 400, bY = 200;
    let bSpeedX = 8, bSpeedY = 5;
    let w = false, s = false, up = false, down = false;
    let ani: number;
    let s1 = 0, s2 = 0;
    let winner: string | null = null;
    let moving = false;
  
    function draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.fillStyle = "#00d9ff";
      ctx.fillRect(0, p1Y, 10, 100);
      ctx.fillRect(canvas.width - 10, p2Y, 10, 100);
  
      if (!winner) {
        ctx.beginPath();
        ctx.arc(bX, bY, 10, 0, Math.PI * 2);
        ctx.fill();
      }
  
      if (w && p1Y > 0) p1Y -= 10;
      if (s && p1Y < canvas.height - 100) p1Y += 10;
      if (up && p2Y > 0) p2Y -= 10;
      if (down && p2Y < canvas.height - 100) p2Y += 10;
  
      if (moving) {
        bX += bSpeedX;
        bY += bSpeedY;
      }
  
      if (bY - 10 <= 0 || bY + 10 >= canvas.height) bSpeedY *= -1;
  
      if (bX - 10 <= 10 && bY >= p1Y && bY <= p1Y + 100) {
        bX = 21;
        bSpeedX *= -1;
      }
  
      if (bX + 10 >= canvas.width - 10 && bY >= p2Y && bY <= p2Y + 100) {
        bX = canvas.width - 21;
        bSpeedX *= -1;
      }
  
      if (bX <= 0) {
        s2++;
        update();
        check();
        if (!winner) resetBall("left"), countdown();
      }
  
      if (bX >= canvas.width) {
        s1++;
        update();
        check();
        if (!winner) resetBall("right"), countdown();
      }
  
      ani = requestAnimationFrame(draw);
    }
  
    function update() {
      score1.textContent = String(s1);
      score2.textContent = String(s2);
    }
  
    function check() {
      if (s1 === 3) winner = player1.username;
      else if (s2 === 3) winner = player2.username;
  
      if (winner) {
        moving = false;
        cancelAnimationFrame(ani);
        winnerText.textContent = `${winner} wins!`;
        winnerMsg.classList.remove("hidden");
        restartBtn.classList.remove("hidden");
        rounds[currentMatchIndex].winner = winner;
        currentMatchIndex++;
      }
    }
  
    function resetBall(dir: "left" | "right") {
      bX = 400;
      bY = 200;
      bSpeedX = dir === "left" ? -8 : 8;
      bSpeedY = Math.random() > 0.5 ? 5 : -5;
    }
  
    function countdown() {
      moving = false;
      let c = 3;
      countdownEl.textContent = String(c);
      countdownEl.classList.remove("hidden");
      const int = setInterval(() => {
        c--;
        if (c === 0) {
          countdownEl.classList.add("hidden");
          clearInterval(int);
          moving = true;
        } else {
          countdownEl.textContent = String(c);
        }
      }, 1000);
    }
  
    restartBtn.addEventListener("click", () => {
      document.getElementById("pong-game")?.classList.add("hidden");
      boardDiv.classList.remove("hidden");
      updateMatchTable();
      restartBtn.classList.add("hidden");
      winnerMsg.classList.add("hidden");
  
      if (currentMatchIndex < rounds.length) {
        nextMatchBtn.classList.remove("hidden");
      } else {
        alert("🏆 ¡Torneo finalizado!");
      }
    });
  
    document.addEventListener("keydown", e => {
      if (e.key === "w") w = true;
      if (e.key === "s") s = true;
      if (e.key === "ArrowUp") up = true;
      if (e.key === "ArrowDown") down = true;
    });
  
    document.addEventListener("keyup", e => {
      if (e.key === "w") w = false;
      if (e.key === "s") s = false;
      if (e.key === "ArrowUp") up = false;
      if (e.key === "ArrowDown") down = false;
    });
  
    // Iniciar partida
    s1 = s2 = 0;
    winner = null;
    update();
    resetBall(Math.random() > 0.5 ? "left" : "right");
    countdown();
    draw();
  }
  