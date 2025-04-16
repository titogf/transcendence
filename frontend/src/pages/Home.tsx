import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container">
      <div className="top-bar">
        {user ? (
          <span>Bienvenido, {user.username}</span>
        ) : (
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
        )}
      </div>

      <h1>PONG GAME</h1>
      <div id="scoreboard" style={{ display: "none" }}>
        <span id="player1-score">0</span> - <span id="player2-score">0</span>
      </div>
      <canvas id="pongCanvas" width="800" height="400" style={{ display: "none" }}></canvas>
      <button onClick={() => navigate("/game")}>Play game</button>
    </div>
  );
};

export default Home;

