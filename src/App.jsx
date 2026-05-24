import React, { useState, useEffect, useRef } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { Undo2 } from 'lucide-react';

import Header from './components/Header';
import ScoreBoard from './components/ScoreBoard';
import Grid from './components/Grid';
import KeepSlot from './components/KeepSlot';
import TrashSlot from './components/TrashSlot';
import Queue from './components/Queue';
import catMascot from './assets/cat-mascot.png';

import {
  createInitialGrid,
  createInitialQueue,
  processMerges,
  generateTileValue,
  getTileColor,
  isGameOver
} from './utils/gameLogic';

const App = () => {
  const [grid, setGrid] = useState(createInitialGrid());
  const [queue, setQueue] = useState(createInitialQueue());
  const [keptTile, setKeptTile] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('just_divide_best_score') || '0', 10);
  });
  const [level, setLevel] = useState(1);
  const [trashCount, setTrashCount] = useState(10);
  const [timer, setTimer] = useState(7);
  const [isPaused, setIsPaused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [selectedSource, setSelectedSource] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const timerIntervalRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const playSound = () => {};

  const activeTile = queue[0];
  const isGameEnded = isGameOver(grid);

  useEffect(() => {
    if (isGameEnded) {
      playSound('gameover');
    }
  }, [isGameEnded]);

  useEffect(() => {
    if (!isPaused && !showHelp && !isGameEnded) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPaused, showHelp, isGameEnded]);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('just_divide_best_score', score.toString());
    }
  }, [score, bestScore]);

  const pushToUndoStack = (customGrid = grid, customQueue = queue, customKept = keptTile, customScore = score, customLevel = level, customTrash = trashCount) => {
    const stateSnapshot = {
      grid: JSON.parse(JSON.stringify(customGrid)),
      queue: JSON.parse(JSON.stringify(customQueue)),
      keptTile: customKept ? { ...customKept } : null,
      score: customScore,
      level: customLevel,
      trashCount: customTrash
    };
    setUndoStack((prev) => [...prev, stateSnapshot].slice(-10));
  };

  const handleUndo = () => {
    if (undoStack.length === 0 || isPaused) return;
    const newStack = [...undoStack];
    const previousState = newStack.pop();
    setGrid(previousState.grid);
    setQueue(previousState.queue);
    setKeptTile(previousState.keptTile);
    setScore(previousState.score);
    setLevel(previousState.level);
    setTrashCount(previousState.trashCount);
    setUndoStack(newStack);
    setSelectedSource(null);
  };

  const restartGame = () => {
    setGrid(createInitialGrid());
    setQueue(createInitialQueue());
    setKeptTile(null);
    setScore(0);
    setLevel(1);
    setTrashCount(10);
    setTimer(0);
    setUndoStack([]);
    setSelectedSource(null);
  };

  const handleReset = () => {
    if (window.confirm("Restart the game? All progress will be reset.")) {
      restartGame();
    }
  };

  const checkLevelUp = (newScore) => {
    const targetLevel = Math.floor(newScore / 10) + 1;
    if (targetLevel > level) {
      setIsLevelingUp(true);
      setLevel(targetLevel);
      setTrashCount((prev) => prev + 3);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#34d399', '#60a5fa', '#f472b6', '#fbbf24']
      });
      setTimeout(() => {
        setIsLevelingUp(false);
      }, 1000);
    }
  };

  const performTrash = () => {
    if (trashCount <= 0 || !activeTile) return;
    pushToUndoStack();
    const nextQueue = [
      queue[1],
      queue[2],
      { id: 'q-new-' + Date.now(), value: generateTileValue(grid.filter(c => c !== null).map(c => c.value)), color: 'blue' }
    ].map((item) => ({ ...item, color: getTileColor(item.value) }));
    setQueue(nextQueue);
    setTrashCount((prev) => prev - 1);
    setSelectedSource(null);
  };

  const performKeep = () => {
    if (!activeTile) return;
    pushToUndoStack();
    if (keptTile === null) {
      setKeptTile({ ...activeTile, isNew: false, isMerged: false });
      const nextQueue = [
        queue[1],
        queue[2],
        { id: 'q-new-' + Date.now(), value: generateTileValue(grid.filter(c => c !== null).map(c => c.value)), color: 'blue' }
      ].map((item) => ({ ...item, color: getTileColor(item.value) }));
      setQueue(nextQueue);
    } else {
      const temp = keptTile;
      setKeptTile({ ...activeTile, isNew: false, isMerged: false });
      const nextQueue = [...queue];
      nextQueue[0] = { ...temp, isNew: true, isMerged: false };
      setQueue(nextQueue);
    }
    setSelectedSource(null);
  };

  const performPlace = (targetIndex, source) => {
    if (grid[targetIndex] !== null) return;
    const tileToPlace = source === 'keep' ? keptTile : activeTile;
    if (!tileToPlace) return;
    pushToUndoStack();
    const newGrid = [...grid];
    newGrid[targetIndex] = {
      id: tileToPlace.id,
      value: tileToPlace.value,
      color: getTileColor(tileToPlace.value),
      isNew: true,
      isMerged: false
    };
    setGrid(newGrid);
    if (source === 'keep') {
      setKeptTile(null);
    } else {
      const nextQueue = [
        queue[1],
        queue[2],
        { id: 'q-new-' + Date.now(), value: generateTileValue(newGrid.filter(c => c !== null).map(c => c.value)), color: 'blue' }
      ].map((item) => ({ ...item, color: getTileColor(item.value) }));
      setQueue(nextQueue);
    }
    setSelectedSource(null);
    setTimeout(() => {
      triggerMergeSequence(newGrid, targetIndex);
    }, 150);
  };

  const triggerMergeSequence = (initialGridState, startIndex) => {
    let currentGrid = [...initialGridState];
    let activeIndices = [startIndex];
    let accumulatedScore = 0;
    const runStep = () => {
      const stepResult = processMerges(currentGrid, activeIndices);
      if (stepResult.mergedAny) {
        currentGrid = stepResult.grid;
        activeIndices = stepResult.activeIndices;
        accumulatedScore += stepResult.scoreGain;
        setGrid([...currentGrid]);
        setTimeout(runStep, 350);
      } else {
        if (accumulatedScore > 0) {
          setScore((prev) => {
            const nextScore = prev + accumulatedScore;
            checkLevelUp(nextScore);
            return nextScore;
          });
        }
        setGrid(prev => prev.map(cell => cell ? { ...cell, isNew: false, isMerged: false } : null));
      }
    };
    runStep();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const sourceId = active.id;
    const targetId = over.id;
    if (targetId.startsWith('cell-')) {
      const targetIndex = parseInt(targetId.split('-')[1], 10);
      const source = sourceId === 'keep-tile' ? 'keep' : 'active';
      performPlace(targetIndex, source);
    } else if (targetId === 'keep-slot' && sourceId === 'active-tile') {
      performKeep();
    } else if (targetId === 'trash-slot' && sourceId === 'active-tile') {
      performTrash();
    }
  };

  const handleCellClick = (index) => {
    if (isPaused) return;
    if (selectedSource && grid[index] === null) {
      performPlace(index, selectedSource);
    } else {
      setSelectedSource(null);
    }
  };

  const handleActiveTileClick = () => {
    if (isPaused) return;
    if (selectedSource === 'active') {
      setSelectedSource(null);
    } else {
      setSelectedSource('active');
    }
  };

  const handleKeepClick = () => {
    if (isPaused) return;
    if (selectedSource === 'active') {
      performKeep();
    } else if (keptTile) {
      if (selectedSource === 'keep') {
        setSelectedSource(null);
      } else {
        setSelectedSource('keep');
      }
    }
  };

  const handleTrashClick = () => {
    if (isPaused) return;
    if (selectedSource === 'active') {
      performTrash();
    } else if (trashCount > 0 && activeTile) {
      performTrash();
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="game-wrapper">

        <Header
          timer={timer}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          onOpenHelp={() => setShowHelp(true)}
          onReset={handleReset}
        />

        <main className={`main-layout ${isLevelingUp ? 'animate-level-up' : ''}`}>

          <div className="panel-mascot">
            <img src={catMascot} alt="Cat Mascot" className="panel-mascot-img" />
          </div>

          <div className="gameplay-panel">
            <div className="panel-content">
              <ScoreBoard level={level} score={score} bestScore={bestScore} />
              <Grid
                grid={grid}
                onCellClick={handleCellClick}
                hintsEnabled={hintsEnabled}
                activeTile={selectedSource === 'keep' ? keptTile : activeTile}
                selectedCellIndex={null}
              />
            </div>
          </div>

          <div className="right-column">
            <div className="action-panel">
              <KeepSlot
                keptTile={keptTile}
                onKeepClick={handleKeepClick}
                isSelected={selectedSource === 'keep'}
                activeTile={activeTile}
              />
              <div className="divider-line" />
              <Queue
                queue={queue}
                onActiveTileClick={handleActiveTileClick}
                isSelected={selectedSource === 'active'}
              />
              <div className="divider-line" />
              <TrashSlot
                trashCount={trashCount}
                onTrashClick={handleTrashClick}
                isSelected={selectedSource === 'active'}
              />
            </div>
          </div>

        </main>

        <footer className="footer-row">
          <button
            onClick={() => setHintsEnabled(!hintsEnabled)}
            className="pill-btn"
            style={{
              backgroundColor: hintsEnabled ? '#ecfdf5' : '#f8fafc',
              border: `2px solid ${hintsEnabled ? '#10b981' : '#cbd5e1'}`,
              color: hintsEnabled ? '#047857' : '#64748b'
            }}
          >
            <span>💡</span>
            <span>HINTS: {hintsEnabled ? "ON" : "OFF"}</span>
          </button>

          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="pill-btn"
            style={{
              backgroundColor: '#fffbeb',
              border: '2px solid #fbbf24',
              color: '#b45309',
              opacity: undoStack.length === 0 ? 0.45 : 1,
              cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>UNDO</span>
          </button>
        </footer>

        {showHelp && (
          <div className="modal-overlay animate-pop-in">
            <div className="modal-content">
              <h2 className="modal-title">How to Play!</h2>
              <div className="modal-body">
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🎯</span>
                  <p>Drag tiles from the <strong>Queue</strong> and place them on empty grid cells.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>✨</span>
                  <p><strong>Rule 1: Equal values disappear</strong>.<br/>
                  Placing a <span className="rule-highlight">4</span> next to a <span className="rule-highlight">4</span> removes both tiles!</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>➗</span>
                  <p><strong>Rule 2: Divisible merge</strong>.<br/>
                  Placing a <span className="rule-highlight" style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}>12</span> next to a <span className="rule-highlight" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>3</span> replaces the larger one with the quotient: <span className="rule-highlight">4</span> (12 ÷ 3), and the 3 disappears!</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>💨</span>
                  <p><strong>Rule 3: Quotient of 1 disappears</strong>.<br/>
                  If a division equals 1, the tile vanishes completely!</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📥</span>
                  <p>Use the <strong>KEEP</strong> slot to save a tile for later use.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🗑️</span>
                  <p>Use the <strong>TRASH</strong> slot to discard hard numbers. You get more trash uses on level up!</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="modal-btn"
                style={{
                  background: 'linear-gradient(to right, #f43f5e, #e11d48)',
                  boxShadow: '0 4px 0px #be123c'
                }}
              >
                LET'S PLAY!
              </button>
            </div>
          </div>
        )}

        {isGameEnded && (
          <div className="modal-overlay">
            <div className="modal-content animate-pop-in">
              <h2 className="modal-title" style={{ color: '#dc2626', fontSize: '32px' }}>GAME OVER</h2>
              <p style={{ color: '#64748b', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px' }}>No moves left!</p>
              <div style={{
                backgroundColor: '#fff5f5',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
                border: '2.5px solid #fee2e2'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#4b5563', fontWeight: 'bold' }}>Current Level:</span>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#1f2937' }}>LEVEL {level}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#4b5563', fontWeight: 'bold' }}>Final Score:</span>
                  <span style={{ fontSize: '24px', fontWeight: '900', color: '#1f2937' }}>{score}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563', fontWeight: 'bold' }}>Best Score:</span>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: '#dc2626' }}>🏆 {bestScore}</span>
                </div>
              </div>
              <button
                onClick={restartGame}
                className="modal-btn restart-overlay-btn"
                style={{
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  boxShadow: '0 4px 0px #047857'
                }}
              >
                RESTART GAME
              </button>
            </div>
          </div>
        )}

        {isPaused && (
          <div className="pause-overlay">
            <h2 className="pause-title">GAME PAUSED</h2>
            <button
              onClick={() => setIsPaused(false)}
              className="modal-btn"
              style={{
                width: 'auto',
                padding: '12px 32px',
                background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                boxShadow: '0 4px 0px #6d28d9',
                fontSize: '18px'
              }}
            >
              RESUME GAME
            </button>
          </div>
        )}

      </div>
    </DndContext>
  );
};

export default App;
