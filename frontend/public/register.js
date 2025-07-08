"use strict";
// register.ts
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
const form = document.getElementById("register-form");
const errorMessage = document.getElementById("error-message");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const usernameI = document.getElementById("username");
const passwordI = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
(_a = document.getElementById("to-login")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.location.href = "login.html";
});
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const username = usernameI.value.trim();
    const password = passwordI.value;
    const confirmPassword = confirmPasswordInput.value;
    if (password !== confirmPassword) {
        showError("Las contraseñas no coinciden");
        return;
    }
    try {
        const res = yield fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, username, password }),
        });
        if (!res.ok) {
            const data = yield res.json();
            throw new Error(data.error || "Error en el registro");
        }
        window.location.href = "login.html";
    }
    catch (err) {
        showError(err.message || "Error desconocido");
    }
}));
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    errorMessage.classList.add("shake");
    setTimeout(() => {
        errorMessage.classList.remove("shake");
    }, 500);
}
