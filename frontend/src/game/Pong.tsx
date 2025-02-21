import React, { useRef, useState, useEffect } from "react";
import "./pong.css";

const Pong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Y, setPlayer1Y] = useState(150);
  const [player2Y, setPlayer2Y] = useState(150);
  const [ballX, setBallX] = useState(400);
  const [ballY, setBallY] = useState(200);
  const [ballSpeedX, setBallSpeedX] = useState(10);
  const [ballSpeedY, setBallSpeedY] = useState(6);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [wKeyPressed, setWKeyPressed] = useState(false);
  const [sKeyPressed, setSKeyPressed] = useState(false);
  const [upKeyPressed, setUpKeyPressed] = useState(false);
  const [downKeyPressed, setDownKeyPressed] = useState(false);

  const paddleWidth = 10;
  const paddleHeight = 100;
  const ballRadius = 10;

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const drawEverything = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00d9ff";
      ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, false);
      ctx.fill();
    };

    const moveBall = () => {
      setBallX((prevX) => prevX + ballSpeedX);
      setBallY((prevY) => prevY + ballSpeedY);

      if (ballY < 0 || ballY > canvas.height) setBallSpeedY(-ballSpeedY);
      if (ballX < 0 || ballX > canvas.width) setBallSpeedX(-ballSpeedX);
    };

    const movePaddles = () => {
      if (wKeyPressed && player1Y > 0) setPlayer1Y((prev) => prev - 10);
      if (sKeyPressed && player1Y < canvas.height - paddleHeight) setPlayer1Y((prev) => prev + 10);
      if (upKeyPressed && player2Y > 0) setPlayer2Y((prev) => prev - 10);
      if (downKeyPressed && player2Y < canvas.height - paddleHeight) setPlayer2Y((prev) => prev + 10);
    };

    const checkCollision = () => {
      if (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
        setBallSpeedX(-ballSpeedX);
      }
      if (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
        setBallSpeedX(-ballSpeedX);
      }
    };

    const updateScore = () => {
      if (ballX < 0) {
        setPlayer2Score((prev) => prev + 1);
        resetBall();
      }
      if (ballX > canvas.width) {
        setPlayer1Score((prev) => prev + 1);
        resetBall();
      }
    };

    const resetBall = () => {
      setBallX(400); // Centra la bola en el medio del canvas
      setBallY(200); // Centra la bola en el medio del canvas
    
      // Deberíamos usar una actualización en función del estado anterior para ballSpeedX y ballSpeedY
      setBallSpeedX(prevSpeedX => (Math.random() < 0.5 ? 1 : -1) * 4);
      setBallSpeedY(prevSpeedY => (Math.random() < 0.5 ? 1 : -1) * 2);
    };
    
    

    const showWinner = () => {
      setGameStarted(false);
      alert(`¡${player1Score === 5 ? "Jugador 1" : "Jugador 2"} ha ganado!`);
    };

    const gameLoop = () => {
      if (!gameStarted) return;
      drawEverything();
      moveBall();
      movePaddles();
      checkCollision();
      updateScore();

      if (player1Score === 5 || player2Score === 5) {
        showWinner();
      } else {
        requestAnimationFrame(gameLoop);
      }
    };

    requestAnimationFrame(gameLoop);
  }, [gameStarted, ballX, ballY, ballSpeedX, ballSpeedY, player1Y, player2Y, player1Score, player2Score]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "w") setWKeyPressed(true);
      if (event.key === "s") setSKeyPressed(true);
      if (event.key === "ArrowUp") setUpKeyPressed(true);
      if (event.key === "ArrowDown") setDownKeyPressed(true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "w") setWKeyPressed(false);
      if (event.key === "s") setSKeyPressed(false);
      if (event.key === "ArrowUp") setUpKeyPressed(false);
      if (event.key === "ArrowDown") setDownKeyPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setPlayer1Score(0);
    setPlayer2Score(0);
    resetBall();
  };

  return (
    <div className="pong-container">
      <canvas ref={canvasRef} width="800" height="400" className="pong-canvas"></canvas>
      {!gameStarted && <button onClick={startGame}>Iniciar Juego</button>}
      <div className="scoreboard">
        <span>Jugador 1: {player1Score}</span> - <span>Jugador 2: {player2Score}</span>
      </div>
    </div>
  );
};

export default Pong;
