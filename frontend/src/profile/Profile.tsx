import { useNavigate } from "react-router-dom";
import { useAuth } from "../login/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center text-center font-sans relative">
      {/* Botón de volver */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 bg-[#00d9ff] text-[#1e1e1e] font-bold px-4 py-2 rounded hover:bg-[#00a6c4] transition-colors"
      >
        ⬅ Return
      </button>

      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-[130px] bg-[#00d9ff] text-[#1e1e1e] px-4 py-2 rounded-md font-bold hover:bg-[#00a6c4] transition"
      >
        🏠
      </button>

      <h1 className="text-4xl text-[#00d9ff] mb-6">Perfil</h1>
      <p className="text-xl mb-8">
        Usuario: <span className="font-bold">{user?.username}</span>
      </p>
      <button
        onClick={handleLogout}
        className="bg-[#00d9ff] text-[#1e1e1e] font-bold px-6 py-3 rounded hover:bg-[#00a6c4] transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Profile;

