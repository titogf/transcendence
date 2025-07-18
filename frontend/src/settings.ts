window.addEventListener("DOMContentLoaded", () => {
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
  if (!userFromStorage) {
    window.location.href = "./login.html";
    return;
  }

  fetch(`http://localhost:3000/auth/user-info/${userFromStorage.username}`)
    .then(res => res.json())
    .then(user => {
      (document.getElementById("username") as HTMLElement).textContent = user.username;
      (document.getElementById("email") as HTMLElement).textContent = user.email;
      
      const avatarIndex = user.avatar >= 0 && user.avatar <= 9 ? user.avatar : 0;
      (document.getElementById("user-avatar") as HTMLImageElement).src = `/avatars/${avatarIndex}.png`;
    });

  document.getElementById("return-btn")?.addEventListener("click", () => {
    window.history.back();
  });

  document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "./login.html";
  });

  // Guardar cambios
  const saveBtn = document.getElementById("save-btn");
  saveBtn?.addEventListener("click", async () => {
    const currentUsername = userFromStorage.username;

    const newAvatar = (document.getElementById("new-avatar") as HTMLInputElement).value;
    const newUsername = (document.getElementById("new-username") as HTMLInputElement).value.trim();
    const newEmail = (document.getElementById("new-email") as HTMLInputElement).value.trim();
    const newPassword = (document.getElementById("new-password") as HTMLInputElement).value;
    const confirm = (document.getElementById("confirm-password") as HTMLInputElement).value;
    const errorSpan = document.getElementById("password-error");

    if (newPassword && newPassword !== confirm) {
      errorSpan?.classList.remove("hidden");
      return;
    } else {
      errorSpan?.classList.add("hidden");
    }

    try {
      const response = await fetch("http://localhost:3000/auth/update-profile", {
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

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify({ username: newUsername || currentUsername }));
        window.location.href = "./settings.html";
      } else {
        alert(result.error || "No se pudo actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al conectar con el servidor.");
    }
  });

  const deleteBtn = document.getElementById("delete-account-btn");
  deleteBtn?.addEventListener("click", async () => {
    const username = JSON.parse(localStorage.getItem("user")!).username;

    const response = await fetch("http://localhost:3000/auth/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.removeItem("user");
      window.location.href = "./index.html";
    } else {
      alert(result.error || "Error deleting account");
    }
  });
});
