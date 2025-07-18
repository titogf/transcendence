"use strict";
window.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d;
    const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
    if (!userFromStorage) {
        window.location.href = "./login.html";
        return;
    }
    fetch(`http://localhost:3000/auth/user-info/${userFromStorage.username}`)
        .then(res => res.json())
        .then(user => {
        document.getElementById("name").textContent = user.name;
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        const avatarIndex = user.avatar >= 0 && user.avatar <= 9 ? user.avatar : 0;
        document.getElementById("user-avatar").src = `/avatars/${avatarIndex}.png`;
        const totalMatches = user.matches_played || 0;
        const avgGoals = totalMatches > 0 ? (user.goals_scored / totalMatches).toFixed(2) : "0";
        const winRate = totalMatches > 0 ? ((user.wins / totalMatches) * 100).toFixed(1) + "%" : "0%";
        document.getElementById("avg-goals").textContent = avgGoals;
        document.getElementById("win-rate").textContent = winRate;
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
    (_d = document.getElementById("settings-btn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        window.location.href = "./settings.html";
    });
});
