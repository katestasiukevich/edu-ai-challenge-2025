import { Ship } from './Ship.js';

/**
 * Represents a game board for Sea Battle
 */
export class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = this.createGrid();
    this.ships = [];
    this.guesses = new Set(); // Track guessed coordinates
  }

  /**
   * Create an empty grid
   * @returns {string[][]} - 2D array representing the board
   */
  createGrid() {
    return Array(this.size).fill(null).map(() => 
      Array(this.size).fill('~')
    );
  }

  /**
   * Place ships randomly on the board
   * @param {number} numShips - Number of ships to place
   * @param {number} shipLength - Length of each ship
   */
  placeShipsRandomly(numShips, shipLength) {
    let placedShips = 0;
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loops

    while (placedShips < numShips && attempts < maxAttempts) {
      attempts++;
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const { startRow, startCol } = this.getRandomStartPosition(shipLength, orientation);
      
      const shipLocations = this.generateShipLocations(startRow, startCol, shipLength, orientation);
      
      if (this.canPlaceShip(shipLocations)) {
        this.placeShip(shipLocations);
        placedShips++;
      }
    }

    if (placedShips < numShips) {
      throw new Error(`Could only place ${placedShips} out of ${numShips} ships after ${maxAttempts} attempts`);
    }
  }

  /**
   * Get random starting position for ship placement
   * @param {number} shipLength - Length of the ship
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {object} - Object with startRow and startCol
   */
  getRandomStartPosition(shipLength, orientation) {
    const startRow = orientation === 'horizontal' 
      ? Math.floor(Math.random() * this.size)
      : Math.floor(Math.random() * (this.size - shipLength + 1));
    
    const startCol = orientation === 'horizontal'
      ? Math.floor(Math.random() * (this.size - shipLength + 1))
      : Math.floor(Math.random() * this.size);

    return { startRow, startCol };
  }

  /**
   * Generate ship locations based on start position and orientation
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {number} shipLength - Length of the ship
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {string[]} - Array of coordinate strings
   */
  generateShipLocations(startRow, startCol, shipLength, orientation) {
    const locations = [];
    for (let i = 0; i < shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      locations.push(`${row}${col}`);
    }
    return locations;
  }

  /**
   * Check if a ship can be placed at the given locations
   * @param {string[]} locations - Array of coordinate strings
   * @returns {boolean} - True if ship can be placed
   */
  canPlaceShip(locations) {
    return locations.every(location => {
      const [row, col] = this.parseCoordinate(location);
      return this.isValidCoordinate(row, col) && this.grid[row][col] === '~';
    });
  }

  /**
   * Place a ship on the board
   * @param {string[]} locations - Array of coordinate strings
   */
  placeShip(locations) {
    const ship = new Ship(locations);
    this.ships.push(ship);
    
    // Mark ship locations on grid (for player's own board)
    locations.forEach(location => {
      const [row, col] = this.parseCoordinate(location);
      this.grid[row][col] = 'S';
    });
  }

  /**
   * Process a guess on this board
   * @param {string} coordinate - Coordinate string like '34'
   * @returns {object} - Result object with hit, sunk, and alreadyGuessed properties
   */
  processGuess(coordinate) {
    if (this.guesses.has(coordinate)) {
      return { hit: false, sunk: false, alreadyGuessed: true };
    }

    this.guesses.add(coordinate);
    const [row, col] = this.parseCoordinate(coordinate);

    // Find if any ship is hit
    for (const ship of this.ships) {
      if (ship.hit(coordinate)) {
        this.grid[row][col] = 'X';
        return { 
          hit: true, 
          sunk: ship.isSunk(), 
          alreadyGuessed: false,
          ship: ship
        };
      }
    }

    // Miss
    this.grid[row][col] = 'O';
    return { hit: false, sunk: false, alreadyGuessed: false };
  }

  /**
   * Parse coordinate string into row and column integers
   * @param {string} coordinate - Coordinate string like '34'
   * @returns {number[]} - Array with [row, col]
   */
  parseCoordinate(coordinate) {
    if (coordinate.length !== 2) {
      throw new Error('Invalid coordinate format');
    }
    return [parseInt(coordinate[0]), parseInt(coordinate[1])];
  }

  /**
   * Check if coordinates are valid
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} - True if valid
   */
  isValidCoordinate(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Get the current grid state
   * @returns {string[][]} - Copy of the grid
   */
  getGrid() {
    return this.grid.map(row => [...row]);
  }

  /**
   * Get all ships on this board
   * @returns {Ship[]} - Array of ships
   */
  getShips() {
    return [...this.ships];
  }

  /**
   * Check if all ships are sunk
   * @returns {boolean} - True if all ships are sunk
   */
  allShipsSunk() {
    return this.ships.length > 0 && this.ships.every(ship => ship.isSunk());
  }

  /**
   * Get remaining ships count
   * @returns {number} - Number of ships not yet sunk
   */
  getRemainingShipsCount() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  /**
   * Check if a coordinate has been guessed
   * @param {string} coordinate - Coordinate string
   * @returns {boolean} - True if already guessed
   */
  hasBeenGuessed(coordinate) {
    return this.guesses.has(coordinate);
  }
} 