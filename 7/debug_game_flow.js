import { Game } from './src/Game.js';
import { CPUPlayer, HumanPlayer } from './src/Player.js';

console.log('🔍 Debugging Game Flow...\n');

// Create players like the game does
const humanPlayer = new HumanPlayer('Player');
const cpuPlayer = new CPUPlayer('CPU');

// Setup boards
humanPlayer.setupBoard(3, 3);
cpuPlayer.setupBoard(3, 3);

console.log('CPU Player Board (actual ships):');
const cpuGrid = cpuPlayer.getBoard().getGrid();
let cpuShipPositions = [];
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

console.log('\nHuman Player Opponent Tracking Board (what player sees):');
const humanOpponentGrid = humanPlayer.getOpponentBoard().getGrid();
for (let i = 0; i < 10; i++) {
  let row = `${i}: `;
  for (let j = 0; j < 10; j++) {
    row += humanOpponentGrid[i][j] + ' ';
  }
  console.log(row);
}

console.log(`\nCPU ship positions: ${cpuShipPositions.join(', ')}`);

if (cpuShipPositions.length > 0) {
  const testCoordinate = cpuShipPositions[0];
  console.log(`\nTesting attack on CPU ship at ${testCoordinate}:`);
  
  // This is what happens in Game.js handlePlayerTurn()
  // 1. Process guess against CPU player
  const result = cpuPlayer.receiveGuess(testCoordinate);
  console.log('CPU receiveGuess result:', result);
  
  // 2. Update player's opponent tracking board
  const trackingResult = humanPlayer.getOpponentBoard().processGuess(testCoordinate);
  console.log('Human tracking board result:', trackingResult);
  
  console.log('\nCPU Board after hit:');
  const cpuGridAfter = cpuPlayer.getBoard().getGrid();
  for (let i = 0; i < 10; i++) {
    let row = `${i}: `;
    for (let j = 0; j < 10; j++) {
      row += cpuGridAfter[i][j] + ' ';
    }
    console.log(row);
  }
  
  console.log('\nHuman Tracking Board after hit:');
  const humanTrackingAfter = humanPlayer.getOpponentBoard().getGrid();
  for (let i = 0; i < 10; i++) {
    let row = `${i}: `;
    for (let j = 0; j < 10; j++) {
      row += humanTrackingAfter[i][j] + ' ';
    }
    console.log(row);
  }
}

console.log('\n�� Debug Complete!'); 