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
const existingUser = localStorage.getItem("user");
if (existingUser) {
    window.location.href = "profile.html";
}
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("error-msg");
const retBtn = document.getElementById("return-btn");
const hmBtn = document.getElementById("home-btn");
const registerLink = document.getElementById("register-link");
function shakeError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
    errorMsg.classList.remove("shake");
    void errorMsg.offsetWidth; // fuerza reflow
    errorMsg.classList.add("shake");
}
loginForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    try {
        const response = yield fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
            const data = yield response.json();
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = "index.html";
        }
        else {
            shakeError("Usuario o contraseña incorrectos");
        }
    }
    catch (err) {
        shakeError("Error de conexión");
    }
}));
retBtn === null || retBtn === void 0 ? void 0 : retBtn.addEventListener("click", () => {
    window.history.back();
});
hmBtn === null || hmBtn === void 0 ? void 0 : hmBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
registerLink === null || registerLink === void 0 ? void 0 : registerLink.addEventListener("click", () => {
    window.location.href = "register.html";
});
