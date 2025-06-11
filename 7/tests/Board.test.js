import { Board } from '../src/Board.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(10);
  });

  describe('constructor', () => {
    it('should create a board with default size 10', () => {
      const defaultBoard = new Board();
      expect(defaultBoard.size).toBe(10);
      expect(defaultBoard.getGrid()).toHaveLength(10);
    });

    it('should create a board with custom size', () => {
      const customBoard = new Board(5);
      expect(customBoard.size).toBe(5);
      expect(customBoard.getGrid()).toHaveLength(5);
    });

    it('should initialize empty grid with water symbols', () => {
      const grid = board.getGrid();
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          expect(grid[row][col]).toBe('~');
        }
      }
    });

    it('should initialize empty ships array', () => {
      expect(board.getShips()).toEqual([]);
    });
  });

  describe('createGrid', () => {
    it('should create grid filled with water symbols', () => {
      const grid = board.createGrid();
      expect(grid).toHaveLength(10);
      expect(grid[0]).toHaveLength(10);
      expect(grid[5][5]).toBe('~');
    });
  });

  describe('parseCoordinate', () => {
    it('should parse valid coordinate strings', () => {
      expect(board.parseCoordinate('34')).toEqual([3, 4]);
      expect(board.parseCoordinate('00')).toEqual([0, 0]);
      expect(board.parseCoordinate('99')).toEqual([9, 9]);
    });

    it('should throw error for invalid coordinate format', () => {
      expect(() => board.parseCoordinate('3')).toThrow('Invalid coordinate format');
      expect(() => board.parseCoordinate('345')).toThrow('Invalid coordinate format');
      expect(() => board.parseCoordinate('')).toThrow('Invalid coordinate format');
    });
  });

  describe('isValidCoordinate', () => {
    it('should return true for valid coordinates', () => {
      expect(board.isValidCoordinate(0, 0)).toBe(true);
      expect(board.isValidCoordinate(5, 5)).toBe(true);
      expect(board.isValidCoordinate(9, 9)).toBe(true);
    });

    it('should return false for invalid coordinates', () => {
      expect(board.isValidCoordinate(-1, 0)).toBe(false);
      expect(board.isValidCoordinate(0, -1)).toBe(false);
      expect(board.isValidCoordinate(10, 0)).toBe(false);
      expect(board.isValidCoordinate(0, 10)).toBe(false);
    });
  });

  describe('getRandomStartPosition', () => {
    it('should return valid start positions for horizontal ships', () => {
      const { startRow, startCol } = board.getRandomStartPosition(3, 'horizontal');
      expect(startRow).toBeGreaterThanOrEqual(0);
      expect(startRow).toBeLessThan(10);
      expect(startCol).toBeGreaterThanOrEqual(0);
      expect(startCol).toBeLessThanOrEqual(7); // 10 - 3 = 7
    });

    it('should return valid start positions for vertical ships', () => {
      const { startRow, startCol } = board.getRandomStartPosition(3, 'vertical');
      expect(startRow).toBeGreaterThanOrEqual(0);
      expect(startRow).toBeLessThanOrEqual(7); // 10 - 3 = 7
      expect(startCol).toBeGreaterThanOrEqual(0);
      expect(startCol).toBeLessThan(10);
    });
  });

  describe('generateShipLocations', () => {
    it('should generate horizontal ship locations', () => {
      const locations = board.generateShipLocations(2, 3, 3, 'horizontal');
      expect(locations).toEqual(['23', '24', '25']);
    });

    it('should generate vertical ship locations', () => {
      const locations = board.generateShipLocations(2, 3, 3, 'vertical');
      expect(locations).toEqual(['23', '33', '43']);
    });
  });

  describe('canPlaceShip', () => {
    it('should return true for valid placement on empty board', () => {
      const locations = ['23', '24', '25'];
      expect(board.canPlaceShip(locations)).toBe(true);
    });

    it('should return false for invalid coordinate format', () => {
      const locations = ['123']; // Invalid coordinate - wrong length
      expect(() => board.canPlaceShip(locations)).toThrow('Invalid coordinate format');
    });

    it('should return false for out of bounds coordinates', () => {
      // Create a smaller board to test boundaries more easily
      const smallBoard = new Board(5);
      const outOfBoundsLocations = ['56', '57', '58']; // These exceed board size
      expect(smallBoard.canPlaceShip(outOfBoundsLocations)).toBe(false);
    });

    it('should return false for overlapping ships', () => {
      board.placeShip(['23', '24', '25']);
      const overlappingLocations = ['24', '34', '44'];
      expect(board.canPlaceShip(overlappingLocations)).toBe(false);
    });
  });

  describe('placeShip', () => {
    it('should place ship and mark grid', () => {
      const locations = ['23', '24', '25'];
      board.placeShip(locations);
      
      const grid = board.getGrid();
      expect(grid[2][3]).toBe('S');
      expect(grid[2][4]).toBe('S');
      expect(grid[2][5]).toBe('S');
      
      expect(board.getShips()).toHaveLength(1);
      expect(board.getShips()[0].getLocations()).toEqual(locations);
    });
  });

  describe('placeShipsRandomly', () => {
    it('should place all ships successfully', () => {
      board.placeShipsRandomly(3, 3);
      expect(board.getShips()).toHaveLength(3);
    });

    it('should throw error if unable to place all ships', () => {
      // Try to place too many large ships on a small board
      const smallBoard = new Board(3);
      expect(() => smallBoard.placeShipsRandomly(10, 3)).toThrow();
    });

    it('should not place overlapping ships', () => {
      board.placeShipsRandomly(5, 2);
      const ships = board.getShips();
      
      // Check no two ships share locations
      const allLocations = ships.flatMap(ship => ship.getLocations());
      const uniqueLocations = [...new Set(allLocations)];
      expect(allLocations).toHaveLength(uniqueLocations.length);
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      board.placeShip(['23', '24', '25']);
    });

    it('should process hit correctly', () => {
      const result = board.processGuess('24');
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.alreadyGuessed).toBe(false);
      
      const grid = board.getGrid();
      expect(grid[2][4]).toBe('X');
    });

    it('should process miss correctly', () => {
      const result = board.processGuess('00');
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.alreadyGuessed).toBe(false);
      
      const grid = board.getGrid();
      expect(grid[0][0]).toBe('O');
    });

    it('should detect sunk ship', () => {
      board.processGuess('23');
      board.processGuess('24');
      const result = board.processGuess('25');
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
    });

    it('should handle already guessed coordinates', () => {
      board.processGuess('24');
      const result = board.processGuess('24');
      
      expect(result.alreadyGuessed).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
    });
  });

  describe('allShipsSunk', () => {
    it('should return false when no ships are placed', () => {
      expect(board.allShipsSunk()).toBe(false);
    });

    it('should return false when ships are not sunk', () => {
      board.placeShip(['00', '01', '02']);
      expect(board.allShipsSunk()).toBe(false);
    });

    it('should return false when partially sunk', () => {
      board.placeShip(['00', '01', '02']);
      board.processGuess('00');
      expect(board.allShipsSunk()).toBe(false);
    });

    it('should return true when all ships are sunk', () => {
      board.placeShip(['00', '01', '02']);
      board.processGuess('00');
      board.processGuess('01');
      board.processGuess('02');
      expect(board.allShipsSunk()).toBe(true);
    });
  });

  describe('getRemainingShipsCount', () => {
    it('should return 0 for empty board', () => {
      expect(board.getRemainingShipsCount()).toBe(0);
    });

    it('should return correct count with unsunk ships', () => {
      board.placeShip(['00', '01', '02']);
      board.placeShip(['50', '51', '52']);
      expect(board.getRemainingShipsCount()).toBe(2);
    });

    it('should return correct count with partially sunk ships', () => {
      board.placeShip(['00', '01', '02']);
      board.placeShip(['50', '51', '52']);
      
      // Sink first ship
      board.processGuess('00');
      board.processGuess('01');
      board.processGuess('02');
      
      expect(board.getRemainingShipsCount()).toBe(1);
    });
  });

  describe('hasBeenGuessed', () => {
    it('should return false for unguessed coordinates', () => {
      expect(board.hasBeenGuessed('55')).toBe(false);
    });

    it('should return true for guessed coordinates', () => {
      board.processGuess('55');
      expect(board.hasBeenGuessed('55')).toBe(true);
    });
  });

  describe('getGrid', () => {
    it('should return a copy of the grid', () => {
      const grid1 = board.getGrid();
      const grid2 = board.getGrid();
      grid1[0][0] = 'X';
      expect(grid2[0][0]).toBe('~');
    });
  });

  describe('getShips', () => {
    it('should return a copy of ships array', () => {
      board.placeShip(['00', '01', '02']);
      const ships1 = board.getShips();
      const ships2 = board.getShips();
      ships1.push(null);
      expect(ships2).toHaveLength(1);
    });
  });
}); 