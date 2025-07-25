"use strict";
window.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d, _e;
    const params = new URLSearchParams(window.location.search);
    const viewedUsername = params.get("user");
    const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
    if (!userFromStorage && !viewedUsername) {
        window.location.href = "./login.html";
        return;
    }
    const usernameToLoad = viewedUsername || userFromStorage.username;
    fetch(`http://localhost:3000/auth/user-info/${usernameToLoad}`)
        .then(res => res.json())
        .then(user => {
        document.getElementById("name").textContent = user.name;
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        const userAvatar = document.getElementById("user-avatar");
        const avatarIndex = user.avatar >= 0 ? user.avatar : 0;
        const imagePath = `/avatars/${avatarIndex}.png`;
        if (userAvatar) {
            fetch(imagePath, { method: "HEAD" })
                .then((res) => {
                if (res.ok) {
                    userAvatar.src = imagePath;
                }
                else {
                    userAvatar.src = "/avatars/0.png";
                }
            })
                .catch(() => {
                userAvatar.src = "/avatars/0.png";
            });
        }
        const totalMatches = user.matches_played || 0;
        const avgGoals = totalMatches > 0 ? (user.goals_scored / totalMatches).toFixed(2) : "0";
        const winRate = totalMatches > 0 ? ((user.wins / totalMatches) * 100).toFixed(1) + "%" : "0%";
        document.getElementById("avg-goals").textContent = avgGoals;
        document.getElementById("win-rate").textContent = winRate;
        document.getElementById("win-tournaments").textContent = user.wins_tournaments;
        document.getElementById("tournaments-played").textContent = user.tournaments_played;
        new Chart("victory-chart", {
            type: "bar",
            data: {
                labels: ["Victories", "Defeats"],
                datasets: [{
                        label: "Games",
                        data: [user.wins, user.losses],
                        backgroundColor: ["#00ff99", "#ff4d4d"],
                    }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
            },
        });
        new Chart("goals-chart", {
            type: "bar",
            data: {
                labels: ["Goals Scored", "Goals Conceded"],
                datasets: [{
                        label: "Goals",
                        data: [user.goals_scored, user.goals_conceded],
                        backgroundColor: ["#00d9ff", "#ffaa00"],
                    }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
            },
        });
        fetch(`http://localhost:3000/auth/user-matches/${user.username}`)
            .then(res => res.json())
            .then(data => {
            const table = document.getElementById("match-table");
            const tbody = document.getElementById("match-body");
            const fallback = document.getElementById("no-matches");
            if (data.length > 0) {
                table.classList.remove("hidden");
                fallback.style.display = "none";
                for (const m of data) {
                    const row = document.createElement("tr");
                    row.className = "hover:bg-[#3a3a3a] border-b border-[#444]";
                    row.innerHTML = `
                <td class="p-2">${new Date(m.date).toLocaleDateString()}</td>
                <td class="p-2">${m.opponent}</td>
                <td class="p-2">${m.goals_scored}</td>
                <td class="p-2">${m.goals_conceded}</td>
                <td class="p-2">${m.type}</td>
                <td class="p-2 ${m.result === "win" ? "text-green-400" : "text-red-400"}">${m.result.toUpperCase()}</td>
              `;
                    tbody.appendChild(row);
                }
            }
        });
    });
    (_a = document.getElementById("logout-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./login.html";
    });
    (_b = document.getElementById("return-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        window.history.back();
    });
    (_c = document.getElementById("home-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        window.location.href = "./index.html";
    });
    (_d = document.getElementById("friend-btn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        window.location.href = "./friends.html";
    });
    (_e = document.getElementById("settings-btn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
        window.location.href = "./settings.html";
    });
});
