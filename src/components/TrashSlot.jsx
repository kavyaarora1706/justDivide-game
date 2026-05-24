import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import slotBorder from '../assets/slot-border.png';

const TrashSlot = ({ trashCount, onTrashClick, isSelected }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'trash-slot',
  });

  return (
    <div className="flex flex-col items-center select-none w-full">
      <span className="panel-label trash-label">
        TRASH
      </span>

      
      <div
        ref={setNodeRef}
        onClick={onTrashClick}
        className="trash-slot-box"
        style={{
          backgroundImage: `url(${slotBorder})`,
          boxShadow: isOver 
            ? '0 0 15px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(239, 68, 68, 0.4)' 
            : isSelected
            ? '0 0 15px rgba(253, 224, 71, 0.9), inset 0 0 10px rgba(253, 224, 71, 0.5)'
            : 'none',
          transform: isOver ? 'scale(1.08)' : 'scale(1)',
          cursor: trashCount > 0 ? 'pointer' : 'not-allowed',
          opacity: trashCount > 0 ? 1 : 0.5
        }}
      >
        <span style={{ fontSize: '24px' }}>🗑️</span>
        <span className="trash-count-text">
          {trashCount}
        </span>
      </div>
    </div>
  );
};

export default TrashSlot;
