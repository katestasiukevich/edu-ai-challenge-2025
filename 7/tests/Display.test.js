import { Display } from '../src/Display.js';
import { Board } from '../src/Board.js';

describe('Display', () => {
  let display;
  let board1, board2;
  let consoleOutput = [];

  // Simple console mock
  const originalConsole = global.console;
  
  beforeEach(() => {
    consoleOutput = [];
    global.console = {
      ...originalConsole,
      log: (...args) => {
        consoleOutput.push(args.join(' '));
      },
      clear: () => {
        consoleOutput.push('CLEAR');
      }
    };
    
    display = new Display();
    board1 = new Board(10);
    board2 = new Board(10);
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  describe('constructor', () => {
    it('should create display with default board size', () => {
      expect(display.boardSize).toBe(10);
    });
  });

  describe('generateHeader', () => {
    it('should generate correct header format', () => {
      const header = display.generateHeader();
      expect(header).toBe('  0 1 2 3 4 5 6 7 8 9 ');
    });
  });

  describe('generateRow', () => {
    it('should generate correct row format', () => {
      const grid = board1.getGrid();
      const row = display.generateRow(5, grid);
      expect(row).toBe('5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ');
    });

    it('should handle mixed cell types', () => {
      const grid = board1.getGrid();
      grid[3][0] = 'X';
      grid[3][1] = 'O';
      grid[3][2] = 'S';
      
      const row = display.generateRow(3, grid);
      expect(row).toBe('3 X O S ~ ~ ~ ~ ~ ~ ~ ');
    });
  });

  describe('showBoards', () => {
    beforeEach(() => {
      board1.placeShip(['23', '24', '25']);
      board2.placeShip(['45', '46', '47']);
    });

    it('should display both boards with headers', () => {
      display.showBoards(board1, board2);
      
      // Check that console.log was called multiple times
      expect(consoleOutput.length).toBeGreaterThan(10);
      
      // Check for specific content
      expect(consoleOutput.join(' ')).toContain('OPPONENT BOARD');
      expect(consoleOutput.join(' ')).toContain('YOUR BOARD');
    });

    it('should format boards side by side', () => {
      display.showBoards(board1, board2);
      
      // Find a row call that should show the side-by-side format
      const rowCalls = consoleOutput.filter(call => 
        call.includes('~') && call.includes('    ')
      );
      
      expect(rowCalls.length).toBeGreaterThan(0);
    });
  });

  describe('showWelcome', () => {
    it('should display welcome message with legend', () => {
      display.showWelcome();
      
      expect(consoleOutput.join(' ')).toContain('Welcome to Sea Battle!');
      expect(consoleOutput.join(' ')).toContain('~ = Water');
      expect(consoleOutput.join(' ')).toContain('S = Your ships');
      expect(consoleOutput.join(' ')).toContain('X = Hit');
      expect(consoleOutput.join(' ')).toContain('O = Miss');
    });
  });

  describe('showGameSetup', () => {
    it('should display setup information', () => {
      display.showGameSetup(3, 4);
      
      expect(consoleOutput.join(' ')).toContain('Setting up game with 3 ships of length 4 each.');
      expect(consoleOutput.join(' ')).toContain('Placing ships randomly...');
    });
  });

  describe('showPlayerTurnPrompt', () => {
    it('should display player turn prompt', () => {
      display.showPlayerTurnPrompt();
      
      expect(consoleOutput.join(' ')).toContain('Your turn! Enter coordinates to attack (e.g., 00, 34, 98):');
    });
  });

  describe('showCPUTurn', () => {
    it('should display CPU turn indicator', () => {
      display.showCPUTurn();
      
      expect(consoleOutput.join(' ')).toContain('\n--- CPU\'s Turn ---');
    });
  });

  describe('showPlayerGuessResult', () => {
    it('should display already guessed message', () => {
      const result = { alreadyGuessed: true };
      display.showPlayerGuessResult('34', result);
      
      expect(consoleOutput.join(' ')).toContain('You already guessed that location!');
    });

    it('should display hit message', () => {
      const result = { hit: true, sunk: false, alreadyGuessed: false };
      display.showPlayerGuessResult('34', result);
      
      expect(consoleOutput.join(' ')).toContain('🎯 HIT at 34!');
    });

    it('should display sunk ship message', () => {
      const result = { hit: true, sunk: true, alreadyGuessed: false };
      display.showPlayerGuessResult('34', result);
      
      expect(consoleOutput.join(' ')).toContain('🎯 HIT at 34! You sunk an enemy battleship! 🚢');
    });

    it('should display miss message', () => {
      const result = { hit: false, sunk: false, alreadyGuessed: false };
      display.showPlayerGuessResult('34', result);
      
      expect(consoleOutput.join(' ')).toContain('💦 MISS at 34.');
    });
  });

  describe('showCPUGuessResult', () => {
    it('should display CPU hit in hunt mode', () => {
      const result = { hit: true, sunk: false };
      display.showCPUGuessResult('56', result, 'hunt');
      
      expect(consoleOutput.join(' ')).toContain('💥 CPU HIT at 56 (hunting)!');
    });

    it('should display CPU hit and sunk in target mode', () => {
      const result = { hit: true, sunk: true };
      display.showCPUGuessResult('56', result, 'target');
      
      expect(consoleOutput.join(' ')).toContain('💥 CPU HIT at 56 (targeting)! CPU sunk your battleship! 🚢');
    });

    it('should display CPU miss in target mode', () => {
      const result = { hit: false, sunk: false };
      display.showCPUGuessResult('56', result, 'target');
      
      expect(consoleOutput.join(' ')).toContain('🌊 CPU MISS at 56 (targeting).');
    });

    it('should display CPU miss in hunt mode', () => {
      const result = { hit: false, sunk: false };
      display.showCPUGuessResult('56', result, 'hunt');
      
      expect(consoleOutput.join(' ')).toContain('🌊 CPU MISS at 56 (hunting).');
    });
  });

  describe('showGameOver', () => {
    it('should display player victory', () => {
      display.showGameOver(true, 2, 0);
      
      expect(consoleOutput.join(' ')).toContain('CONGRATULATIONS! YOU WON!');
      expect(consoleOutput.join(' ')).toContain('You successfully sunk all enemy battleships!');
      expect(consoleOutput.join(' ')).toContain('Player ships remaining: 2');
      expect(consoleOutput.join(' ')).toContain('CPU ships remaining: 0');
    });

    it('should display player defeat', () => {
      display.showGameOver(false, 0, 3);
      
      expect(consoleOutput.join(' ')).toContain('GAME OVER! CPU WINS!');
      expect(consoleOutput.join(' ')).toContain('The CPU sunk all your battleships!');
      expect(consoleOutput.join(' ')).toContain('Player ships remaining: 0');
      expect(consoleOutput.join(' ')).toContain('CPU ships remaining: 3');
    });
  });

  describe('showError', () => {
    it('should display error message with emoji', () => {
      display.showError('Invalid input');
      
      expect(consoleOutput.join(' ')).toContain('❌ Error: Invalid input');
    });
  });

  describe('showGameStatus', () => {
    it('should display current ship counts', () => {
      display.showGameStatus(3, 2);
      
      expect(consoleOutput.join(' ')).toContain('\n📊 Status: You have 3 ships, CPU has 2 ships remaining.');
    });
  });

  describe('showMessage', () => {
    it('should display custom message', () => {
      display.showMessage('Custom message');
      
      expect(consoleOutput.join(' ')).toContain('Custom message');
    });
  });

  describe('addSpacing', () => {
    it('should add single blank line by default', () => {
      const initialLength = consoleOutput.length;
      display.addSpacing();
      
      expect(consoleOutput.length).toBe(initialLength + 1);
    });

    it('should add multiple blank lines', () => {
      const initialLength = consoleOutput.length;
      display.addSpacing(3);
      
      expect(consoleOutput.length).toBe(initialLength + 3);
    });
  });

  describe('clearScreen', () => {
    it('should call console.clear when TTY is available', () => {
      // Mock process.stdout.isTTY
      const originalIsTTY = process.stdout.isTTY;
      process.stdout.isTTY = true;
      
      display.clearScreen();
      
      expect(consoleOutput.join(' ')).toContain('CLEAR');
      
      // Restore original value
      process.stdout.isTTY = originalIsTTY;
    });

    it('should not call console.clear when TTY is not available', () => {
      // Mock process.stdout.isTTY
      const originalIsTTY = process.stdout.isTTY;
      process.stdout.isTTY = false;
      
      display.clearScreen();
      
      expect(consoleOutput.join(' ')).not.toContain('CLEAR');
      
      // Restore original value
      process.stdout.isTTY = originalIsTTY;
    });
  });

  describe('board visualization integration', () => {
    it('should correctly visualize complex board states', () => {
      // Setup complex board state
      board1.placeShip(['00', '01', '02']); // Horizontal ship
      board1.processGuess('00'); // Hit
      board1.processGuess('10'); // Miss
      
      board2.placeShip(['50', '60', '70']); // Vertical ship
      board2.processGuess('50'); // Hit
      board2.processGuess('51'); // Miss
      
      display.showBoards(board1, board2);
      
      // Verify that complex states are handled
      expect(consoleOutput.join(' ')).toContain('OPPONENT BOARD');
      expect(consoleOutput.join(' ')).toContain('YOUR BOARD');
    });

    it('should handle empty boards', () => {
      display.showBoards(board1, board2);
      
      // Should still display boards even when empty
      expect(consoleOutput.length).toBeGreaterThan(10);
    });
  });
}); 