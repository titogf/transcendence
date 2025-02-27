import React, { useRef, useEffect, useState } from "react";
import "./pong.css";

const Pong: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
    let player1Y = 150, player2Y = 150;
    let ballX = 400, ballY = 200, ballSpeedX = 8, ballSpeedY = 5;
    let wKeyPressed = false, sKeyPressed = false, upKeyPressed = false, downKeyPressed = false;
    
    useEffect(() => {
        if (!gameStarted || winner) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "w") wKeyPressed = true;
            if (event.key === "s") sKeyPressed = true;
            if (event.key === "ArrowUp") {upKeyPressed = true; event.preventDefault();}
            if (event.key === "ArrowDown") {downKeyPressed = true; event.preventDefault();}
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === "w") wKeyPressed = false;
            if (event.key === "s") sKeyPressed = false;
            if (event.key === "ArrowUp") {upKeyPressed = false; event.preventDefault();}
            if (event.key === "ArrowDown") {downKeyPressed = false; event.preventDefault();}
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const gameLoop = () => {
            if (!gameStarted || winner) return;

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#00d9ff";
            ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
            ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

            ctx.beginPath();
            ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
            ctx.fill();

            if (wKeyPressed && player1Y > 0) player1Y -= 10;
            if (sKeyPressed && player1Y < canvas.height - paddleHeight) player1Y += 10;
            if (upKeyPressed && player2Y > 0) player2Y -= 10;
            if (downKeyPressed && player2Y < canvas.height - paddleHeight) player2Y += 10;

            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if (ballY < 0 || ballY > canvas.height) ballSpeedY = -ballSpeedY;

            if (ballX - ballRadius < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            }
            if (ballX + ballRadius > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            }

            if (ballX < 0) {
                setPlayer2Score(prev => prev + 1);
                resetBall();
            }
            if (ballX > canvas.width) {
                setPlayer1Score(prev => prev + 1);
                resetBall();
            }

            if (player1Score === 5 || player2Score === 5) {
              setWinner(player1Score === 5 ? "Jugador 1" : "Jugador 2");
              setGameStarted(false); // Detener el juego
              return;
            }

            requestAnimationFrame(gameLoop);
        };

        const resetBall = () => {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = -ballSpeedX;
            ballSpeedY = 5;
        };

        if (gameStarted && !winner)
          gameLoop();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameStarted, winner]);

    useEffect(() => {
      if (player1Score === 5) {
          setWinner("Jugador 1");
          setGameStarted(false);
      } else if (player2Score === 5) {
          setWinner("Jugador 2");
          setGameStarted(false);
      }
  }, [player1Score, player2Score]);
    return (
        <div style={{ textAlign: "center", color: "#ffffff" }}>
            <h1 style={{ color: "#00d9ff" }}>Pong</h1>
            {!gameStarted && !winner && (
                <button onClick={() => setGameStarted(true)}>Iniciar Juego</button>
            )}
            {winner && (
              <div>
                  <h2>{winner} ha ganado!</h2>
                  <button onClick={() => {
                      // Reiniciar juego
                      setPlayer1Score(0);
                      setPlayer2Score(0);
                      setWinner(null);
                      setGameStarted(true);  // Esto hace que el juego se reinicie
                      player1Y = 150;  // Resetear posiciones de las palas
                      player2Y = 150;
                      ballX = 400;  // Resetear pelota
                      ballY = 200;
                  }}>Reiniciar Juego</button>
              </div>
            )}
            <div id="scoreboard" style={{ fontSize: "1.5em", marginBottom: "10px", fontWeight: "bold" }}>
                {player1Score} - {player2Score}
            </div>
            <canvas ref={canvasRef} width={800} height={400} style={{ backgroundColor: "#000", border: "2px solid #00d9ff" }} />
        </div>
    );
};

export default Pong;
