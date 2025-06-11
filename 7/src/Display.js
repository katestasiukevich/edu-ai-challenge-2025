/**
 * Display class for handling console output and board visualization
 */
export class Display {
  constructor() {
    this.boardSize = 10;
  }

  /**
   * Display both player and opponent boards side by side
   * @param {Board} opponentBoard - Player's view of opponent board
   * @param {Board} playerBoard - Player's own board
   */
  showBoards(opponentBoard, playerBoard) {
    console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
    
    // Header with column numbers
    const header = this.generateHeader();
    console.log(`${header}     ${header}`);

    // Board rows
    for (let i = 0; i < this.boardSize; i++) {
      const opponentRow = this.generateRow(i, opponentBoard.getGrid());
      const playerRow = this.generateRow(i, playerBoard.getGrid());
      console.log(`${opponentRow}    ${playerRow}`);
    }
    console.log();
  }

  /**
   * Generate header row with column numbers
   * @returns {string} - Formatted header string
   */
  generateHeader() {
    let header = '  ';
    for (let col = 0; col < this.boardSize; col++) {
      header += `${col} `;
    }
    return header;
  }

  /**
   * Generate a single board row
   * @param {number} rowIndex - Row index
   * @param {string[][]} grid - Board grid
   * @returns {string} - Formatted row string
   */
  generateRow(rowIndex, grid) {
    let row = `${rowIndex} `;
    for (let col = 0; col < this.boardSize; col++) {
      row += `${grid[rowIndex][col]} `;
    }
    return row;
  }

  /**
   * Display welcome message
   */
  showWelcome() {
    console.log("\nWelcome to Sea Battle!");
    console.log("======================");
    console.log("Try to sink all enemy ships before they sink yours!");
    console.log("\nLegend:");
    console.log("~ = Water (unknown)");
    console.log("S = Your ships");
    console.log("X = Hit");
    console.log("O = Miss");
    console.log();
  }

  /**
   * Display game setup information
   * @param {number} numShips - Number of ships per player
   * @param {number} shipLength - Length of each ship
   */
  showGameSetup(numShips, shipLength) {
    console.log(`Setting up game with ${numShips} ships of length ${shipLength} each.`);
    console.log("Placing ships randomly...");
  }

  /**
   * Display player's turn prompt
   */
  showPlayerTurnPrompt() {
    console.log("Your turn! Enter coordinates to attack (e.g., 00, 34, 98):");
  }

  /**
   * Display CPU's turn indicator
   */
  showCPUTurn() {
    console.log("\n--- CPU's Turn ---");
  }

  /**
   * Display player guess result
   * @param {string} coordinate - Guessed coordinate
   * @param {object} result - Result of the guess
   */
  showPlayerGuessResult(coordinate, result) {
    if (result.alreadyGuessed) {
      console.log("You already guessed that location!");
      return;
    }

    if (result.hit) {
      if (result.sunk) {
        console.log(`🎯 HIT at ${coordinate}! You sunk an enemy battleship! 🚢`);
      } else {
        console.log(`🎯 HIT at ${coordinate}!`);
      }
    } else {
      console.log(`💦 MISS at ${coordinate}.`);
    }
  }

  /**
   * Display CPU guess result
   * @param {string} coordinate - CPU's guessed coordinate
   * @param {object} result - Result of the guess
   * @param {string} mode - CPU's current mode
   */
  showCPUGuessResult(coordinate, result, mode) {
    const modeText = mode === 'target' ? ' (targeting)' : ' (hunting)';
    
    if (result.hit) {
      if (result.sunk) {
        console.log(`💥 CPU HIT at ${coordinate}${modeText}! CPU sunk your battleship! 🚢`);
      } else {
        console.log(`💥 CPU HIT at ${coordinate}${modeText}!`);
      }
    } else {
      console.log(`🌊 CPU MISS at ${coordinate}${modeText}.`);
    }
  }

  /**
   * Display game over message
   * @param {boolean} playerWon - True if player won
   * @param {number} playerShips - Remaining player ships
   * @param {number} cpuShips - Remaining CPU ships
   */
  showGameOver(playerWon, playerShips, cpuShips) {
    console.log('\n' + '='.repeat(50));
    
    if (playerWon) {
      console.log('🎉 CONGRATULATIONS! YOU WON! 🎉');
      console.log('You successfully sunk all enemy battleships!');
    } else {
      console.log('💀 GAME OVER! CPU WINS! 💀');
      console.log('The CPU sunk all your battleships!');
    }
    
    console.log(`\nFinal Score:`);
    console.log(`Player ships remaining: ${playerShips}`);
    console.log(`CPU ships remaining: ${cpuShips}`);
    console.log('='.repeat(50));
  }

  /**
   * Display error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    console.log(`❌ Error: ${message}`);
  }

  /**
   * Display game status
   * @param {number} playerShips - Player's remaining ships
   * @param {number} cpuShips - CPU's remaining ships
   */
  showGameStatus(playerShips, cpuShips) {
    console.log(`\n📊 Status: You have ${playerShips} ships, CPU has ${cpuShips} ships remaining.`);
  }

  /**
   * Display a simple message
   * @param {string} message - Message to display
   */
  showMessage(message) {
    console.log(message);
  }

  /**
   * Clear the console (for better visual experience)
   */
  clearScreen() {
    // Only clear on systems that support it
    if (process.stdout.isTTY) {
      console.clear();
    }
  }

  /**
   * Add spacing for better readability
   * @param {number} lines - Number of blank lines to add
   */
  addSpacing(lines = 1) {
    for (let i = 0; i < lines; i++) {
      console.log();
    }
  }
} 