window.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("play-btn") as HTMLButtonElement | null;
  const loginBtn = document.getElementById("singin-btn") as HTMLButtonElement | null;
  const tournamentBtn = document.getElementById("tournament-btn") as HTMLButtonElement | null;
  const play4Btn = document.getElementById("play4-btn") as HTMLButtonElement | null;
  const playAiBtn = document.getElementById("play-ai-btn") as HTMLButtonElement | null;
  const userAvatar = document.getElementById("user-avatar") as HTMLImageElement | null;

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
              } else {
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
  } else if (loginBtn) {
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
    tournamentBtn?.addEventListener("click", () => {
      window.location.href = "./tournament.html";
    });
  }

  if (play4Btn) {
    play4Btn?.addEventListener("click", () => {
      window.location.href = "./play4.html";
    });
  }
});
