
export const generateTileValue = (existingValues = []) => {
  const basePool = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 32];
  
  if (existingValues.length > 0 && Math.random() < 0.6) {
    const target = existingValues[Math.floor(Math.random() * existingValues.length)];
    const divisors = [];
    
    for (let d = 2; d <= target; d++) {
      if (target % d === 0) {
        divisors.push(d);
      }
    }
    
    if (divisors.length > 0 && Math.random() < 0.7) {
      return divisors[Math.floor(Math.random() * divisors.length)];
    } else {
      const multipliers = [2, 3];
      const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
      if (target * mult <= 50) {
        return target * mult;
      }
    }
  }
  
  const weightedPool = [
    2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6,
    8, 9, 10, 12, 15, 16, 20, 24, 32
  ];
  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
};

export const getTileColor = (value) => {
  if (value % 5 === 0) return 'purple';
  if (value % 3 === 0) return 'blue';
  if (value % 2 === 0) return 'orange';
  return 'red';
};

export const createInitialGrid = () => {
  const grid = Array(16).fill(null);
  
  grid[4] = { id: 'init-1', value: 8, color: 'orange', isNew: false };
  grid[5] = { id: 'init-2', value: 6, color: 'yellow', isNew: false }; 
  grid[9] = { id: 'init-3', value: 35, color: 'purple', isNew: false };
  grid[11] = { id: 'init-4', value: 32, color: 'red', isNew: false };
  grid[15] = { id: 'init-5', value: 12, color: 'green', isNew: false };
  
  return grid;
};


export const createInitialQueue = () => {
  return [
    { id: 'q-1', value: 32, color: 'red' },
    { id: 'q-2', value: 12, color: 'red' },
    { id: 'q-3', value: generateTileValue(), color: 'blue' }
  ].map((item) => {
    return { ...item, color: getTileColor(item.value) };
  });
};

export const getNeighbors = (index) => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const neighbors = [];
  
  if (row > 0) neighbors.push({ index: (row - 1) * 4 + col, dir: 'top' });
  if (row < 3) neighbors.push({ index: (row + 1) * 4 + col, dir: 'bottom' });
  if (col > 0) neighbors.push({ index: row * 4 + (col - 1), dir: 'left' });
  if (col < 3) neighbors.push({ index: row * 4 + (col + 1), dir: 'right' });
  
  return neighbors;
};

export const checkPotentialMerge = (grid, index, value) => {
  if (grid[index] !== null) return false;
  
  const neighbors = getNeighbors(index);
  
  for (const n of neighbors) {
    const neighborTile = grid[n.index];
    if (neighborTile !== null) {
      const nv = neighborTile.value;
      
      if (value === nv) return true;
      
      if (value > nv && value % nv === 0) return true;
      if (nv > value && nv % value === 0) return true;
    }
  }
  
  return false;
};

export const processMerges = (currentGrid, activeIndices) => {
  let grid = [...currentGrid];
  let mergedAny = false;
  let scoreGain = 0;
  const nextActiveIndices = new Set();
  const mergeAnimations = [];
  
  for (const index of activeIndices) {
    if (grid[index] === null) continue;
    
    const tile = grid[index];
    const val = tile.value;
    const neighbors = getNeighbors(index);
  
    for (const n of neighbors) {
      const neighborTile = grid[n.index];
      if (neighborTile === null) continue;
      
      const nVal = neighborTile.value;
      
      if (val === nVal) {
        grid[index] = null;
        grid[n.index] = null;
        mergedAny = true;
        scoreGain += val * 2; 
        mergeAnimations.push({ type: 'disappear', indices: [index, n.index] });
        break; 
      }
      
      else if (val > nVal && val % nVal === 0) {
        const quotient = val / nVal;
        
        if (quotient === 1) {
          grid[index] = null;
          mergeAnimations.push({ type: 'disappear', indices: [index, n.index] });
        } else {
          grid[index] = {
            ...tile,
            value: quotient,
            color: getTileColor(quotient),
            isNew: false,
            isMerged: true
          };
          nextActiveIndices.add(index);
          mergeAnimations.push({ type: 'shrink', target: index, source: n.index });
        }
        
        grid[n.index] = null;
        mergedAny = true;
        scoreGain += val;
        break; 
      }
      
      else if (nVal > val && nVal % val === 0) {
        const quotient = nVal / val;
        
        if (quotient === 1) {
          grid[n.index] = null;
          mergeAnimations.push({ type: 'disappear', indices: [index, n.index] });
        } else {
          grid[n.index] = {
            ...neighborTile,
            value: quotient,
            color: getTileColor(quotient),
            isNew: false,
            isMerged: true
          };
          nextActiveIndices.add(n.index);
          mergeAnimations.push({ type: 'shrink', target: n.index, source: index });
        }
        
        grid[index] = null;
        mergedAny = true;
        scoreGain += nVal;
        break; 
      }
    }
  }
  
  return {
    grid,
    mergedAny,
    scoreGain,
    activeIndices: Array.from(nextActiveIndices),
    mergeAnimations
  };
};

export const resolveAllMerges = (initialGrid, startIndex) => {
  let grid = [...initialGrid];
  let active = [startIndex];
  let totalScoreGain = 0;
  let loops = 0;
  
  while (active.length > 0 && loops < 100) {
    const result = processMerges(grid, active);
    if (!result.mergedAny) break;
    
    grid = result.grid;
    active = result.activeIndices;
    totalScoreGain += result.scoreGain;
    loops++;
  }
  
  return { grid, scoreGain: totalScoreGain };
};

export const isGameOver = (grid) => {
  const hasEmptyCell = grid.some(cell => cell === null);
  if (hasEmptyCell) return false;
  
  for (let i = 0; i < 16; i++) {
    const tile = grid[i];
    if (tile === null) continue;
    const value = tile.value;
    const neighbors = getNeighbors(i);
    for (const n of neighbors) {
      const neighborTile = grid[n.index];
      if (neighborTile !== null) {
        const nv = neighborTile.value;
        if (value === nv) return false;
        if (value > nv && value % nv === 0) return false;
        if (nv > value && nv % value === 0) return false;
      }
    }
  }
  
  return true;
};
