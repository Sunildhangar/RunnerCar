import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import GameCanvas from './components/GameCanvas';
import CarCanvas from './components/CarCanvas';
import Leaderboard from './components/Leaderboard';
import { startSession, endSession, saveScore, getConfig, getLeaderboard } from './services/api';

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameover
  const [gameMode, setGameMode] = useState('neon'); // 'neon' or 'car'
  const [playerName, setPlayerName] = useState('');
  const [session, setSession] = useState(null);
  const [gameConfig, setGameConfig] = useState(null);
  const [score, setScore] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchConfig();
    fetchLeaderboard();
  }, []);

  const fetchConfig = async () => {
    try {
      const resp = await getConfig();
      if (resp.success) {
        setGameConfig(resp.data);
      }
    } catch (e) {
      console.error("Failed to fetch config, using defaults", e);
      // Fallback defaults
      setGameConfig({
        gravity: 0.6,
        jumpForce: -12,
        obstacleSpeed: 5,
        spawnRate: 1500,
        speedMultiplier: 1.001
      });
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const resp = await getLeaderboard();
      if (resp.success) {
        setLeaderboardData(resp.data);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    }
  };

  const handleStartGame = async (mode) => {
    setGameMode(mode);
    try {
      const resp = await startSession(playerName || 'Anonymous');
      if (resp.success) {
        setSession(resp.data);
        setGameState('playing');
        setScore(0);
      }
    } catch (e) {
      console.error("Error starting session", e);
    }
  };

  const handleGameOver = useCallback(async (finalScore) => {
    setGameState('gameover');
    setScore(finalScore);
    if (session) {
      try {
        await saveScore(session.playerId, finalScore);
        await endSession(session.sessionId, finalScore);
        fetchLeaderboard(); // refresh leaderboard
      } catch (e) {
        console.error("Error saving score or ending session", e);
      }
    }
  }, [session]);

  return (
    <div className="app-container">
      <h1 className="game-title">{gameMode === 'neon' ? 'Neon Runner' : 'Car Runner'}</h1>
      
      {gameState === 'menu' && (
        <div className="start-screen">
          <h2>Welcome!</h2>
          <input 
            type="text" 
            placeholder="Enter your name..." 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={() => handleStartGame('neon')}>Play Neon Runner</button>
            <button onClick={() => handleStartGame('car')}>Play Car Runner</button>
          </div>
          
          <Leaderboard data={leaderboardData} />
        </div>
      )}

      {gameState === 'playing' && gameConfig && (
        <>
          {gameMode === 'neon' ? (
            <GameCanvas 
              config={gameConfig} 
              onGameOver={handleGameOver} 
              setHUDScore={setScore} 
            />
          ) : (
             <CarCanvas 
              config={gameConfig} 
              onGameOver={handleGameOver} 
              setHUDScore={setScore} 
            />
          )}
        </>
      )}

      {gameState === 'gameover' && (
        <div className="game-over-screen">
          <h2>Game Over</h2>
          <p>Your Score: {Math.floor(score)}</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => handleStartGame(gameMode)}>Play Again</button>
            <button onClick={() => setGameState('menu')}>Main Menu</button>
          </div>
          <Leaderboard data={leaderboardData} />
        </div>
      )}
    </div>
  );
}

export default App;
