import { Game } from './src/Game.js';
import { CPUPlayer } from './src/Player.js';

console.log('🔍 Debugging Sea Battle Ship Placement...\n');

// Test 1: Check if CPU ships are being placed
console.log('Test 1: CPU Ship Placement');
const cpuPlayer = new CPUPlayer('Test CPU');
cpuPlayer.setupBoard(3, 3);

console.log('CPU Board after setup:');
const cpuGrid = cpuPlayer.getBoard().getGrid();
let shipCount = 0;
for (let i = 0; i < 10; i++) {
  let row = `${i}: `;
  for (let j = 0; j < 10; j++) {
    row += cpuGrid[i][j] + ' ';
    if (cpuGrid[i][j] === 'S') shipCount++;
  }
  console.log(row);
}
console.log(`\nShip cells found: ${shipCount} (should be 9 for 3 ships of length 3)`);
console.log(`Ships on board: ${cpuPlayer.getBoard().getShips().length}`);

// Test 2: Check if ships are hittable
console.log('\nTest 2: Ship Hit Detection');
const ships = cpuPlayer.getBoard().getShips();
if (ships.length > 0) {
  const firstShip = ships[0];
  const firstShipLocation = firstShip.getLocations()[0];
  console.log(`Trying to hit first ship at location: ${firstShipLocation}`);
  
  const hitResult = cpuPlayer.receiveGuess(firstShipLocation);
  console.log('Hit result:', hitResult);
  
  console.log('Board after hit:');
  const gridAfterHit = cpuPlayer.getBoard().getGrid();
  for (let i = 0; i < 10; i++) {
    let row = `${i}: `;
    for (let j = 0; j < 10; j++) {
      row += gridAfterHit[i][j] + ' ';
    }
    console.log(row);
  }
} else {
  console.log('❌ No ships found on CPU board!');
}

// Test 3: Test a miss
console.log('\nTest 3: Miss Detection');
const missResult = cpuPlayer.receiveGuess('99'); // Likely to be a miss
console.log('Miss result:', missResult);

console.log('\n�� Debug Complete!'); 