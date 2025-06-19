import React, { useState, useEffect, useCallback } from 'react';
import GameCard, { WWIICard } from './GameCard';
import GameStats from './GameStats';

interface BlockProps {
  title?: string;
  description?: string;
}

// WWII Historical Data for Memory Cards
const WWII_CARDS_DATA = [
  {
    id: 1,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lockheed_P-38_Lightning_USAF.jpg/800px-Lockheed_P-38_Lightning_USAF.jpg',
    title: 'P-38 Lightning',
    description: 'American twin-engine fighter aircraft used throughout WWII'
  },
  {
    id: 2,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Bundesarchiv_Bild_146-1978-043-02%2C_Messerschmitt_Me_109.jpg/800px-Bundesarchiv_Bild_146-1978-043-02%2C_Messerschmitt_Me_109.jpg',
    title: 'Messerschmitt Bf 109',
    description: 'German fighter aircraft, backbone of the Luftwaffe'
  },
  {
    id: 3,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sherman_tank_WW2.jpg/800px-Sherman_tank_WW2.jpg',
    title: 'M4 Sherman Tank',
    description: 'Primary American medium tank used by Allied forces'
  },
  {
    id: 4,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Panzer_IV_Ausf._F2.jpg/800px-Panzer_IV_Ausf._F2.jpg',
    title: 'Panzer IV',
    description: 'German medium tank, most widely used German tank of WWII'
  },
  {
    id: 5,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Spitfire_F_VB_BM597_in_flight_2012.jpg/800px-Spitfire_F_VB_BM597_in_flight_2012.jpg',
    title: 'Supermarine Spitfire',
    description: 'British single-seat fighter, crucial in Battle of Britain'
  },
  {
    id: 6,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/B-17_Flying_Fortress.jpg/800px-B-17_Flying_Fortress.jpg',
    title: 'B-17 Flying Fortress',
    description: 'American heavy bomber, workhorse of Allied bombing campaigns'
  },
  {
    id: 7,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/USS_Enterprise_%28CV-6%29_in_Puget_Sound%2C_September_1945.jpg/800px-USS_Enterprise_%28CV-6%29_in_Puget_Sound%2C_September_1945.jpg',
    title: 'USS Enterprise',
    description: 'Most decorated US Navy ship of WWII, fought in Pacific Theater'
  },
  {
    id: 8,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Sturmgewehr_44.jpg/800px-Sturmgewehr_44.jpg',
    title: 'StG 44',
    description: 'First assault rifle, revolutionary German automatic weapon'
  }
];

const Block: React.FC<BlockProps> = ({ title = "WWII Memory Game", description }) => {
  const [cards, setCards] = useState<WWIICard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Initialize game
  const initializeGame = useCallback(() => {
    let selectedCards = [];
    switch (difficulty) {
      case 'easy':
        selectedCards = WWII_CARDS_DATA.slice(0, 4); // 4 pairs = 8 cards
        break;
      case 'medium':
        selectedCards = WWII_CARDS_DATA.slice(0, 6); // 6 pairs = 12 cards
        break;
      case 'hard':
        selectedCards = WWII_CARDS_DATA; // 8 pairs = 16 cards
        break;
    }

    // Create pairs and shuffle
    const gameCards = [...selectedCards, ...selectedCards].map((card, index) => ({
      ...card,
      id: index,
      originalId: card.id,
      matched: false
    }));

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStarted(false);
    setGameCompleted(false);
    setTimeElapsed(0);
  }, [difficulty]);

  // Initialize game on component mount and difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  // Handle card click
  const handleCardClick = (cardIndex: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardIndex)) return;
    if (matchedPairs.includes(cards[cardIndex].originalId)) return;

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.originalId === secondCard.originalId) {
        // Match found
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, firstCard.originalId]);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  // Check for game completion
  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (matchedPairs.length === totalPairs && totalPairs > 0) {
      setGameCompleted(true);
      // Send completion event
      const completionData = {
        type: 'BLOCK_COMPLETION',
        blockId: '6853c6e77405ab9cb3e4cf03',
        completed: true,
        score: Math.max(1000 - (moves * 10) - timeElapsed, 100),
        maxScore: 1000,
        timeSpent: timeElapsed,
        data: {
          difficulty,
          moves,
          timeElapsed,
          accuracy: Math.round((matchedPairs.length / (moves || 1)) * 100)
        }
      };
      window.postMessage(completionData, '*');
      window.parent.postMessage(completionData, '*');
    }
  }, [matchedPairs, cards.length, moves, timeElapsed, difficulty]);

  const isCardFlipped = (cardIndex: number) => {
    return flippedCards.includes(cardIndex) || matchedPairs.includes(cards[cardIndex]?.originalId);
  };

  const isCardDisabled = (cardIndex: number) => {
    return flippedCards.length === 2 || matchedPairs.includes(cards[cardIndex]?.originalId);
  };

  const totalPairs = cards.length / 2;

  return (
    <div className="wwii-memory-game">
      <style>{`
        .wwii-memory-game {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          min-height: 100vh;
          color: white;
        }

        .game-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .game-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .game-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .difficulty-selector {
          margin-bottom: 20px;
        }

        .difficulty-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 10px;
        }

        .difficulty-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid transparent;
        }

        .difficulty-btn.active {
          background: #e74c3c;
          border-color: #c0392b;
        }

        .difficulty-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        .controls {
          text-align: center;
          margin-bottom: 30px;
        }

        .reset-btn {
          padding: 12px 24px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: background 0.3s;
        }

        .reset-btn:hover {
          background: #c0392b;
        }

        .game-board {
          display: grid;
          gap: 15px;
          margin-bottom: 30px;
          justify-content: center;
        }

        .game-board.easy {
          grid-template-columns: repeat(4, 1fr);
          max-width: 600px;
          margin: 0 auto 30px;
        }

        .game-board.medium {
          grid-template-columns: repeat(4, 1fr);
          max-width: 800px;
          margin: 0 auto 30px;
        }

        .game-board.hard {
          grid-template-columns: repeat(4, 1fr);
          max-width: 1000px;
          margin: 0 auto 30px;
        }

        .game-card {
          width: 100%;
          height: 200px;
          perspective: 1000px;
          cursor: pointer;
        }

        .game-card.disabled {
          cursor: not-allowed;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .game-card.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .card-front {
          background: linear-gradient(45deg, #34495e, #2c3e50);
          border: 3px solid #ecf0f1;
        }

        .card-back {
          background: white;
          color: #2c3e50;
          transform: rotateY(180deg);
          flex-direction: column;
          padding: 10px;
          overflow: hidden;
        }

        .card-back-pattern {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          position: relative;
        }

        .pattern-stripes {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            45deg,
            #34495e,
            #34495e 10px,
            #2c3e50 10px,
            #2c3e50 20px
          );
          opacity: 0.3;
        }

        .card-back-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ecf0f1;
          z-index: 1;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .card-back img {
          width: 100%;
          height: 60%;
          object-fit: cover;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        .card-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .card-info h3 {
          font-size: 0.9rem;
          margin: 0 0 5px 0;
          font-weight: bold;
        }

        .card-info p {
          font-size: 0.7rem;
          margin: 0;
          opacity: 0.8;
          line-height: 1.2;
        }

        .game-stats {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 15px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #ecf0f1;
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 5px;
        }

        .completion-message {
          text-align: center;
          padding: 20px;
          background: rgba(46, 204, 113, 0.2);
          border-radius: 10px;
          border: 2px solid #2ecc71;
        }

        .completion-message h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #2ecc71;
        }

        .final-stats {
          margin-top: 15px;
        }

        .final-stats p {
          margin: 5px 0;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .game-board {
            gap: 10px;
          }
          
          .game-board.easy,
          .game-board.medium,
          .game-board.hard {
            grid-template-columns: repeat(3, 1fr);
            max-width: 400px;
          }

          .game-card {
            height: 150px;
          }

          .difficulty-buttons {
            flex-direction: column;
            align-items: center;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="game-header">
        <h1 className="game-title">{title}</h1>
        <p className="game-subtitle">
          Test your memory with World War II historical vehicles and weapons
        </p>
      </div>

      <div className="difficulty-selector">
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>Choose Difficulty:</p>
        <div className="difficulty-buttons">
          <button
            className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => setDifficulty('easy')}
          >
            Easy (4 pairs)
          </button>
          <button
            className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => setDifficulty('medium')}
          >
            Medium (6 pairs)
          </button>
          <button
            className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => setDifficulty('hard')}
          >
            Hard (8 pairs)
          </button>
        </div>
      </div>

      <div className="controls">
        <button className="reset-btn" onClick={initializeGame}>
          New Game
        </button>
      </div>

      <div className={`game-board ${difficulty}`}>
        {cards.map((card, index) => (
          <GameCard
            key={index}
            card={card}
            isFlipped={isCardFlipped(index)}
            onClick={() => handleCardClick(index)}
            disabled={isCardDisabled(index)}
          />
        ))}
      </div>

      <GameStats
        moves={moves}
        matches={matchedPairs.length}
        totalPairs={totalPairs}
        timeElapsed={timeElapsed}
        gameCompleted={gameCompleted}
      />
    </div>
  );
};

export default Block;