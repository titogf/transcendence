import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../animations/shake.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const goBack = () => {
    if (from) navigate(from);
    else navigate(-1); // fallback si no hay una ruta previa
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      setError("");
      navigate("/");
    } else {
      setError("Usuario o contraseña incorrectos");
      setShake(false); // reinicia animación
      void setTimeout(() => setShake(true), 0); // fuerza el re-render para reiniciar la clase
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center px-4 relative">
      {/* Botón de volver */}
      <button
        onClick={goBack}
        className="absolute top-5 left-5 bg-[#00d9ff] text-[#1e1e1e] px-4 py-2 rounded-md font-bold hover:bg-[#00a6c4] transition"
      >
        ⬅ Return
      </button>

      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-[135px] bg-[#00d9ff] text-[#1e1e1e] px-4 py-2 rounded-md font-bold hover:bg-[#00a6c4] transition"
      >
        🏠
      </button>

      <h2 className="text-4xl font-bold text-[#00d9ff] mb-8 mt-12">Sign in</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md bg-[#2a2a2a] p-8 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="User or email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="px-4 py-3 rounded-md bg-[#1e1e1e] border border-[#00d9ff] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-md bg-[#1e1e1e] border border-[#00d9ff] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
        />
        <button
          type="submit"
          className="bg-[#00d9ff] text-[#1e1e1e] py-3 px-6 rounded-md font-bold hover:bg-[#00a6c4] transition"
        >
          Sign in
        </button>

        {/* Nuevo bloque "or Register" */}
        <div className="text-center text-sm text-gray-400">
          or{" "}
          <span
            onClick={() => navigate("/register", { state: { from: location.pathname } })}
            className="text-[#00d9ff] cursor-pointer hover:underline font-semibold"
          >
            Register
          </span>
        </div>

        {/* Mensaje de error */}
        {error && (
          <p
            className={`text-red-500 text-sm font-semibold text-center ${
              shake ? "shake" : ""
            }`}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;