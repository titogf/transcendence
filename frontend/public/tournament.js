"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
let players = [];
let totalPlayers = 0;
let currentLoginIndex = 0;
let rounds = [];
let currentRoundIndex = 0;
let currentMatchIndex = 0;
let ani = 0;
const numInput = document.getElementById("num-players");
const startBtn = document.getElementById("start-register");
const setupDiv = document.getElementById("setup");
const loginDiv = document.getElementById("login-players");
const usernameIn = document.getElementById("player-username");
const passwordIn = document.getElementById("player-password");
const nicknameIn = document.getElementById("player-nickname");
const confirmBt = document.getElementById("confirm-player");
const erMsg = document.getElementById("login-error");
const loginTitle = document.getElementById("login-title");
const boardDiv = document.getElementById("tournament-board");
const matchTable = document.getElementById("match-table-body");
const nextMatchBtn = document.getElementById("next-match-btn");
startBtn.addEventListener("click", () => {
    totalPlayers = parseInt(numInput.value);
    if (![2, 4, 8, 16].includes(totalPlayers)) {
        alert("Solo se permiten números de jugadores como 2, 4, 8 o 16");
        return;
    }
    setupDiv.classList.add("hidden");
    loginDiv.classList.remove("hidden");
    updateLoginTitle();
});
confirmBt.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const username = usernameIn.value.trim();
    const password = passwordIn.value.trim();
    const nickname_ = nicknameIn.value.trim();
    erMsg.textContent = "";
    if (!username || !password || !nickname_) {
        erMsg.textContent = "Rellena todos los campos";
        return;
    }
    if (players.find(p => p.nickname === nickname_)) {
        erMsg.textContent = "Este apodo ya ha sido elegido";
        clearInputs();
        return;
    }
    if (players.find(p => p.username === username)) {
        erMsg.textContent = "Este jugador ya ha sido registrado";
        clearInputs();
        return;
    }
    try {
        const res = yield fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            const data = yield res.json();
            erMsg.textContent = data.error || "Error de login";
            clearInputs();
            return;
        }
        const rawUser = yield res.json();
        const user = {
            username: rawUser.username,
            email: rawUser.email,
            nickname: nickname_,
        };
        players.push(user);
        currentLoginIndex++;
        clearInputs();
        if (players.length === totalPlayers) {
            loginDiv.classList.add("hidden");
            startTournament();
        }
        else {
            updateLoginTitle();
        }
    }
    catch (err) {
        erMsg.textContent = "Error de conexión";
        clearInputs();
    }
}));
function clearInputs() {
    usernameIn.value = "";
    passwordIn.value = "";
    nicknameIn.value = "";
}
function updateLoginTitle() {
    loginTitle.textContent = `Jugador ${currentLoginIndex + 1} - Login`;
}
function startTournament() {
    boardDiv.classList.remove("hidden");
    shuffleArray(players);
    const firstRound = [];
    for (let i = 0; i < players.length; i += 2) {
        firstRound.push({ player1: players[i], player2: players[i + 1] });
    }
    rounds.push(firstRound);
    updateMatchTable();
}
function createNextRound() {
    const currentRound = rounds[currentRoundIndex];
    const winners = currentRound.map(m => {
        return players.find(p => p.nickname === m.winner);
    });
    if (winners.length === 1) {
        alert(`🏆 ¡Torneo finalizado! Ganador: ${winners[0].nickname}`);
        nextMatchBtn.classList.add("hidden");
        return;
    }
    const nextRound = [];
    for (let i = 0; i < winners.length; i += 2) {
        nextRound.push({ player1: winners[i], player2: winners[i + 1] });
    }
    rounds.push(nextRound);
    currentRoundIndex++;
    currentMatchIndex = 0;
    updateMatchTable();
}
function updateMatchTable() {
    matchTable.innerHTML = "";
    const currentRound = rounds[currentRoundIndex];
    currentRound.forEach((match, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td class="border px-4 py-2">Partido ${idx + 1}</td>
      <td class="border px-4 py-2">${match.player1.nickname}</td>
      <td class="border px-4 py-2">${match.player2.nickname}</td>
      <td class="border px-4 py-2">${match.winner || ""}</td>
    `;
        matchTable.appendChild(tr);
    });
}
nextMatchBtn.addEventListener("click", () => {
    var _a;
    const currentRound = rounds[currentRoundIndex];
    if (currentMatchIndex >= currentRound.length) {
        alert("Ya se jugaron todos los partidos de esta ronda");
        return;
    }
    const match = currentRound[currentMatchIndex];
    boardDiv.classList.add("hidden");
    (_a = document.getElementById("pong-game")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
    cancelAnimationFrame(ani);
    startPongMatch(match.player1, match.player2);
});
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function startPongMatch(player1, player2) {
    const player1Name = document.getElementById("player1-name");
    const player2Name = document.getElementById("player2-name");
    player1Name.textContent = player1.nickname;
    player2Name.textContent = player2.nickname;
    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");
    const score1 = document.getElementById("score1");
    const score2 = document.getElementById("score2");
    const countdownEl = document.getElementById("countdown");
    const winnerMsg = document.getElementById("winner-msg");
    const winnerText = document.getElementById("winner-text");
    const restartBtn = document.getElementById("restart-btn");
    let p1Y = 150, p2Y = 150;
    let bX = 400, bY = 200;
    let bSpeedX = 8, bSpeedY = 5;
    let w = false, s = false, up = false, down = false;
    let s1 = 0, s2 = 0;
    let winner = null;
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
        if (w && p1Y > 0)
            p1Y -= 10;
        if (s && p1Y < canvas.height - 100)
            p1Y += 10;
        if (up && p2Y > 0)
            p2Y -= 10;
        if (down && p2Y < canvas.height - 100)
            p2Y += 10;
        if (moving) {
            bX += bSpeedX;
            bY += bSpeedY;
        }
        if (bY - 10 <= 0 || bY + 10 >= canvas.height)
            bSpeedY *= -1;
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
            if (!winner)
                resetBall("left"), countdown();
        }
        if (bX >= canvas.width) {
            s1++;
            update();
            check();
            if (!winner)
                resetBall("right"), countdown();
        }
        if (!winner)
            ani = requestAnimationFrame(draw);
    }
    function update() {
        score1.textContent = String(s1);
        score2.textContent = String(s2);
    }
    function check() {
        if (winner)
            return;
        if (s1 === 3)
            winner = player1.nickname;
        else if (s2 === 3)
            winner = player2.nickname;
        if (winner) {
            moving = false;
            cancelAnimationFrame(ani);
            rounds[currentRoundIndex][currentMatchIndex].winner = winner;
            winnerText.textContent = `${winner} wins!`;
            winnerMsg.classList.remove("hidden");
            restartBtn.classList.remove("hidden");
            currentMatchIndex++;
            const currentRound = rounds[currentRoundIndex];
            const allPlayed = currentRound.every(m => m.winner);
            sendMatchResult();
            if (allPlayed)
                createNextRound();
        }
    }
    function sendMatchResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const winnerUsername = s1 === 3 ? player1.username : player2.username;
            const loserUsername = s1 === 3 ? player2.username : player1.username;
            try {
                yield fetch("http://localhost:3000/auth/match-result", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ winner: winnerUsername, loser: loserUsername, winner_goals: Math.max(s1, s2), loser_goals: Math.min(s1, s2) })
                });
            }
            catch (err) {
                console.error("Error registrando partida:", err);
            }
        });
    }
    function resetBall(dir) {
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
            }
            else {
                countdownEl.textContent = String(c);
            }
        }, 1000);
    }
    restartBtn.onclick = () => {
        var _a;
        (_a = document.getElementById("pong-game")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        boardDiv.classList.remove("hidden");
        updateMatchTable();
        restartBtn.classList.add("hidden");
        winnerMsg.classList.add("hidden");
        if (currentMatchIndex < rounds[currentRoundIndex].length) {
            nextMatchBtn.classList.remove("hidden");
        }
    };
    document.addEventListener("keydown", e => {
        if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
            e.preventDefault();
            if (e.key === "w")
                w = true;
            if (e.key === "s")
                s = true;
            if (e.key === "ArrowUp")
                up = true;
            if (e.key === "ArrowDown")
                down = true;
        }
    });
    document.addEventListener("keyup", e => {
        if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
            e.preventDefault();
            if (e.key === "w")
                w = false;
            if (e.key === "s")
                s = false;
            if (e.key === "ArrowUp")
                up = false;
            if (e.key === "ArrowDown")
                down = false;
        }
    });
    // Iniciar juego
    p1Y = 150;
    p2Y = 150;
    bX = 400;
    bY = 200;
    bSpeedX = 8;
    bSpeedY = 5;
    w = s = up = down = false;
    s1 = 0;
    s2 = 0;
    winner = null;
    moving = false;
    update();
    resetBall(Math.random() > 0.5 ? "left" : "right");
    if (ani)
        cancelAnimationFrame(ani);
    countdown();
    draw();
}
(_a = document.getElementById("home-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.location.href = "/index.html";
});
