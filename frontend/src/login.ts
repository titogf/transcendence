const existingUser = localStorage.getItem("user");
if (existingUser) window.location.href = "profile.html";

const loginForm = document.getElementById("login-form") as HTMLFormElement;
const usernameInput = document.getElementById("username") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const errorMsg = document.getElementById("error-msg") as HTMLParagraphElement;
const retBtn = document.getElementById("return-btn");
const hmBtn = document.getElementById("home-btn");
const registerLink = document.getElementById("register-link");

function shakeError(message: string) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden", "shake");
  void errorMsg.offsetWidth;
  errorMsg.classList.add("shake");
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "index.html";
    } else {
      shakeError("Usuario o contraseña incorrectos");
    }
  } catch (err) {
    shakeError("Error de conexión");
  }
});

retBtn?.addEventListener("click", () => window.history.back());
hmBtn?.addEventListener("click", () => window.location.href = "index.html");
registerLink?.addEventListener("click", () => window.location.href = "register.html");

(window as any).handleGoogleSignIn = async (response: any) => {
  try {
    const idToken = response.credential;

    const res = await fetch("http://localhost:3000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    if (!res.ok) {
      throw new Error("Error validando con Google");
    }

    const userData = await res.json();
    localStorage.setItem("user", JSON.stringify(userData));
    window.location.href = "index.html";
  } catch (err) {
    console.error("Error autenticando con Google:", err);
    shakeError("Error autenticando con Google");
  }
};
