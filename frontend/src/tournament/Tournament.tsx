import React, { useState } from 'react';

type Rounds = [string, string][][];

const shufflePairs = (players: string[]): [string, string][] => {
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const pairs: [string, string][] = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
    } else {
      pairs.push([shuffled[i], 'BYE']);
    }
  }
  return pairs;
};

const Tournament: React.FC = () => {
  const [numPlayers, setNumPlayers] = useState<number>(0);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [inputNames, setInputNames] = useState<string[]>([]);
  const [rounds, setRounds] = useState<Rounds>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [matchWinners, setMatchWinners] = useState<{ [key: number]: string }>({});

  const handleNumPlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10);
    setNumPlayers(n);
    setInputNames(Array(n).fill(''));
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...inputNames];
    newNames[index] = value;
    setInputNames(newNames);
  };

  const handleSubmitNames = () => {
    const validNames = inputNames.map(name => name.trim()).filter(name => name !== '');
    if (validNames.length < 2) {
      alert('Debe haber al menos 2 jugadores.');
      return;
    }
    setPlayerNames(validNames);
    const initialPairs = shufflePairs(validNames);
    setRounds([initialPairs]);
    setCurrentRound(0);
    setMatchWinners({});
    setWinner(null);
  };

  const handleWinner = (index: number, name: string) => {
    setMatchWinners(prev => ({ ...prev, [index]: name }));
  };

  const nextRound = () => {
    const currentPairs = rounds[currentRound];
    const winners = currentPairs.map((_, i) =>
      matchWinners[i] ? matchWinners[i] : simulateMatch(currentPairs[i])
    );
    const nextPairs = shufflePairs(winners);
    const newRounds = [...rounds, nextPairs];
    setRounds(newRounds);
    setMatchWinners({});
    setCurrentRound(currentRound + 1);

    if (nextPairs.length === 1 && nextPairs[0][1] !== 'BYE') {
      setWinner(null); // Aún no jugado
    }

    if (nextPairs.length === 1 && nextPairs[0][1] === 'BYE') {
      setWinner(nextPairs[0][0]);
    }
  };

  const allMatchesResolved = () => {
    const currentPairs = rounds[currentRound];
    return currentPairs.every((_, i) => matchWinners[i]);
  };

  const renderGame = (index: number, p1: string, p2: string) => {
    if (matchWinners[index]) {
      return <div className="text-green-600">Ganador: {matchWinners[index]}</div>;
    }

    if (p2 === 'BYE') {
      handleWinner(index, p1);
      return <div className="text-yellow-500">Automáticamente clasificado</div>;
    }

    return (
      <div className="space-x-2 mt-2">
        <button onClick={() => handleWinner(index, p1)} className="px-2 py-1 bg-blue-400 rounded text-white">
          Gana {p1}
        </button>
        <button onClick={() => handleWinner(index, p2)} className="px-2 py-1 bg-purple-400 rounded text-white">
          Gana {p2}
        </button>
      </div>
    );
  };

  if (playerNames.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Configurar Torneo</h1>
        <div className="mb-4">
          <label htmlFor="numPlayers">Número de jugadores:</label>
          <input
            id="numPlayers"
            type="number"
            min="2"
            className="ml-2 p-1 border rounded"
            value={numPlayers || ''}
            onChange={handleNumPlayersChange}
          />
        </div>
        {inputNames.length > 0 && (
          <div className="mb-4">
            {inputNames.map((name, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  className="p-1 border rounded"
                  placeholder={`Nombre del jugador ${index + 1}`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
              </div>
            ))}
            <button
              onClick={handleSubmitNames}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Comenzar Torneo
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentPairs = rounds[currentRound];

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Torneo</h1>
      <h2 className="text-2xl mb-2">Ronda {currentRound + 1}</h2>
      <ul className="mb-4 space-y-4">
        {currentPairs.map(([p1, p2], index) => (
          <li key={index} className="border p-4 rounded shadow-md">
            <div className="font-semibold">{p1} vs {p2 === 'BYE' ? 'Descansa' : p2}</div>
            {renderGame(index, p1, p2)}
          </li>
        ))}
      </ul>

      {winner ? (
        <div className="text-green-600 text-xl font-semibold">🏆 ¡Ganador: {winner}!</div>
      ) : (
        <button
          onClick={nextRound}
          disabled={!allMatchesResolved()}
          className={`px-4 py-2 rounded text-white ${allMatchesResolved() ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Siguiente Ronda
        </button>
      )}
    </div>
  );
};

const simulateMatch = ([p1, p2]: [string, string]): string => {
  if (p2 === 'BYE') return p1;
  return Math.random() < 0.5 ? p1 : p2;
};

export default Tournament;
