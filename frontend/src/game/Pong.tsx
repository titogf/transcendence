import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Pong: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
    let player1Y = 150, player2Y = 150;
    let ballX = 400, ballY = 200, ballSpeedX = 8, ballSpeedY = 5;
    let wKeyPressed = false, sKeyPressed = false, upKeyPressed = false, downKeyPressed = false;

    const navigate = useNavigate();

    const username = localStorage.getItem("username");


    useEffect(() => {
        if (!gameStarted || winner) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "w") wKeyPressed = true;
            if (event.key === "s") sKeyPressed = true;
            if (event.key === "ArrowUp") { upKeyPressed = true; event.preventDefault(); };
            if (event.key === "ArrowDown") { downKeyPressed = true; event.preventDefault(); }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === "w") wKeyPressed = false;
            if (event.key === "s") sKeyPressed = false;
            if (event.key === "ArrowUp") { upKeyPressed = false; event.preventDefault(); }
            if (event.key === "ArrowDown") { downKeyPressed = false; event.preventDefault(); }
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

            if (!winner) {
                ctx.beginPath();
                ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            if (wKeyPressed && player1Y > 0) player1Y -= 10;
            if (sKeyPressed && player1Y < canvas.height - paddleHeight) player1Y += 10;
            if (upKeyPressed && player2Y > 0) player2Y -= 10;
            if (downKeyPressed && player2Y < canvas.height - paddleHeight) player2Y += 10;

            ballX += ballSpeedX;
            ballY += ballSpeedY;

            if (ballY < 0 || ballY > canvas.height) ballSpeedY = -ballSpeedY;

            if (ballX - ballRadius <= paddleWidth && ballY >= player1Y && ballY <= player1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            }
            if (ballX + ballRadius >= canvas.width - paddleWidth && ballY >= player2Y && ballY <= player2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            }

            if (ballX <= 0) {
                setPlayer2Score(prev => {
                    const newScore = prev + 1;
                    if (newScore === 5) {
                        setWinner("Jugador 2");
                        stopGame();
                    } else resetBalltoPlayer1();
                    return newScore;
                });
            }

            if (ballX >= canvas.width) {
                setPlayer1Score(prev => {
                    const newScore = prev + 1;
                    if (newScore === 5) {
                        setWinner("Jugador 1");
                        stopGame();
                    } else resetBalltoPlayer2();
                    return newScore;
                });
            }

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        const resetBalltoPlayer1 = () => {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = -8;
            ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5;
        };
        const resetBalltoPlayer2 = () => {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 8;
            ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5;
        };

        const stopGame = () => {
            setGameStarted(false);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };

        gameLoop();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [gameStarted, winner]);

    const resetGame = () => {
        setPlayer1Score(0);
        setPlayer2Score(0);
        setWinner(null);
        setGameStarted(true);
        player1Y = 150;
        player2Y = 150;
        ballX = 400;
        ballY = 200;
        ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 8;
        ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5;
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center text-center">
          <div className="w-full flex justify-between items-center px-6 py-4 absolute top-0">
            <span className="text-[#00d9ff] font-bold">👤 {username}</span>
            <button
              onClick={handleLogout}
              className="bg-[#00d9ff] text-[#1e1e1e] px-4 py-2 rounded-md font-bold hover:bg-[#00a6c4] transition"
            >
              Logout
            </button>
          </div>
      
          <h1 className="text-5xl text-[#00d9ff] mb-6">Pong</h1>
      
          {winner ? (
            <div className="space-y-6">
              <h2 className="text-3xl text-[#00ff99] font-bold">{winner} ha ganado!</h2>
              <button
                onClick={resetGame}
                className="bg-[#00d9ff] text-[#1e1e1e] px-6 py-3 rounded-lg text-lg font-bold hover:bg-[#00a6c4] transition"
              >
                Restart game
              </button>
            </div>
          ) : (
            <>
              {!gameStarted && (
                <button
                  onClick={resetGame}
                  className="bg-[#00d9ff] text-[#1e1e1e] px-6 py-3 rounded-lg text-lg font-bold hover:bg-[#00a6c4] transition mb-6"
                >
                  Start game
                </button>
              )}
      
              <div id="scoreboard" className="text-2xl font-bold mb-4">
                {player1Score} - {player2Score}
              </div>
      
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="bg-black border-4 border-[#00d9ff] w-full max-w-[1000px] h-auto"
              />
            </>
          )}
        </div>
    );
};

export default Pong;

