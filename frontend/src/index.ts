window.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-btn") as HTMLButtonElement | null;
  const loginBtn = document.getElementById("singin-btn") as HTMLButtonElement | null;
  const tournamentBtn = document.getElementById("tournament-btn") as HTMLButtonElement | null;

  // Si hay usuario logueado en localStorage, mostrar botón perfil
  const userStr = localStorage.getItem("user");
  if (userStr && loginBtn) {
    const user = JSON.parse(userStr);

    // Cambiamos el botón login por el de perfil
    loginBtn.textContent = user.username; // o "Profile"
    loginBtn.innerHTML = `👤 ${user.username}`; // con icono usuario

    // Cambiamos la acción para ir a profile.html (o ruta de perfil)
    loginBtn.onclick = () => {
      window.location.href = "./profile.html";
    };
  } else if (loginBtn) {
    // Si no hay usuario logueado, botón va a login
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
});
