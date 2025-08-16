window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const username = user.username;
  const input = document.getElementById("friend-username") as HTMLInputElement | null;
  const error = document.getElementById("friend-error") as HTMLElement | null;
  const addBtn = document.getElementById("add-friend-btn");
  const listContainer = document.getElementById("friends-container");
  const noFriendsMsg = document.getElementById("no-friends");

  document.getElementById("return-btn")?.addEventListener("click", () => {
    window.history.back();
  });

  document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  addBtn?.addEventListener("click", async () => {
    if (!input || !error) return;
    
    const friend = input.value.trim();
    error.classList.add("hidden");
    error.textContent = "";

    if (!friend || friend === username) {
      error.textContent = "Invalid username.";
      error.classList.remove("hidden");
      return;
    }

    try {
      const res = await fetch("https://localhost:3000/auth/add-friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, friend: friend }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      window.location.reload();
      input.value = "";
    } catch (err: any) {
      error.textContent = err.message || "Could not add friend";
      error.classList.remove("hidden");
    }
  });

  // Cargar lista de amigos
  fetch(`https://localhost:3000/auth/user-friends/${username}`)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then((data) => {
      if (!listContainer || !noFriendsMsg) return;
      listContainer.innerHTML = "";

      if (data && data.length > 0) {
        data.forEach((friend: any) => {
          const friendItem = document.createElement("p");
            friendItem.className = "p-0 m-0 flex items-center justify-between hover:bg-[#3a3a3a] cursor-pointer rounded px-2 py-1 transition-colors";
          friendItem.innerHTML = `
            <span class="ml-0 hover:text-[#00a6c4] cursor-pointer hover:underline">${friend}</span>
            <span class="ml-2 px-2 py-0.5 text-xs rounded text-white">🔴 offline</span>`;

          friendItem.querySelector("span")?.addEventListener("click", async (e) => {
            e.stopPropagation();

            try {
              const res = await fetch(`https://localhost:3000/auth/user-info/${friend}`);
              if (!res.ok) throw new Error("Could not load profile");
              const userData = await res.json();

              const avatarIndex = userData.avatar >= 0 ? userData.avatar : 0;
              const avgGoals = userData.matches_played > 0
                ? (userData.goals_scored / userData.matches_played).toFixed(2)
                : "0";
              const winRate = userData.matches_played > 0
                ? ((userData.wins / userData.matches_played) * 100).toFixed(1) + "%"
                : "0%";

              const profileContent = document.getElementById("profile-content");
              if (profileContent) {
                profileContent.innerHTML = `
                  <h2 class="text-2xl font-bold text-[#00ff99] mb-4">👤 ${userData.username}</h2>
                  <img src="/avatars/${avatarIndex}.png" alt="Avatar" class="w-24 h-24 mx-auto rounded-full mb-4">
                  <p><strong>Name:</strong> ${userData.name}</p>
                  <p><strong>Email:</strong> ${userData.email}</p>
                  <p><strong>Matches played:</strong> ${userData.matches_played}</p>
                  <p><strong>Goals per match:</strong> ${avgGoals}</p>
                  <p><strong>Win rate:</strong> ${winRate}</p>
                `;
                document.getElementById("friend-profile")?.classList.remove("hidden");
              }
            } catch (err) {
              console.error("Error loading profile:", err);
            }
          });

          listContainer.appendChild(friendItem);
        });

        noFriendsMsg.classList.add("hidden");
      } else {
        noFriendsMsg.classList.remove("hidden");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      if (noFriendsMsg) {
        noFriendsMsg.textContent = "Could not load friends.";
        noFriendsMsg.classList.remove("hidden");
      }
    });

  document.getElementById("close-profile")?.addEventListener("click", () => {
    document.getElementById("friend-profile")?.classList.add("hidden");
  });

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "./login.html";
  });
  document.getElementById("management-btn")?.addEventListener("click", () => {
    window.location.href = "./settings.html";
  });

  document.getElementById("profile-btn")?.addEventListener("click", () => {
    window.location.href = "./profile.html";
  });
});
