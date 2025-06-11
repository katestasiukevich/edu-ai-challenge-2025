import { Player, HumanPlayer, CPUPlayer } from '../src/Player.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer');
  });

  describe('constructor', () => {
    it('should create a player with name and boards', () => {
      expect(player.name).toBe('TestPlayer');
      expect(player.getBoard()).toBeDefined();
      expect(player.getOpponentBoard()).toBeDefined();
    });
  });

  describe('setupBoard', () => {
    it('should setup board with ships', () => {
      player.setupBoard(2, 3);
      expect(player.getBoard().getShips()).toHaveLength(2);
    });
  });

  describe('receiveGuess', () => {
    beforeEach(() => {
      player.setupBoard(1, 3);
    });

    it('should process guess and return result', () => {
      // We need to know where ships are to test this properly
      // Since placement is random, we'll test the return structure
      const result = player.receiveGuess('00');
      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('sunk');
      expect(result).toHaveProperty('alreadyGuessed');
    });
  });

  describe('isDefeated', () => {
    it('should return false when ships remain', () => {
      player.setupBoard(1, 3);
      expect(player.isDefeated()).toBe(false);
    });
  });

  describe('getRemainingShips', () => {
    it('should return correct count of remaining ships', () => {
      player.setupBoard(3, 2);
      expect(player.getRemainingShips()).toBe(3);
    });
  });
});

describe('HumanPlayer', () => {
  let humanPlayer;

  beforeEach(() => {
    humanPlayer = new HumanPlayer();
  });

  describe('constructor', () => {
    it('should create human player with default name', () => {
      expect(humanPlayer.name).toBe('Player');
    });

    it('should create human player with custom name', () => {
      const namedPlayer = new HumanPlayer('Alice');
      expect(namedPlayer.name).toBe('Alice');
    });
  });

  describe('validateGuess', () => {
    it('should accept valid two-digit coordinates', () => {
      const result = humanPlayer.validateGuess('34');
      expect(result.isValid).toBe(true);
      expect(result.coordinate).toBe('34');
    });

    it('should reject empty input', () => {
      const result = humanPlayer.validateGuess('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('two digits');
    });

    it('should reject null input', () => {
      const result = humanPlayer.validateGuess(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('two digits');
    });

    it('should reject single digit input', () => {
      const result = humanPlayer.validateGuess('3');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('two digits');
    });

    it('should reject three digit input', () => {
      const result = humanPlayer.validateGuess('345');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('two digits');
    });

    it('should reject coordinates out of bounds (high)', () => {
      const result = humanPlayer.validateGuess('AB');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid row and column');
    });

    it('should reject coordinates out of bounds (too high)', () => {
      const result = humanPlayer.validateGuess('99');
      expect(result.isValid).toBe(true); // 9,9 is actually valid
      
      // Test actual out of bounds
      const result2 = humanPlayer.validateGuess('AA');
      expect(result2.isValid).toBe(false);
    });

    it('should reject already guessed coordinates', () => {
      // Make a guess first
      humanPlayer.getOpponentBoard().processGuess('34');
      
      const result = humanPlayer.validateGuess('34');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('already guessed');
    });

    it('should accept boundary coordinates', () => {
      expect(humanPlayer.validateGuess('00').isValid).toBe(true);
      expect(humanPlayer.validateGuess('09').isValid).toBe(true);
      expect(humanPlayer.validateGuess('90').isValid).toBe(true);
      expect(humanPlayer.validateGuess('99').isValid).toBe(true);
    });
  });
});

describe('CPUPlayer', () => {
  let cpuPlayer;

  beforeEach(() => {
    cpuPlayer = new CPUPlayer();
  });

  describe('constructor', () => {
    it('should create CPU player with default name and hunt mode', () => {
      expect(cpuPlayer.name).toBe('CPU');
      expect(cpuPlayer.getMode()).toBe('hunt');
      expect(cpuPlayer.getTargetQueueLength()).toBe(0);
    });

    it('should create CPU player with custom name', () => {
      const namedCPU = new CPUPlayer('HAL');
      expect(namedCPU.name).toBe('HAL');
    });
  });

  describe('generateGuess', () => {
    it('should generate valid coordinate strings', () => {
      const guess = cpuPlayer.generateGuess();
      expect(guess).toMatch(/^[0-9][0-9]$/);
      
      const [row, col] = [parseInt(guess[0]), parseInt(guess[1])];
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(10);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(10);
    });

    it('should not repeat guesses', () => {
      const guesses = new Set();
      
      // Generate multiple guesses and ensure they're unique
      for (let i = 0; i < 10; i++) {
        const guess = cpuPlayer.generateGuess();
        cpuPlayer.processGuessResult(guess, { hit: false, sunk: false });
        guesses.add(guess);
      }
      
      expect(guesses.size).toBe(10); // All guesses should be unique
    });
  });

  describe('generateHuntGuess', () => {
    it('should generate random valid coordinates', () => {
      const guess = cpuPlayer.generateHuntGuess();
      expect(guess).toMatch(/^[0-9][0-9]$/);
    });
  });

  describe('processGuessResult - Hunt Mode', () => {
    it('should stay in hunt mode after miss', () => {
      const guess = cpuPlayer.generateGuess();
      cpuPlayer.processGuessResult(guess, { hit: false, sunk: false });
      
      expect(cpuPlayer.getMode()).toBe('hunt');
      expect(cpuPlayer.getTargetQueueLength()).toBe(0);
    });

    it('should switch to target mode after hit', () => {
      const guess = '44'; // Center position for good adjacent options
      cpuPlayer.processGuessResult(guess, { hit: true, sunk: false });
      
      expect(cpuPlayer.getMode()).toBe('target');
      expect(cpuPlayer.getTargetQueueLength()).toBeGreaterThan(0);
    });

    it('should return to hunt mode after sinking ship', () => {
      cpuPlayer.processGuessResult('44', { hit: true, sunk: true });
      
      expect(cpuPlayer.getMode()).toBe('hunt');
      expect(cpuPlayer.getTargetQueueLength()).toBe(0);
    });
  });

  describe('processGuessResult - Target Mode', () => {
    beforeEach(() => {
      // Put CPU in target mode
      cpuPlayer.processGuessResult('44', { hit: true, sunk: false });
    });

    it('should continue targeting after hit', () => {
      const originalQueueLength = cpuPlayer.getTargetQueueLength();
      cpuPlayer.processGuessResult('45', { hit: true, sunk: false });
      
      expect(cpuPlayer.getMode()).toBe('target');
      // Should add more adjacent targets
      expect(cpuPlayer.getTargetQueueLength()).toBeGreaterThan(0);
    });

    it('should return to hunt after sinking ship', () => {
      cpuPlayer.processGuessResult('45', { hit: true, sunk: true });
      
      expect(cpuPlayer.getMode()).toBe('hunt');
      expect(cpuPlayer.getTargetQueueLength()).toBe(0);
    });
  });

  describe('addAdjacentTargets', () => {
    it('should add valid adjacent coordinates', () => {
      cpuPlayer.addAdjacentTargets('44');
      
      const queueLength = cpuPlayer.getTargetQueueLength();
      expect(queueLength).toBe(4); // All 4 adjacent cells should be valid
    });

    it('should handle edge coordinates correctly', () => {
      cpuPlayer.addAdjacentTargets('00'); // Top-left corner
      
      const queueLength = cpuPlayer.getTargetQueueLength();
      expect(queueLength).toBe(2); // Only right and down are valid
    });

    it('should not add already guessed coordinates', () => {
      // Guess some adjacent coordinates first
      cpuPlayer.processGuessResult('43', { hit: false, sunk: false });
      cpuPlayer.processGuessResult('45', { hit: false, sunk: false });
      
      cpuPlayer.addAdjacentTargets('44');
      
      // Should only add the unguessed adjacent coordinates
      const queueLength = cpuPlayer.getTargetQueueLength();
      expect(queueLength).toBe(2); // Only up and down remain
    });
  });

  describe('AI behavior integration', () => {
    it('should follow hunt-target pattern correctly', () => {
      // Initial state: hunt mode
      expect(cpuPlayer.getMode()).toBe('hunt');
      
      // Hit a ship
      cpuPlayer.processGuessResult('55', { hit: true, sunk: false });
      expect(cpuPlayer.getMode()).toBe('target');
      expect(cpuPlayer.getTargetQueueLength()).toBeGreaterThan(0);
      
      // Miss while targeting
      const adjacentGuess = cpuPlayer.generateGuess();
      cpuPlayer.processGuessResult(adjacentGuess, { hit: false, sunk: false });
      expect(cpuPlayer.getMode()).toBe('target'); // Should stay in target mode
      
      // Sink the ship
      const anotherGuess = cpuPlayer.generateGuess();
      cpuPlayer.processGuessResult(anotherGuess, { hit: true, sunk: true });
      expect(cpuPlayer.getMode()).toBe('hunt');
      expect(cpuPlayer.getTargetQueueLength()).toBe(0);
    });

    it('should handle board boundary constraints', () => {
      // Test corner position
      cpuPlayer.processGuessResult('00', { hit: true, sunk: false });
      expect(cpuPlayer.getTargetQueueLength()).toBeLessThanOrEqual(2);
      
      // Reset and test edge position  
      cpuPlayer = new CPUPlayer();
      cpuPlayer.processGuessResult('50', { hit: true, sunk: false });
      expect(cpuPlayer.getTargetQueueLength()).toBeLessThanOrEqual(3);
    });
  });

  describe('edge cases', () => {
    it('should handle full board scenario', () => {
      // Fill most of the board with guesses
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) { // Leave last column
          const coord = `${row}${col}`;
          cpuPlayer.processGuessResult(coord, { hit: false, sunk: false });
        }
      }
      
      // Should still be able to generate valid guesses
      const guess = cpuPlayer.generateGuess();
      expect(guess).toMatch(/^[0-9]9$/); // Should be from last column
    });
  });
}); 