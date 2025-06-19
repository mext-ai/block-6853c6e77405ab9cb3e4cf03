import React from 'react';

export interface WWIICard {
  id: number;
  image: string;
  title: string;
  description: string;
  matched: boolean;
}

interface GameCardProps {
  card: WWIICard;
  isFlipped: boolean;
  onClick: () => void;
  disabled: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ card, isFlipped, onClick, disabled }) => {
  return (
    <div 
      className={`game-card ${isFlipped ? 'flipped' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-back-pattern">
            <div className="pattern-stripes"></div>
            <span className="card-back-text">WWII</span>
          </div>
        </div>
        <div className="card-back">
          <img src={card.image} alt={card.title} />
          <div className="card-info">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;