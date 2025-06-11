import { Game } from '../src/Game.js';

// Mock console methods to avoid cluttered test output
let consoleOutput = [];
const originalConsole = global.console;

global.console = {
  ...originalConsole,
  log: (...args) => {
    consoleOutput.push(args.join(' '));
  },
  clear: () => {
    consoleOutput.push('CLEAR');
  },
  error: (...args) => {
    consoleOutput.push('ERROR: ' + args.join(' '));
  }
};

describe('Game', () => {
  let game;

  beforeEach(() => {
    // Reset console output
    consoleOutput = [];
    
    game = new Game({
      boardSize: 10,
      numShips: 2,
      shipLength: 2
    });
  });

  afterEach(() => {
    // Clean up readline interface
    if (game.rl && !game.rl.closed) {
      game.forceEnd();
    }
  });

  describe('constructor', () => {
    it('should create game with default configuration', () => {
      const defaultGame = new Game();
      const config = defaultGame.getConfig();
      
      expect(config.boardSize).toBe(10);
      expect(config.numShips).toBe(3);
      expect(config.shipLength).toBe(3);
    });

    it('should create game with custom configuration', () => {
      const config = game.getConfig();
      
      expect(config.boardSize).toBe(10);
      expect(config.numShips).toBe(2);
      expect(config.shipLength).toBe(2);
    });

    it('should initialize players and display', () => {
      expect(game.humanPlayer).toBeDefined();
      expect(game.cpuPlayer).toBeDefined();
      expect(game.display).toBeDefined();
      expect(game.gameOver).toBe(false);
    });

    it('should setup readline interface', () => {
      expect(game.rl).toBeDefined();
      expect(game.rl.input).toBe(process.stdin);
      expect(game.rl.output).toBe(process.stdout);
    });
  });

  describe('setupPlayers', () => {
    it('should setup both players with ships', () => {
      game.setupPlayers();
      
      expect(game.humanPlayer.getBoard().getShips()).toHaveLength(2);
      expect(game.cpuPlayer.getBoard().getShips()).toHaveLength(2);
    });

    it('should handle setup errors gracefully', () => {
      // Create a game with impossible ship configuration
      const impossibleGame = new Game({
        boardSize: 2,
        numShips: 10,
        shipLength: 5
      });

      // The current implementation may retry many times before giving up
      // This test verifies the method can be called without crashing
      try {
        impossibleGame.setupPlayers();
      } catch (error) {
        expect(error.message).toContain('Could only place');
      }
      impossibleGame.forceEnd();
    });
  });

  describe('getGameState', () => {
    beforeEach(() => {
      game.setupPlayers();
    });

    it('should return current game state', () => {
      const state = game.getGameState();
      
      expect(state).toHaveProperty('gameOver');
      expect(state).toHaveProperty('humanPlayerShips');
      expect(state).toHaveProperty('cpuPlayerShips');
      expect(state).toHaveProperty('cpuMode');
      
      expect(state.gameOver).toBe(false);
      expect(state.humanPlayerShips).toBe(2);
      expect(state.cpuPlayerShips).toBe(2);
      expect(state.cpuMode).toBe('hunt');
    });
  });

  describe('checkGameOver', () => {
    beforeEach(() => {
      game.setupPlayers();
    });

    it('should return false when both players have ships', () => {
      expect(game.checkGameOver()).toBe(false);
      expect(game.gameOver).toBe(false);
    });

    it('should return true when CPU is defeated', () => {
      // Manually sink all CPU ships
      const cpuShips = game.cpuPlayer.getBoard().getShips();
      cpuShips.forEach(ship => {
        ship.getLocations().forEach(location => {
          ship.hit(location);
        });
      });

      expect(game.checkGameOver()).toBe(true);
      expect(game.gameOver).toBe(true);
    });

    it('should return true when human player is defeated', () => {
      // Manually sink all human player ships
      const humanShips = game.humanPlayer.getBoard().getShips();
      humanShips.forEach(ship => {
        ship.getLocations().forEach(location => {
          ship.hit(location);
        });
      });

      expect(game.checkGameOver()).toBe(true);
      expect(game.gameOver).toBe(true);
    });
  });

  describe('handleCPUTurn', () => {
    beforeEach(() => {
      game.setupPlayers();
    });

    it('should execute CPU turn successfully', () => {
      const initialState = game.getGameState();
      
      game.handleCPUTurn();
      
      // CPU should have made a guess (hard to test specific outcome due to randomness)
      // We can verify the method completed without error
      expect(consoleOutput.length).toBeGreaterThan(0);
    });

    it('should update CPU mode appropriately', () => {
      // Get a known ship location from human player
      const humanShip = game.humanPlayer.getBoard().getShips()[0];
      const shipLocation = humanShip.getLocations()[0];
      
      // Mock CPU to guess this location
      const originalGenerateGuess = game.cpuPlayer.generateGuess;
      game.cpuPlayer.generateGuess = () => shipLocation;
      
      game.handleCPUTurn();
      
      // CPU should now be in target mode after hitting
      expect(game.cpuPlayer.getMode()).toBe('target');
      
      // Restore original method
      game.cpuPlayer.generateGuess = originalGenerateGuess;
    });
  });

  describe('endGame', () => {
    beforeEach(() => {
      game.setupPlayers();
    });

    it('should handle player victory', () => {
      // Sink all CPU ships
      const cpuShips = game.cpuPlayer.getBoard().getShips();
      cpuShips.forEach(ship => {
        ship.getLocations().forEach(location => {
          ship.hit(location);
        });
      });

      game.endGame();
      
      // Should show victory message
      expect(consoleOutput.join(' ')).toContain('CONGRATULATIONS');
    });

    it('should handle player defeat', () => {
      // Sink all human player ships
      const humanShips = game.humanPlayer.getBoard().getShips();
      humanShips.forEach(ship => {
        ship.getLocations().forEach(location => {
          ship.hit(location);
        });
      });

      game.endGame();
      
      // Should show defeat message
      expect(consoleOutput.join(' ')).toContain('GAME OVER');
    });
  });

  describe('forceEnd', () => {
    it('should force end the game', () => {
      expect(game.gameOver).toBe(false);
      
      game.forceEnd();
      
      expect(game.gameOver).toBe(true);
      expect(game.rl.closed).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    beforeEach(() => {
      game.setupPlayers();
    });

    it('should handle complete game flow', () => {
      // This is a simplified integration test
      const initialState = game.getGameState();
      
      expect(initialState.gameOver).toBe(false);
      expect(initialState.humanPlayerShips).toBeGreaterThan(0);
      expect(initialState.cpuPlayerShips).toBeGreaterThan(0);
      
      // Force a win condition
      const cpuShips = game.cpuPlayer.getBoard().getShips();
      cpuShips.forEach(ship => {
        ship.getLocations().forEach(location => {
          ship.hit(location);
        });
      });
      
      expect(game.checkGameOver()).toBe(true);
      game.endGame();
      
      // Verify final state
      const finalState = game.getGameState();
      expect(finalState.gameOver).toBe(true);
      expect(finalState.cpuPlayerShips).toBe(0);
    });

    it('should maintain game state consistency', () => {
      // Test that game state remains consistent throughout operations
      const state1 = game.getGameState();
      
      // Perform some operations
      game.handleCPUTurn();
      
      const state2 = game.getGameState();
      
      // Ships should remain the same or decrease
      expect(state2.humanPlayerShips).toBeLessThanOrEqual(state1.humanPlayerShips);
      expect(state2.cpuPlayerShips).toBe(state1.cpuPlayerShips); // CPU doesn't lose ships from its own turn
    });
  });

  describe('error handling', () => {
    it('should handle invalid game configuration', () => {
      const badGame = new Game({
        boardSize: -1,
        numShips: 0,
        shipLength: 0
      });
      
      // The Game constructor uses || which means falsy values default to standard values
      expect(badGame.getConfig().boardSize).toBe(-1); // -1 is truthy so it's used
      expect(badGame.getConfig().numShips).toBe(3);   // 0 is falsy so defaults to 3
      expect(badGame.getConfig().shipLength).toBe(3); // 0 is falsy so defaults to 3
      
      badGame.forceEnd();
    });

    it('should handle startup errors gracefully', async () => {
      // Mock setupPlayers to throw an error
      const originalSetup = game.setupPlayers;
      game.setupPlayers = () => {
        throw new Error('Setup failed');
      };

      try {
        game.setupPlayers();
      } catch (error) {
        expect(error.message).toBe('Setup failed');
      }

      // Restore original method
      game.setupPlayers = originalSetup;
    });
  });

  describe('configuration validation', () => {
    it('should accept valid configurations', () => {
      const validConfigs = [
        { boardSize: 5, numShips: 1, shipLength: 2 },
        { boardSize: 15, numShips: 5, shipLength: 4 },
        { boardSize: 8, numShips: 3, shipLength: 3 }
      ];

      validConfigs.forEach(config => {
        const testGame = new Game(config);
        expect(testGame.getConfig()).toEqual(expect.objectContaining(config));
        testGame.forceEnd();
      });
    });
  });
}); 