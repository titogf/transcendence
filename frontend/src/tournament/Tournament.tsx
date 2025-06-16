import React, { useEffect, useRef, useState } from "react";
import PongTournament from "./PongGame";

type Match = {
  player1: string;
  player2: string;
};

export default function Tournament() {
  const [step, setStep] = useState<"setup" | "game" | "result">("setup");
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [roundWinners, setRoundWinners] = useState<string[]>([]);
  const [finalWinner, setFinalWinner] = useState<string | null>(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==== GAME LOGIC ====

  // useEffect(() => {
  //   if (step !== "game") return;

  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   canvas.width = 800;
  //   canvas.height = 400;

  //   const paddleWidth = 10;
  //   const paddleHeight = 80;
  //   const ballSize = 10;

  //   let paddle1Y = canvas.height / 2 - paddleHeight / 2;
  //   let paddle2Y = canvas.height / 2 - paddleHeight / 2;

  //   const paddleSpeed = 5;

  //   let ballX = canvas.width / 2;
  //   let ballY = canvas.height / 2;
  //   let ballSpeedX = 3;
  //   let ballSpeedY = 3;

  //   const keys: { [key: string]: boolean } = {};

  //   const resetBall = () => {
  //     ballX = canvas.width / 2;
  //     ballY = canvas.height / 2;
  //     ballSpeedX = -ballSpeedX;
  //     ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
  //   };

  //   const draw = () => {
  //     ctx.fillStyle = "black";
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);

  //     ctx.setLineDash([5, 5]);
  //     ctx.beginPath();
  //     ctx.moveTo(canvas.width / 2, 0);
  //     ctx.lineTo(canvas.width / 2, canvas.height);
  //     ctx.strokeStyle = "white";
  //     ctx.stroke();
  //     ctx.setLineDash([]);

  //     ctx.fillStyle = "white";
  //     ctx.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
  //     ctx.fillRect(canvas.width - 20, paddle2Y, paddleWidth, paddleHeight);
  //     ctx.fillRect(ballX, ballY, ballSize, ballSize);

  //     ctx.font = "30px Arial";
  //     ctx.fillText(matches[currentMatchIndex]?.player1 || "", canvas.width / 4 - 50, 30);
  //     ctx.fillText(matches[currentMatchIndex]?.player2 || "", (canvas.width * 3) / 4 - 50, 30);
  //     ctx.fillText(String(player1Score), canvas.width / 4, 60);
  //     ctx.fillText(String(player2Score), (canvas.width * 3) / 4, 60);
  //   };

  //   const update = () => {
  //     if (keys["w"] && paddle1Y > 0) paddle1Y -= paddleSpeed;
  //     if (keys["s"] && paddle1Y < canvas.height - paddleHeight)
  //       paddle1Y += paddleSpeed;
  //     if (keys["ArrowUp"] && paddle2Y > 0) paddle2Y -= paddleSpeed;
  //     if (keys["ArrowDown"] && paddle2Y < canvas.height - paddleHeight)
  //       paddle2Y += paddleSpeed;

  //     ballX += ballSpeedX;
  //     ballY += ballSpeedY;

  //     if (ballY <= 0 || ballY + ballSize >= canvas.height)
  //       ballSpeedY = -ballSpeedY;

  //     if (
  //       ballX <= 20 &&
  //       ballY + ballSize >= paddle1Y &&
  //       ballY <= paddle1Y + paddleHeight
  //     ) {
  //       ballSpeedX = -ballSpeedX;
  //       ballX = 20;
  //     }

  //     if (
  //       ballX + ballSize >= canvas.width - 20 &&
  //       ballY + ballSize >= paddle2Y &&
  //       ballY <= paddle2Y + paddleHeight
  //     ) {
  //       ballSpeedX = -ballSpeedX;
  //       ballX = canvas.width - 20 - ballSize;
  //     }

  //     if (ballX <= 0) {
  //       setPlayer2Score((s) => s + 1);
  //       resetBall();
  //     }

  //     if (ballX + ballSize >= canvas.width) {
  //       setPlayer1Score((s) => s + 1);
  //       resetBall();
  //     }
  //   };

  //   const gameLoop = () => {
  //     update();
  //     draw();

  //     if (player1Score >= 5) {
  //       declareWinner(matches[currentMatchIndex].player1);
  //       return;
  //     }

  //     if (player2Score >= 5) {
  //       declareWinner(matches[currentMatchIndex].player2);
  //       return;
  //     }

  //     requestAnimationFrame(gameLoop);
  //   };

  //   gameLoop();

  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     keys[e.key] = true;
  //   };
  //   const handleKeyUp = (e: KeyboardEvent) => {
  //     keys[e.key] = false;
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   window.addEventListener("keyup", handleKeyUp);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //     window.removeEventListener("keyup", handleKeyUp);
  //   };
  // }, [step, player1Score, player2Score, currentMatchIndex]);
  //game hasta aqui

  const declareWinner = (winner: string) => {
    const nextWinners = [...roundWinners, winner];
    setRoundWinners(nextWinners);

    if (currentMatchIndex + 1 < matches.length) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      setPlayer1Score(0);
      setPlayer2Score(0);
    } else {
      // Next round or final
      if (nextWinners.length === 1) {
        setFinalWinner(nextWinners[0]);
        setStep("result");
      } else {
        const nextMatches: Match[] = [];
        for (let i = 0; i < nextWinners.length; i += 2) {
          nextMatches.push({
            player1: nextWinners[i],
            player2: nextWinners[i + 1],
          });
        }
        setMatches(nextMatches);
        setCurrentMatchIndex(0);
        setRoundWinners([]);
        setPlayer1Score(0);
        setPlayer2Score(0);
      }
    }
  };

  const handleStartTournament = () => {
    const shuffled = [...playerNames];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const generatedMatches: Match[] = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      generatedMatches.push({
        player1: shuffled[i],
        player2: shuffled[i + 1],
      });
    }

    setMatches(generatedMatches);
    setStep("game");
  };

  // ==== UI ====

  if (step === "setup") {
    return (
      <div className="flex flex-col items-center text-white bg-gray-900 min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">Configurar Torneo</h1>
        <label className="mb-2">Número de jugadores (múltiplo de 2):</label>
        <input
          type="number"
          value={numPlayers}
          onChange={(e) => setNumPlayers(parseInt(e.target.value))}
          min={2}
          max={16}
          className="text-black mb-4 p-2"
        />
        {Array.from({ length: numPlayers }, (_, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Jugador ${i + 1}`}
            value={playerNames[i] || ""}
            onChange={(e) => {
              const newNames = [...playerNames];
              newNames[i] = e.target.value;
              setPlayerNames(newNames);
            }}
            className="text-black mb-2 p-2"
          />
        ))}
        <button
          onClick={handleStartTournament}
          className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
        >
          Empezar Torneo
        </button>
      </div>
    );
  }

  if (step === "game") {
    const currentMatch = matches[currentMatchIndex];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h2 className="text-2xl mb-2">
          {currentMatch.player1} vs {currentMatch.player2}
        </h2>
        <p className="mb-2">Primer a 5 puntos</p>
        <p className="mb-4">Controles: W/S y ↑/↓</p>
  
        <PongTournament
          player1={currentMatch.player1}
          player2={currentMatch.player2}
          onGameEnd={(winner) => {
          console.log("Ganó", winner);
          //funciona y sale en consola quien ha ganado, hay que hacer que sigan todas las partidas
          }}
        />
      </div>
    );
  }

  if (step === "result" && finalWinner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">¡Campeón del Torneo!</h1>
        <h2 className="text-2xl">{finalWinner}</h2>
        <button
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          onClick={() => {
            setStep("setup");
            setPlayerNames([]);
            setMatches([]);
            setCurrentMatchIndex(0);
            setRoundWinners([]);
            setFinalWinner(null);
            setPlayer1Score(0);
            setPlayer2Score(0);
          }}
        >
          Volver a empezar
        </button>
      </div>
    );
  }

  return null;
}
