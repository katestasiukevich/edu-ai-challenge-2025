import readline from 'readline';
import { HumanPlayer, CPUPlayer } from './Player.js';
import { Display } from './Display.js';

/**
 * Main Game class that orchestrates the Sea Battle game
 */
export class Game {
  constructor(options = {}) {
    this.boardSize = options.boardSize || 10;
    this.numShips = options.numShips || 3;
    this.shipLength = options.shipLength || 3;
    
    this.humanPlayer = new HumanPlayer('Player');
    this.cpuPlayer = new CPUPlayer('CPU');
    this.display = new Display();
    this.gameOver = false;
    
    // Setup readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Initialize and start the game
   */
  async startGame() {
    try {
      this.display.showWelcome();
      this.display.showGameSetup(this.numShips, this.shipLength);
      
      // Setup both players' boards
      this.setupPlayers();
      
      // Main game loop
      await this.gameLoop();
      
    } catch (error) {
      this.display.showError(`Game initialization failed: ${error.message}`);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Setup both players' boards with ships
   */
  setupPlayers() {
    try {
      this.humanPlayer.setupBoard(this.numShips, this.shipLength);
      this.cpuPlayer.setupBoard(this.numShips, this.shipLength);
      this.display.showMessage("Ships placed successfully!");
    } catch (error) {
      throw new Error(`Failed to setup player boards: ${error.message}`);
    }
  }

  /**
   * Main game loop
   */
  async gameLoop() {
    while (!this.gameOver) {
      // Check for game over conditions
      if (this.checkGameOver()) {
        break;
      }

      // Display current state
      this.display.showBoards(
        this.humanPlayer.getOpponentBoard(),
        this.humanPlayer.getBoard()
      );

      // Player's turn
      const playerMadeValidMove = await this.handlePlayerTurn();
      
      if (!playerMadeValidMove) {
        continue; // Invalid move, try again
      }

      // Check if player won
      if (this.checkGameOver()) {
        break;
      }

      // CPU's turn
      this.handleCPUTurn();

      // Display status
      this.display.showGameStatus(
        this.humanPlayer.getRemainingShips(),
        this.cpuPlayer.getRemainingShips()
      );
    }

    this.endGame();
  }

  /**
   * Handle player's turn
   * @returns {Promise<boolean>} - True if valid move was made
   */
  async handlePlayerTurn() {
    return new Promise((resolve) => {
      this.display.showPlayerTurnPrompt();
      
      this.rl.question('> ', (input) => {
        const validation = this.humanPlayer.validateGuess(input?.trim());
        
        if (!validation.isValid) {
          this.display.showError(validation.error);
          resolve(false);
          return;
        }

        // Process the guess
        const result = this.cpuPlayer.receiveGuess(validation.coordinate);
        
        // Update player's opponent tracking board
        this.humanPlayer.getOpponentBoard().processGuess(validation.coordinate);
        
        // Show result
        this.display.showPlayerGuessResult(validation.coordinate, result);
        
        resolve(true);
      });
    });
  }

  /**
   * Handle CPU's turn
   */
  handleCPUTurn() {
    this.display.showCPUTurn();
    
    // Generate CPU guess
    const cpuGuess = this.cpuPlayer.generateGuess();
    
    // Process guess against human player
    const result = this.humanPlayer.receiveGuess(cpuGuess);
    
    // Update CPU's tracking information
    this.cpuPlayer.processGuessResult(cpuGuess, result);
    
    // Show result
    this.display.showCPUGuessResult(cpuGuess, result, this.cpuPlayer.getMode());
  }

  /**
   * Check if game is over
   * @returns {boolean} - True if game should end
   */
  checkGameOver() {
    if (this.cpuPlayer.isDefeated() || this.humanPlayer.isDefeated()) {
      this.gameOver = true;
      return true;
    }
    return false;
  }

  /**
   * End the game and show results
   */
  endGame() {
    const playerWon = this.cpuPlayer.isDefeated();
    
    // Show final boards
    this.display.showBoards(
      this.humanPlayer.getOpponentBoard(),
      this.humanPlayer.getBoard()
    );
    
    // Show game over message
    this.display.showGameOver(
      playerWon,
      this.humanPlayer.getRemainingShips(),
      this.cpuPlayer.getRemainingShips()
    );
  }

  /**
   * Get game configuration
   * @returns {object} - Current game configuration
   */
  getConfig() {
    return {
      boardSize: this.boardSize,
      numShips: this.numShips,
      shipLength: this.shipLength
    };
  }

  /**
   * Get current game state (useful for testing)
   * @returns {object} - Current game state
   */
  getGameState() {
    return {
      gameOver: this.gameOver,
      humanPlayerShips: this.humanPlayer.getRemainingShips(),
      cpuPlayerShips: this.cpuPlayer.getRemainingShips(),
      cpuMode: this.cpuPlayer.getMode()
    };
  }

  /**
   * Force end the game (useful for testing)
   */
  forceEnd() {
    this.gameOver = true;
    this.rl.close();
  }
} 