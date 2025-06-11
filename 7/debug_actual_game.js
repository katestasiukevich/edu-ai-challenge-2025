import { Game } from './src/Game.js';

console.log('🔍 Testing Actual Game Class...\n');

// Create a game instance
const game = new Game({
  boardSize: 10,
  numShips: 3,
  shipLength: 3
});

// Setup the game
game.setupPlayers();

// Get CPU ship positions for testing
const cpuGrid = game.cpuPlayer.getBoard().getGrid();
let cpuShipPositions = [];
console.log('CPU Player Board (actual ships):');
for (let i = 0; i < 10; i++) {
  let row = `${i}: `;
  for (let j = 0; j < 10; j++) {
    row += cpuGrid[i][j] + ' ';
    if (cpuGrid[i][j] === 'S') {
      cpuShipPositions.push(`${i}${j}`);
    }
  }
  console.log(row);
}

console.log('\nHuman Player Opponent Tracking Board (before any guesses):');
const humanOpponentGrid = game.humanPlayer.getOpponentBoard().getGrid();
for (let i = 0; i < 10; i++) {
  let row = `${i}: `;
  for (let j = 0; j < 10; j++) {
    row += humanOpponentGrid[i][j] + ' ';
  }
  console.log(row);
}

if (cpuShipPositions.length > 0) {
  const testCoordinate = cpuShipPositions[0];
  console.log(`\nTesting game logic with ship hit at ${testCoordinate}:`);
  
  // Simulate the exact logic from Game.js handlePlayerTurn()
  const validation = game.humanPlayer.validateGuess(testCoordinate);
  console.log('Validation result:', validation);
  
  if (validation.isValid) {
    // Process the guess (this is the fixed logic)
    const result = game.cpuPlayer.receiveGuess(validation.coordinate);
    console.log('CPU receiveGuess result:', result);
    
    // Update player's opponent tracking board based on the actual result (FIXED CODE)
    const [row, col] = game.humanPlayer.getOpponentBoard().parseCoordinate(validation.coordinate);
    game.humanPlayer.getOpponentBoard().guesses.add(validation.coordinate);
    
    if (result.hit) {
      game.humanPlayer.getOpponentBoard().grid[row][col] = 'X';
      console.log('✅ Marked as HIT on tracking board');
    } else {
      game.humanPlayer.getOpponentBoard().grid[row][col] = 'O';  
      console.log('❌ Marked as MISS on tracking board');
    }
    
    console.log('\nHuman Player Opponent Tracking Board (after hit):');
    const humanOpponentGridAfter = game.humanPlayer.getOpponentBoard().getGrid();
    for (let i = 0; i < 10; i++) {
      let row = `${i}: `;
      for (let j = 0; j < 10; j++) {
        row += humanOpponentGridAfter[i][j] + ' ';
      }
      console.log(row);
    }
  }
  
  // Test a miss
  console.log('\nTesting with a miss at 00:');
  const missResult = game.cpuPlayer.receiveGuess('00');
  console.log('Miss result:', missResult);
  
  const [missRow, missCol] = game.humanPlayer.getOpponentBoard().parseCoordinate('00');
  game.humanPlayer.getOpponentBoard().guesses.add('00');
  
  if (missResult.hit) {
    game.humanPlayer.getOpponentBoard().grid[missRow][missCol] = 'X';
    console.log('✅ Marked as HIT on tracking board');
  } else {
    game.humanPlayer.getOpponentBoard().grid[missRow][missCol] = 'O';
    console.log('❌ Marked as MISS on tracking board');  
  }
  
  console.log('\nFinal Tracking Board:');
  const finalGrid = game.humanPlayer.getOpponentBoard().getGrid();
  for (let i = 0; i < 10; i++) {
    let row = `${i}: `;
    for (let j = 0; j < 10; j++) {
      row += finalGrid[i][j] + ' ';
    }
    console.log(row);
  }
}

console.log('\n🎯 Game Logic Test Complete!'); 