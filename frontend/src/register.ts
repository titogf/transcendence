// register.ts

const form = document.getElementById("register-form") as HTMLFormElement;
const errorMessage = document.getElementById("error-message")!;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const usernameI = document.getElementById("username") as HTMLInputElement;
const passwordI = document.getElementById("password") as HTMLInputElement;
const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement;

document.getElementById("to-login")?.addEventListener("click", () => {
  window.location.href = "login.html";
});

form.addEventListener("submit", async (e) => {
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
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error en el registro");
    }

    window.location.href = "login.html";
  } catch (err: any) {
    showError(err.message || "Error desconocido");
  }
});

function showError(message: string) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  errorMessage.classList.add("shake");

  setTimeout(() => {
    errorMessage.classList.remove("shake");
  }, 500);
}
