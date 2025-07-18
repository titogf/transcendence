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
    var _a, _b, _c;
    const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
    if (!userFromStorage) {
        window.location.href = "./login.html";
        return;
    }
    fetch(`http://localhost:3000/auth/user-info/${userFromStorage.username}`)
        .then(res => res.json())
        .then(user => {
        document.getElementById("username").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        const avatarIndex = user.avatar >= 0 && user.avatar <= 9 ? user.avatar : 0;
        document.getElementById("user-avatar").src = `/avatars/${avatarIndex}.png`;
    });
    (_a = document.getElementById("return-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        window.history.back();
    });
    (_b = document.getElementById("home-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        window.location.href = "./index.html";
    });
    (_c = document.getElementById("logout-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./login.html";
    });
    // Guardar cambios
    const saveBtn = document.getElementById("save-btn");
    saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const currentUsername = userFromStorage.username;
        const newAvatar = document.getElementById("new-avatar").value;
        const newUsername = document.getElementById("new-username").value.trim();
        const newEmail = document.getElementById("new-email").value.trim();
        const newPassword = document.getElementById("new-password").value;
        const confirm = document.getElementById("confirm-password").value;
        const errorSpan = document.getElementById("password-error");
        if (newPassword && newPassword !== confirm) {
            errorSpan === null || errorSpan === void 0 ? void 0 : errorSpan.classList.remove("hidden");
            return;
        }
        else {
            errorSpan === null || errorSpan === void 0 ? void 0 : errorSpan.classList.add("hidden");
        }
        try {
            const response = yield fetch("http://localhost:3000/auth/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentUsername,
                    newAvatar,
                    newUsername,
                    newEmail,
                    newPassword,
                }),
            });
            const result = yield response.json();
            if (result.success) {
                localStorage.setItem("user", JSON.stringify({ username: newUsername || currentUsername }));
                window.location.href = "./settings.html";
            }
            else {
                alert(result.error || "No se pudo actualizar el perfil.");
            }
        }
        catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error al conectar con el servidor.");
        }
    }));
    const deleteBtn = document.getElementById("delete-account-btn");
    deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const username = JSON.parse(localStorage.getItem("user")).username;
        const response = yield fetch("http://localhost:3000/auth/delete-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });
        const result = yield response.json();
        if (result.success) {
            localStorage.removeItem("user");
            window.location.href = "./index.html";
        }
        else {
            alert(result.error || "Error deleting account");
        }
    }));
});
