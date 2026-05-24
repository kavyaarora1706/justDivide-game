import React from 'react';
import tileBlue from '../assets/tile-blue.png';
import tilePurple from '../assets/tile-purple.png';
import tileOrange from '../assets/tile-orange.png';

const Tile = ({ 
  value, 
  color: rawColor, 
  isDragging = false, 
  isMerged = false,
  isNew = false,
  onClick = null,
  isSelected = false
}) => {
  let asset = tileOrange;
  let filterStyle = 'none';
  let textColor = '#5d2524';
  let textShadow = '0px 1px 1px rgba(255,255,255,0.6)';

  const color = rawColor ? rawColor.toLowerCase() : 'orange';

  switch (color) {
    case 'blue':
      asset = tileBlue;
      textColor = '#1e3a8a';
      textShadow = '0px 1px 1px rgba(255,255,255,0.7)';
      break;
    case 'purple':
      asset = tilePurple;
      textColor = '#4c1d95';
      textShadow = '0px 1px 1px rgba(255,255,255,0.7)';
      break;
    case 'orange':
      asset = tileOrange;
      textColor = '#7c2d12';
      textShadow = '0px 1px 1px rgba(255,255,255,0.7)';
      break;
    case 'red':
      asset = tileOrange;
      filterStyle = 'hue-rotate(335deg) saturate(1.4) brightness(0.9)';
      textColor = '#7f1d1d';
      textShadow = '0px 1px 1px rgba(255,255,255,0.7)';
      break;
    case 'yellow':
      asset = tileOrange;
      filterStyle = 'hue-rotate(42deg) saturate(1.5) brightness(1.05)';
      textColor = '#713f12';
      textShadow = '0px 1px 1px rgba(255,255,255,0.7)';
      break;
    case 'green':
      asset = tileBlue;
      filterStyle = 'hue-rotate(95deg) saturate(1.4) brightness(0.95)';
      textColor = '#14532d';
      textShadow = '0px 1px 1px rgba(255,255,255,0.7)';
      break;
    case 'gray':
    case 'grey':
      asset = tileBlue;
      filterStyle = 'grayscale(0.9) brightness(0.85)';
      textColor = '#374151';
      textShadow = '0px 1px 1px rgba(255,255,255,0.7)';
      break;
    default:
      asset = tileOrange;
  }


  let classes = "tile-element";
  if (isDragging) {
    classes += " dragging opacity-50";
  }
  if (isNew) {
    classes += " animate-pop-in";
  } else if (isMerged) {
    classes += " animate-merge-pop";
  }
  if (isSelected) {
    classes += " selected-ring";
  }

  return (
    <div 
      className={classes} 
      onClick={onClick}
      style={{
        cursor: isDragging ? 'grabbing' : onClick ? 'pointer' : 'grab',
        aspectRatio: '1 / 1'
      }}
    >
      <img 
        src={asset} 
        alt={`Tile ${value}`}
        className="tile-img"
        style={{ 
          filter: filterStyle,
          aspectRatio: '1 / 1'
        }}
      />
      
      <span 
        className="tile-text"
        style={{
          color: textColor,
          textShadow: textShadow
        }}
      >
        {value}
      </span>
    </div>
  );
};

export default Tile;
