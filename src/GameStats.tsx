import React from 'react';

interface GameStatsProps {
  moves: number;
  matches: number;
  totalPairs: number;
  timeElapsed: number;
  gameCompleted: boolean;
}

const GameStats: React.FC<GameStatsProps> = ({ 
  moves, 
  matches, 
  totalPairs, 
  timeElapsed, 
  gameCompleted 
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracy = moves > 0 ? Math.round((matches / (moves / 2)) * 100) : 0;

  return (
    <div className="game-stats">
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{moves}</span>
          <span className="stat-label">Moves</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{matches}/{totalPairs}</span>
          <span className="stat-label">Pairs Found</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{formatTime(timeElapsed)}</span>
          <span className="stat-label">Time</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{accuracy}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
      </div>
      
      {gameCompleted && (
        <div className="completion-message">
          <h2>🎉 Victory!</h2>
          <p>You've successfully matched all WWII historical pairs!</p>
          <div className="final-stats">
            <p>Final Time: <strong>{formatTime(timeElapsed)}</strong></p>
            <p>Total Moves: <strong>{moves}</strong></p>
            <p>Accuracy: <strong>{accuracy}%</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;