import React, { useRef, useEffect, useState } from "react";

interface PongTournamentProps {
  player1: string;
  player2: string;
  onGameEnd: (winner: string) => void;
}

const PongTournament: React.FC<PongTournamentProps> = ({
  player1,
  player2,
  onGameEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const ballMoving = useRef(false);


  const paddleWidth = 10, paddleHeight = 100, ballRadius = 10;
  const player1Y = useRef(150);
  const player2Y = useRef(150);
  const ballX = useRef(400);
  const ballY = useRef(200);
  const ballSpeedX = useRef(8);
  const ballSpeedY = useRef(5);

  let wKeyPressed = false, sKeyPressed = false, upKeyPressed = false, downKeyPressed = false;

  const startCountdown = () => {
    ballMoving.current = false;
    let counter = 3;
    setCountdown(counter);
    const interval = setInterval(() => {
      counter--;
      if (counter === 0) {
        clearInterval(interval);
        setCountdown(null);
        ballMoving.current = true;
      } else {
        setCountdown(counter);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!gameStarted || winner) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w") wKeyPressed = true;
      if (e.key === "s") sKeyPressed = true;
      if (e.key === "ArrowUp") { upKeyPressed = true; e.preventDefault(); }
      if (e.key === "ArrowDown") { downKeyPressed = true; e.preventDefault(); }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w") wKeyPressed = false;
      if (e.key === "s") sKeyPressed = false;
      if (e.key === "ArrowUp") { upKeyPressed = false; e.preventDefault(); }
      if (e.key === "ArrowDown") { downKeyPressed = false; e.preventDefault(); }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const resetBall = (toLeft: boolean) => {
      ballX.current = canvas.width / 2;
      ballY.current = canvas.height / 2;
      ballSpeedX.current = (toLeft ? -8 : 8);
      ballSpeedY.current = (Math.random() > 0.5 ? 1 : -1) * 5;
    };

    const stopGame = () => {
      setGameStarted(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const gameLoop = () => {
      if (!gameStarted || winner) return;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00d9ff";
      ctx.fillRect(0, player1Y.current, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, player2Y.current, paddleWidth, paddleHeight);

      if (!winner) {
        ctx.beginPath();
        ctx.arc(ballX.current, ballY.current, ballRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (wKeyPressed && player1Y.current > 0) player1Y.current -= 10;
      if (sKeyPressed && player1Y.current < canvas.height - paddleHeight) player1Y.current += 10;
      if (upKeyPressed && player2Y.current > 0) player2Y.current -= 10;
      if (downKeyPressed && player2Y.current < canvas.height - paddleHeight) player2Y.current += 10;

      if (ballMoving.current) {
        ballX.current += ballSpeedX.current;
        ballY.current += ballSpeedY.current;
      }

      if (ballY.current - ballRadius <= 0 || ballY.current + ballRadius >= canvas.height) {
        ballSpeedY.current = -ballSpeedY.current;
        ballY.current = Math.max(ballRadius, Math.min(ballY.current, canvas.height - ballRadius));
      }

      if (
        ballX.current - ballRadius <= paddleWidth &&
        ballY.current >= player1Y.current &&
        ballY.current <= player1Y.current + paddleHeight
      ) {
        ballX.current = paddleWidth + ballRadius + 1;
        ballSpeedX.current = -ballSpeedX.current;
      }

      if (
        ballX.current + ballRadius >= canvas.width - paddleWidth &&
        ballY.current >= player2Y.current &&
        ballY.current <= player2Y.current + paddleHeight
      ) {
        ballX.current = canvas.width - paddleWidth - ballRadius - 1;
        ballSpeedX.current = -ballSpeedX.current;
      }

      if (ballX.current <= 0) {
        setPlayer2Score(prev => {
          const newScore = prev + 1;
          if (newScore === 5) {
            setWinner(player2);
            stopGame();
            onGameEnd(player2);
          } else {
            resetBall(true);
            startCountdown();
          }
          return newScore;
        });
      }

      if (ballX.current >= canvas.width) {
        setPlayer1Score(prev => {
          const newScore = prev + 1;
          if (newScore === 5) {
            setWinner(player1);
            stopGame();
            onGameEnd(player1);
          } else {
            resetBall(false);
            startCountdown();
          }
          return newScore;
        });
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, winner]);

  useEffect(() => {
    if (gameStarted && !winner) {
      startCountdown();
    }
  }, [gameStarted]);

  const resetGame = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    setGameStarted(true);
    player1Y.current = 150;
    player2Y.current = 150;
    ballX.current = 400;
    ballY.current = 200;
    ballSpeedX.current = (Math.random() > 0.5 ? 1 : -1) * 8;
    ballSpeedY.current = (Math.random() > 0.5 ? 1 : -1) * 5;
  };

  useEffect(() => {
    resetGame();
  }, []);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="bg-black border-4 border-[#00d9ff] block"
      />
      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center text-[80px] font-bold text-[#00ff99]">
          {countdown}
        </div>
      )}
    </div>
  );
};

export default PongTournament;


