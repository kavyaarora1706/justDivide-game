import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import Tile from './Tile';
import slotBorder from '../assets/slot-border.png';
import { checkPotentialMerge } from '../utils/gameLogic';

const GridCell = ({ 
  index, 
  tile, 
  onCellClick, 
  isHinted, 
  activeTileValue,
  isSelected
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${index}`,
    disabled: !!tile
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onCellClick(index)}
      className="grid-cell"
      style={{
        backgroundImage: `url(${slotBorder})`,
        boxShadow: isOver 
          ? '0 0 15px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(0, 255, 255, 0.4)' 
          : isSelected
          ? '0 0 15px rgba(253, 224, 71, 0.9), inset 0 0 10px rgba(253, 224, 71, 0.5)'
          : 'none',
        transform: isOver ? 'scale(1.05)' : 'scale(1)',
        zIndex: isOver ? 10 : 1,
        border: '2px solid #ffffff' 
      }}
    >
      {isHinted && !tile && (
        <div 
          className="absolute inset-0.5 rounded-lg pointer-events-none"
          style={{
            animation: 'pulse-glow 1.5s ease-in-out infinite',
            border: '2.5px dashed rgba(0, 255, 255, 0.8)',
          }}
        />
      )}

      {tile && (
        <Tile 
          value={tile.value} 
          color={tile.color} 
          isNew={tile.isNew}
          isMerged={tile.isMerged}
        />
      )}
    </div>
  );
};

const Grid = ({ 
  grid, 
  onCellClick, 
  hintsEnabled, 
  activeTile,
  selectedCellIndex
}) => {
  return (
    <div className="grid-wrapper">
      <div className="grid-container">
        {grid.map((tile, index) => {
          const isHinted = hintsEnabled && activeTile && checkPotentialMerge(grid, index, activeTile.value);
          const isSelected = selectedCellIndex === index;
          
          return (
            <GridCell
              key={index}
              index={index}
              tile={tile}
              onCellClick={onCellClick}
              isHinted={isHinted}
              activeTileValue={activeTile?.value}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
