/**
 * Just Divide - Kid Mode
 * Game Logic & Helpers
 */

// Generate a random tile value suitable for Kid Mode
export const generateTileValue = (existingValues = []) => {
  // Simple kid-friendly numbers
  const basePool = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 32];
  
  // If there are numbers on the board, try to spawn a divisor or multiple to make gameplay easier
  if (existingValues.length > 0 && Math.random() < 0.6) {
    const target = existingValues[Math.floor(Math.random() * existingValues.length)];
    const divisors = [];
    
    // Find divisors
    for (let d = 2; d <= target; d++) {
      if (target % d === 0) {
        divisors.push(d);
      }
    }
    
    if (divisors.length > 0 && Math.random() < 0.7) {
      // Pick a random divisor
      return divisors[Math.floor(Math.random() * divisors.length)];
    } else {
      // Pick a small multiple or matching number
      const multipliers = [2, 3];
      const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
      if (target * mult <= 50) {
        return target * mult;
      }
    }
  }
  
  // Default fallback pool (weighted heavily towards small numbers 2, 3, 4, 5, 6)
  const weightedPool = [
    2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6,
    8, 9, 10, 12, 15, 16, 20, 24, 32
  ];
  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
};

// Map tile value to a base asset color
export const getTileColor = (value) => {
  if (value % 5 === 0) return 'purple';
  if (value % 3 === 0) return 'blue';
  if (value % 2 === 0) return 'orange';
  return 'red';
};

// Initialize the grid with the mockup's starting state or a random starting state
export const createInitialGrid = () => {
  const grid = Array(16).fill(null);
  
  // Exact mockup layout:
  // Row 1: Orange 8 at cell (1, 0) -> index 4; Yellow 6 at cell (1, 1) -> index 5
  // Row 2: Purple 35 at cell (2, 1) -> index 9; Red 32 at (2, 3) -> index 11
  // Row 3: Green 12 at cell (3, 3) -> index 15
  
  grid[4] = { id: 'init-1', value: 8, color: 'orange', isNew: false };
  grid[5] = { id: 'init-2', value: 6, color: 'yellow', isNew: false }; // Styled as yellow using orange + filter
  grid[9] = { id: 'init-3', value: 35, color: 'purple', isNew: false };
  grid[11] = { id: 'init-4', value: 32, color: 'red', isNew: false }; // Styled as red using orange + filter
  grid[15] = { id: 'init-5', value: 12, color: 'green', isNew: false }; // Styled as green using blue + filter
  
  return grid;
};

// Generate an initial queue of 3 upcoming tiles
export const createInitialQueue = () => {
  return [
    { id: 'q-1', value: 32, color: 'red' },
    { id: 'q-2', value: 12, color: 'red' },
    { id: 'q-3', value: generateTileValue(), color: 'blue' }
  ].map((item) => {
    return { ...item, color: getTileColor(item.value) };
  });
};

// Get orthogonal neighbors for a given index (0-15)
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

/**
 * Checks if placing a tile at a specific empty cell would create any merges.
 * Used by the hint system.
 */
export const checkPotentialMerge = (grid, index, value) => {
  if (grid[index] !== null) return false;
  
  const neighbors = getNeighbors(index);
  
  for (const n of neighbors) {
    const neighborTile = grid[n.index];
    if (neighborTile !== null) {
      const nv = neighborTile.value;
      
      // Rule 1: Equal values
      if (value === nv) return true;
      
      // Rule 2: Divisible merge
      if (value > nv && value % nv === 0) return true;
      if (nv > value && nv % value === 0) return true;
    }
  }
  
  return false;
};

/**
 * Performs a single step of the merge sequence.
 * Looks for any eligible merges for newly placed or updated tiles.
 * Returns the new grid, whether a merge occurred, the score gained, and details of what merged.
 */
export const processMerges = (currentGrid, activeIndices) => {
  let grid = [...currentGrid];
  let mergedAny = false;
  let scoreGain = 0;
  const nextActiveIndices = new Set();
  const mergeAnimations = []; // Track info for animating merge pops
  
  // Process merges starting from active cell indices
  for (const index of activeIndices) {
    if (grid[index] === null) continue;
    
    const tile = grid[index];
    const val = tile.value;
    const neighbors = getNeighbors(index);
    
    // Look at neighbors
    for (const n of neighbors) {
      const neighborTile = grid[n.index];
      if (neighborTile === null) continue;
      
      const nVal = neighborTile.value;
      
      // 1. Equal values merge (both disappear)
      if (val === nVal) {
        grid[index] = null;
        grid[n.index] = null;
        mergedAny = true;
        scoreGain += val * 2; // Equal values disappear -> score sum
        mergeAnimations.push({ type: 'disappear', indices: [index, n.index] });
        break; // Current tile is gone, cannot merge with other neighbors
      }
      
      // 2. Divisible merge: Placed tile is larger, neighbor is smaller (placed becomes quotient, neighbor is removed)
      else if (val > nVal && val % nVal === 0) {
        const quotient = val / nVal;
        
        if (quotient === 1) {
          // Rule 3: quotient of 1 disappears
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
        break; // Placed tile updated, break to allow cascading checks in next tick
      }
      
      // 3. Divisible merge: Neighbor is larger, placed is smaller (neighbor becomes quotient, placed is removed)
      else if (nVal > val && nVal % val === 0) {
        const quotient = nVal / val;
        
        if (quotient === 1) {
          // Rule 3: quotient of 1 disappears
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
        break; // Placed tile is removed, cannot merge further
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

/**
 * Resolves all merges recursively (or in a loop) until no more merges can occur.
 * Useful for calculating the final static board state if animations are skipped.
 */
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
  // 1. Check if there are any available empty cells
  const hasEmptyCell = grid.some(cell => cell === null);
  if (hasEmptyCell) return false;
  
  // 2. Check if equal tile merges or divisible merges are possible between adjacent cells
  for (let i = 0; i < 16; i++) {
    const tile = grid[i];
    if (tile === null) continue;
    const value = tile.value;
    const neighbors = getNeighbors(i);
    for (const n of neighbors) {
      const neighborTile = grid[n.index];
      if (neighborTile !== null) {
        const nv = neighborTile.value;
        // Equal tile merges
        if (value === nv) return false;
        // Divisible merges
        if (value > nv && value % nv === 0) return false;
        if (nv > value && nv % value === 0) return false;
      }
    }
  }
  
  return true;
};
