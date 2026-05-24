import React from 'react';
import badgeRed from '../assets/badge-red.png';

const ScoreBoard = ({ level, score, bestScore }) => {
  return (
    <div className="badges-row">
      <div 
        className="badge-item"
        style={{ backgroundImage: `url(${badgeRed})` }}
      >
        <span className="badge-text">
          LEVEL {level}
        </span>
      </div>

      <div className="best-score-badge">
        🏆 BEST: {bestScore}
      </div>
      <div 
        className="badge-item"
        style={{ backgroundImage: `url(${badgeRed})` }}
      >
        <span className="badge-text">
          SCORE {score}
        </span>
      </div>
    </div>
  );
};

export default ScoreBoard;
