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
var _a, _b;
window.addEventListener("DOMContentLoaded", () => {
    var _a;
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
                const friendItem = document.createElement("li");
                friendItem.textContent = "🔴 Offline   " + friend;
                friendItem.addEventListener("click", () => {
                    window.location.href = `./profile.html?username=${friend}`;
                });
                friendItem.classList.add("cursor-pointer", "hover:underline");
                friendItem.className = "text-white hover:text-[#00ff99]";
                listContainer === null || listContainer === void 0 ? void 0 : listContainer.appendChild(friendItem);
            });
            noFriendsMsg === null || noFriendsMsg === void 0 ? void 0 : noFriendsMsg.classList.add("hidden");
        }
        else {
            noFriendsMsg === null || noFriendsMsg === void 0 ? void 0 : noFriendsMsg.classList.remove("hidden");
        }
    })
        .catch((err) => {
        console.error("Error:", err);
        if (noFriendsMsg) {
            noFriendsMsg.textContent = "Could not load friends.";
            noFriendsMsg.classList.remove("hidden");
        }
    });
});
(_a = document.getElementById("return-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.history.back();
});
(_b = document.getElementById("home-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    window.location.href = "./index.html";
});
