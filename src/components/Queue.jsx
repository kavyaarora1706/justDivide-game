import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import Tile from './Tile';

const Queue = ({ queue, onActiveTileClick, isSelected }) => {
  const activeTile = queue[0];
  const nextTile = queue[1];
  const thirdTile = queue[2];

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    isDragging 
  } = useDraggable({
    id: 'active-tile',
    disabled: !activeTile
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100
  } : undefined;

  return (
    <div className="queue-panel">
        <span className="panel-label" style={{ color: '#b45309' }}>
        NEXT
      </span>
      <div className="queue-slots-card">
        <div 
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          onClick={onActiveTileClick}
          className="queue-active-container"
        >
          {activeTile ? (
            <Tile 
              value={activeTile.value} 
              color={activeTile.color} 
              isDragging={isDragging}
              isSelected={isSelected}
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-slate-100 border border-slate-200" />
          )}
        </div>

          <div className="queue-dot" />

        <div className="queue-next-container">
          {nextTile ? (
            <Tile 
              value={nextTile.value} 
              color="gray"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-slate-100 border border-slate-200" />
          )}
        </div>

        <div className="queue-dot" />


        <div className="queue-third-container">
          {thirdTile ? (
            <Tile 
              value={thirdTile.value} 
              color="gray"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-slate-100 border border-slate-200" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Queue;
