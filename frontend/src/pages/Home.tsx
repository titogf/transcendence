import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Juego Pong</h1>
      <div id="scoreboard" style={{ display: "none" }}>
        <span id="player1-score">0</span> - <span id="player2-score">0</span>
      </div>
      <canvas id="pongCanvas" width="800" height="400" style={{ display: "none" }}></canvas>
      <button onClick={() => navigate("/game")}>Iniciar Juego</button>
    </div>
  );
};

export default Home;
