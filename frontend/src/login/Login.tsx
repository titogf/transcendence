import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 👈 Esto evita el refresco de página
    const success = await login(username, password);
    if (success) {
      navigate("/"); // Redirige al home si el login es correcto
    } else {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center px-4">
      <h2 className="text-4xl font-bold text-[#00d9ff] mb-8">Iniciar sesión</h2>
  
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md bg-[#2a2a2a] p-8 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="px-4 py-3 rounded-md bg-[#1e1e1e] border border-[#00d9ff] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-md bg-[#1e1e1e] border border-[#00d9ff] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d9ff]"
        />
        <button
          type="submit"
          className="bg-[#00d9ff] text-[#1e1e1e] py-3 px-6 rounded-md font-bold hover:bg-[#00a6c4] transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );  
};

export default Login;

