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
window.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c, _d, _e, _f;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
        window.location.href = "./login.html";
        return;
    }
    const username = user.username;
    const input = document.getElementById("friend-username");
    const error = document.getElementById("friend-error");
    const addBtn = document.getElementById("add-friend-btn");
    const listContainer = document.getElementById("friends-container");
    const noFriendsMsg = document.getElementById("no-friends");
    (_a = document.getElementById("return-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        window.history.back();
    });
    (_b = document.getElementById("home-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        window.location.href = "./index.html";
    });
    addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!input || !error)
            return;
        const friend = input.value.trim();
        error.classList.add("hidden");
        error.textContent = "";
        if (!friend || friend === username) {
            error.textContent = "Invalid username.";
            error.classList.remove("hidden");
            return;
        }
        try {
            const res = yield fetch("http://localhost:3000/auth/add-friend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: username, friend: friend }),
            });
            const data = yield res.json();
            if (!res.ok)
                throw new Error(data.error || "Error");
            window.location.reload();
            input.value = "";
        }
        catch (err) {
            error.textContent = err.message || "Could not add friend";
            error.classList.remove("hidden");
        }
    }));
    // Cargar lista de amigos
    fetch(`http://localhost:3000/auth/user-friends/${username}`)
        .then((res) => {
        if (!res.ok)
            throw new Error(res.statusText);
        return res.json();
    })
        .then((data) => {
        if (!listContainer || !noFriendsMsg)
            return;
        listContainer.innerHTML = "";
        if (data && data.length > 0) {
            data.forEach((friend) => {
                var _a;
                const friendItem = document.createElement("p");
                friendItem.className = "p-0 m-0 flex items-center justify-between hover:bg-[#3a3a3a] cursor-pointer rounded px-2 py-1 transition-colors";
                friendItem.innerHTML = `
            <span class="ml-0 hover:text-[#00a6c4] cursor-pointer hover:underline">${friend}</span>
            <span class="ml-2 px-2 py-0.5 text-xs rounded text-white">🔴 offline</span>`;
                (_a = friendItem.querySelector("span")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    e.stopPropagation();
                    try {
                        const res = yield fetch(`http://localhost:3000/auth/user-info/${friend}`);
                        if (!res.ok)
                            throw new Error("Could not load profile");
                        const userData = yield res.json();
                        const avatarIndex = userData.avatar >= 0 && userData.avatar <= 9 ? userData.avatar : 0;
                        const avgGoals = userData.matches_played > 0
                            ? (userData.goals_scored / userData.matches_played).toFixed(2)
                            : "0";
                        const winRate = userData.matches_played > 0
                            ? ((userData.wins / userData.matches_played) * 100).toFixed(1) + "%"
                            : "0%";
                        const profileContent = document.getElementById("profile-content");
                        if (profileContent) {
                            profileContent.innerHTML = `
                  <h2 class="text-2xl font-bold text-[#00ff99] mb-4">👤 ${userData.username}</h2>
                  <img src="/avatars/${avatarIndex}.png" alt="Avatar" class="w-24 h-24 mx-auto rounded-full mb-4">
                  <p><strong>Name:</strong> ${userData.name}</p>
                  <p><strong>Email:</strong> ${userData.email}</p>
                  <p><strong>Matches:</strong> ${userData.matches_played}</p>
                  <p><strong>Goals per match:</strong> ${avgGoals}</p>
                  <p><strong>Win rate:</strong> ${winRate}</p>
                `;
                            (_a = document.getElementById("friend-profile")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
                        }
                    }
                    catch (err) {
                        console.error("Error loading profile:", err);
                    }
                }));
                listContainer.appendChild(friendItem);
            });
            noFriendsMsg.classList.add("hidden");
        }
        else {
            noFriendsMsg.classList.remove("hidden");
        }
    })
        .catch((err) => {
        console.error("Error:", err);
        if (noFriendsMsg) {
            noFriendsMsg.textContent = "Could not load friends.";
            noFriendsMsg.classList.remove("hidden");
        }
    });
    (_c = document.getElementById("close-profile")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        var _a;
        (_a = document.getElementById("friend-profile")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    });
    (_d = document.getElementById("logout-btn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./login.html";
    });
    (_e = document.getElementById("management-btn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
        window.location.href = "./settings.html";
    });
    (_f = document.getElementById("profile-btn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
        window.location.href = "./profile.html";
    });
});
