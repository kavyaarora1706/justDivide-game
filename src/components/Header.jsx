import React from 'react';
import { HelpCircle, Pause, Play, RotateCcw } from 'lucide-react';

const Header = ({ timer, isPaused, setIsPaused, onOpenHelp, onReset }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="header-area">
      <div className="header-top-row">
        <div className="header-buttons-left">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="circle-btn"
            style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}
            title={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-white fill-white" />
            ) : (
              <Pause className="w-5 h-5 text-white fill-white" />
            )}
          </button>

          <button
            onClick={onReset}
            className="circle-btn"
            style={{ background: 'linear-gradient(135deg, #fca5a5, #ef4444)' }}
            title="Restart Game"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="timer-box">
          <span>⏳</span>
          <span>{formatTime(timer)}</span>
        </div>

        <button
          onClick={onOpenHelp}
          className="circle-btn"
          style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }}
          title="Rules & How to Play"
        >
          <HelpCircle className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="title-banner">
        <h1 className="game-title-text">
          JUST DIVIDE
        </h1>
        <div className="subtitle-banner">
          <p className="subtitle-text">
            DIVIDE WITH THE NUMBERS TO SOLVE THE ROWS AND COLUMNS.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
