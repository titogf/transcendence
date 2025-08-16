"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("play-btn");
    const loginBtn = document.getElementById("singin-btn");
    const tournamentBtn = document.getElementById("tournament-btn");
    const play4Btn = document.getElementById("play4-btn");
    const playAiBtn = document.getElementById("play-ai-btn");
    const userAvatar = document.getElementById("user-avatar");
    const userStr = localStorage.getItem("user");
    if (userStr && loginBtn) {
        const user = JSON.parse(userStr);
        loginBtn.textContent = user.username;
        loginBtn.innerHTML = `👤 ${user.username}`;
        loginBtn.onclick = () => {
            window.location.href = "./profile.html";
        };
        fetch(`https://localhost:3000/auth/user-info/${user.username}`)
            .then(res => res.json())
            .then(userData => {
            const avatarIndex = userData.avatar >= 0 ? userData.avatar : 0;
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
        })
            .catch(err => {
            console.error("Error cargando avatar del usuario:", err);
        });
    }
    else if (loginBtn) {
        loginBtn.textContent = "Sign in/Register";
        loginBtn.onclick = () => {
            window.location.href = "./login.html";
        };
    }
    if (playBtn) {
        playBtn.addEventListener("click", () => {
            window.location.href = "./pong.html";
        });
    }
    if (playAiBtn) {
        playAiBtn.addEventListener("click", () => {
            window.location.href = "./pong.html?ai=1";
        });
    }
    if (tournamentBtn) {
        tournamentBtn === null || tournamentBtn === void 0 ? void 0 : tournamentBtn.addEventListener("click", () => {
            window.location.href = "./tournament.html";
        });
    }
    if (play4Btn) {
        play4Btn === null || play4Btn === void 0 ? void 0 : play4Btn.addEventListener("click", () => {
            window.location.href = "./play4.html";
        });
    }
});
