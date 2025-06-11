import { Board } from './Board.js';

/**
 * Base Player class
 */
export class Player {
  constructor(name) {
    this.name = name;
    this.board = new Board();
    this.opponentBoard = new Board(); // Tracking view of opponent's board
  }

  /**
   * Initialize the player's board with ships
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  setupBoard(numShips, shipLength) {
    this.board.placeShipsRandomly(numShips, shipLength);
  }

  /**
   * Get the player's board
   * @returns {Board} - The player's board
   */
  getBoard() {
    return this.board;
  }

  /**
   * Get the opponent tracking board
   * @returns {Board} - The opponent tracking board
   */
  getOpponentBoard() {
    return this.opponentBoard;
  }

  /**
   * Process an opponent's guess on this player's board
   * @param {string} coordinate - Coordinate string
   * @returns {object} - Result of the guess
   */
  receiveGuess(coordinate) {
    return this.board.processGuess(coordinate);
  }

  /**
   * Check if all ships are sunk
   * @returns {boolean} - True if defeated
   */
  isDefeated() {
    return this.board.allShipsSunk();
  }

  /**
   * Get remaining ships count
   * @returns {number} - Number of remaining ships
   */
  getRemainingShips() {
    return this.board.getRemainingShipsCount();
  }
}

/**
 * Human Player class
 */
export class HumanPlayer extends Player {
  constructor(name = 'Player') {
    super(name);
  }

  /**
   * Validate a guess input
   * @param {string} input - Raw input from user
   * @returns {object} - Validation result with isValid and coordinate
   */
  validateGuess(input) {
    if (!input || input.length !== 2) {
      return { 
        isValid: false, 
        error: 'Input must be exactly two digits (e.g., 00, 34, 98).' 
      };
    }

    const row = parseInt(input[0]);
    const col = parseInt(input[1]);

    if (isNaN(row) || isNaN(col) || row < 0 || row >= 10 || col < 0 || col >= 10) {
      return { 
        isValid: false, 
        error: 'Please enter valid row and column numbers between 0 and 9.' 
      };
    }

    if (this.opponentBoard.hasBeenGuessed(input)) {
      return { 
        isValid: false, 
        error: 'You already guessed that location!' 
      };
    }

    return { isValid: true, coordinate: input };
  }
}

/**
 * CPU Player class with hunt and target modes
 */
export class CPUPlayer extends Player {
  constructor(name = 'CPU') {
    super(name);
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = []; // Coordinates to target when in target mode
    this.lastHit = null;
  }

  /**
   * Generate a guess based on current AI mode
   * @returns {string} - Coordinate string
   */
  generateGuess() {
    let coordinate;

    if (this.mode === 'target' && this.targetQueue.length > 0) {
      // Target mode: use queued adjacent coordinates
      coordinate = this.targetQueue.shift();
      
      // If coordinate already guessed, try next in queue or switch to hunt
      while (this.opponentBoard.hasBeenGuessed(coordinate) && this.targetQueue.length > 0) {
        coordinate = this.targetQueue.shift();
      }
      
      if (this.opponentBoard.hasBeenGuessed(coordinate)) {
        this.mode = 'hunt';
        coordinate = this.generateHuntGuess();
      }
    } else {
      // Hunt mode: random guess
      this.mode = 'hunt';
      coordinate = this.generateHuntGuess();
    }

    return coordinate;
  }

  /**
   * Generate a random hunt guess
   * @returns {string} - Coordinate string
   */
  generateHuntGuess() {
    let coordinate;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      coordinate = `${row}${col}`;
      attempts++;
    } while (this.opponentBoard.hasBeenGuessed(coordinate) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      // Fallback: find first unguessed coordinate
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const coord = `${row}${col}`;
          if (!this.opponentBoard.hasBeenGuessed(coord)) {
            return coord;
          }
        }
      }
    }

    return coordinate;
  }

  /**
   * Process the result of a guess
   * @param {string} coordinate - The guessed coordinate
   * @param {object} result - Result of the guess
   */
  processGuessResult(coordinate, result) {
    // Update opponent tracking board
    const [row, col] = this.opponentBoard.parseCoordinate(coordinate);
    this.opponentBoard.guesses.add(coordinate);
    
    if (result.hit) {
      this.opponentBoard.grid[row][col] = 'X';
      this.lastHit = coordinate;

      if (result.sunk) {
        // Ship sunk: return to hunt mode
        this.mode = 'hunt';
        this.targetQueue = [];
      } else {
        // Hit but not sunk: switch to target mode
        this.mode = 'target';
        this.addAdjacentTargets(coordinate);
      }
    } else {
      this.opponentBoard.grid[row][col] = 'O';
      
      // If we were targeting and missed, continue targeting if queue not empty
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        this.mode = 'hunt';
      }
    }
  }

  /**
   * Add adjacent coordinates to target queue
   * @param {string} coordinate - Center coordinate
   */
  addAdjacentTargets(coordinate) {
    const [row, col] = this.opponentBoard.parseCoordinate(coordinate);
    const adjacent = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 }
    ];

    adjacent.forEach(({ r, c }) => {
      if (this.opponentBoard.isValidCoordinate(r, c)) {
        const adjCoordinate = `${r}${c}`;
        if (!this.opponentBoard.hasBeenGuessed(adjCoordinate) && 
            !this.targetQueue.includes(adjCoordinate)) {
          this.targetQueue.push(adjCoordinate);
        }
      }
    });
  }

  /**
   * Get current AI mode
   * @returns {string} - Current mode ('hunt' or 'target')
   */
  getMode() {
    return this.mode;
  }

  /**
   * Get target queue length (for testing)
   * @returns {number} - Number of targets in queue
   */
  getTargetQueueLength() {
    return this.targetQueue.length;
  }
} 