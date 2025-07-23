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
        const res = await fetch("http://localhost:3000/auth/add-friend", {
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
  fetch(`http://localhost:3000/auth/user-friends/${username}`)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then((data) => {
      if (!listContainer || !noFriendsMsg) return;
      listContainer.innerHTML = "";

    if (data && data.length > 0) {
        data.forEach((friend: any) => {
        const friendItem = document.createElement("li");
        friendItem.textContent = "🔴 Offline   " + friend;
        friendItem.addEventListener("click", () => {
            window.location.href = `./profile.html?user=${friend}`;
        });
        friendItem.classList.add("text-white", "hover:text-[#00ff99]", "cursor-pointer", "hover:underline");
        listContainer?.appendChild(friendItem);
        });
        noFriendsMsg?.classList.add("hidden");
    }
    else {
        noFriendsMsg?.classList.remove("hidden");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      if (noFriendsMsg) {
        noFriendsMsg.textContent = "Could not load friends.";
        noFriendsMsg.classList.remove("hidden");
      }
    });
});

document.getElementById("return-btn")?.addEventListener("click", () => {
    window.history.back();
  });

  document.getElementById("home-btn")?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });
