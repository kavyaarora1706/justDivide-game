import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import Tile from './Tile';
import slotBorder from '../assets/slot-border.png';

const KeepSlot = ({ keptTile, onKeepClick, isSelected, activeTile }) => {
  const { isOver: isOverDrop, setNodeRef: setDropRef } = useDroppable({
    id: 'keep-slot',
  });
  const { 
    attributes, 
    listeners, 
    setNodeRef: setDragRef, 
    transform, 
    isDragging 
  } = useDraggable({
    id: 'keep-tile',
    disabled: !keptTile
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100
  } : undefined;

  const setCombinedRef = (element) => {
    setDropRef(element);
    setDragRef(element);
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div
        ref={setCombinedRef}
        onClick={onKeepClick}
        {...listeners}
        {...attributes}
        className="keep-slot-box"
        style={{
          backgroundImage: `url(${slotBorder})`,
          boxShadow: isOverDrop
            ? '0 0 15px rgba(34, 197, 94, 0.8), inset 0 0 10px rgba(34, 197, 94, 0.4)'
            : isSelected
            ? '0 0 15px rgba(253, 224, 71, 0.9), inset 0 0 10px rgba(253, 224, 71, 0.5)'
            : 'none',
          transform: isOverDrop ? 'scale(1.08)' : 'scale(1)',
          ...style
        }}
      >
        {keptTile ? (
          <Tile 
            value={keptTile.value} 
            color={keptTile.color} 
            isDragging={isDragging}
          />
        ) : (
          <div className="keep-slot-placeholder">
            +
          </div>
        )}
      </div>
      <span className="panel-label keep-label">
        KEEP
      </span>
    </div>
  );
};

export default KeepSlot;
