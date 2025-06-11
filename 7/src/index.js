#!/usr/bin/env node

import { Game } from './Game.js';

/**
 * Main entry point for the Sea Battle game
 */
async function main() {
  console.log('Starting Sea Battle Game...');
  
  // Create and start the game
  const game = new Game({
    boardSize: 10,
    numShips: 3,
    shipLength: 3
  });
  
  try {
    await game.startGame();
  } catch (error) {
    console.error('An error occurred during the game:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nGame interrupted. Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nGame terminated. Goodbye!');
  process.exit(0);
});

// Start the game
main().catch(error => {
  console.error('Fatal error starting game:', error);
  process.exit(1);
}); 