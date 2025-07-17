window.addEventListener("DOMContentLoaded", () => {
  const userFromStorage = JSON.parse(localStorage.getItem("user") || "null");
  if (!userFromStorage) {
    window.location.href = "./login.html";
    return;
  }

  // Botones de navegación
  document.getElementById("return-btn")?.addEventListener("click", () => {
    window.history.back();
  });

  document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  // Guardar cambios
  const saveBtn = document.getElementById("save-btn");
  saveBtn?.addEventListener("click", async () => {
    const currentUsername = userFromStorage.username;

    const newUsername = (document.getElementById("new-username") as HTMLInputElement).value.trim();
    const newEmail = (document.getElementById("new-email") as HTMLInputElement).value.trim();
    const newPassword = (document.getElementById("new-password") as HTMLInputElement).value;

    try {
      const response = await fetch("http://localhost:3000/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUsername,
          newUsername,
          newEmail,
          newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Perfil actualizado correctamente.");
        localStorage.setItem("user", JSON.stringify({ username: newUsername || currentUsername }));
        window.location.href = "./profile.html";
      } else {
        alert(result.error || "No se pudo actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al conectar con el servidor.");
    }
  });
});
