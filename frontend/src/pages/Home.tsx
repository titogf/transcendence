import React from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../login/AuthContext";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center text-center relative font-sans">
      <div className="absolute top-5 right-5">
      {user ? (
        <button
          onClick={() => navigate("/profile")}
          className="bg-[#00d9ff] text-[#1e1e1e] font-bold px-4 py-2 rounded hover:bg-[#00a6c4] transition-colors"
        >
          👤 {user.username}
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-[#00d9ff] text-[#1e1e1e] font-bold px-4 py-2 rounded hover:bg-[#00a6c4] transition-colors"
        >
          Sign in/Register
        </button>
      )}
      </div>

      <h1 className="text-6xl text-[#00d9ff] mb-2">PONG GAME</h1>

      <div id="scoreboard" className="text-2xl font-bold mb-5 hidden">
        <span id="player1-score">0</span> - <span id="player2-score">0</span>
      </div>

      <canvas
        id="pongCanvas"
        width="800"
        height="400"
        className="bg-black border-4 border-[#00d9ff] mt-8 w-full max-w-[1000px] h-auto hidden"
      ></canvas>

      <button
        onClick={() => navigate("/game")}
        className="bg-[#00d9ff] text-[#1e1e1e] px-10 py-5 text-xl rounded-xl mt-8 hover:bg-[#00a6c4] transition-colors"
      >
        Play game
      </button>
    </div>
  );
};
export default Home;

