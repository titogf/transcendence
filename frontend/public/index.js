"use strict";
window.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("play-btn");
    const loginBtn = document.getElementById("singin-btn");
    const tournamentBtn = document.getElementById("tournament-btn");
    const play4Btn = document.getElementById("play4-btn");
    const userStr = localStorage.getItem("user");
    if (userStr && loginBtn) {
        const user = JSON.parse(userStr);
        loginBtn.textContent = user.username;
        loginBtn.innerHTML = `👤 ${user.username}`;
        loginBtn.onclick = () => {
            window.location.href = "./profile.html";
        };
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
    if (tournamentBtn) {
        tournamentBtn.addEventListener("click", () => {
            window.location.href = "./tournament.html";
        });
    }
    if (play4Btn) {
        play4Btn.addEventListener("click", () => {
            window.location.href = "./play4.html";
        });
    }
});
