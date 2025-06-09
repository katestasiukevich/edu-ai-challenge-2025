const { Enigma, Rotor } = require('./enigma.js');

describe('Rotor Class', () => {
  let rotor;

  beforeEach(() => {
    rotor = new Rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'Q', 0, 0);
  });

  test('should initialize correctly', () => {
    expect(rotor.wiring).toBe('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
    expect(rotor.notch).toBe('Q');
    expect(rotor.position).toBe(0);
    expect(rotor.ringSetting).toBe(0);
  });

  test('should step correctly', () => {
    rotor.step();
    expect(rotor.position).toBe(1);
    
    // Test wraparound
    rotor.position = 25;
    rotor.step();
    expect(rotor.position).toBe(0);
  });

  test('should detect notch position', () => {
    rotor.position = 16; // Q is at position 16
    expect(rotor.atNotch()).toBe(true);
    
    rotor.position = 0;
    expect(rotor.atNotch()).toBe(false);
  });
});

describe('Enigma Machine Basic Functionality', () => {
  test('should encrypt and decrypt correctly with default settings', () => {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const plaintext = 'HELLO';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(plaintext);
    expect(encrypted).not.toBe(plaintext);
  });

  test('should handle single character encryption/decryption', () => {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const encrypted = enigma1.process('A');
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe('A');
  });

  test('should preserve non-alphabetic characters', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const result = enigma.process('HELLO123 WORLD!');
    expect(result).toMatch(/^[A-Z]+123 [A-Z]+!$/);
  });
});

describe('Plugboard Functionality', () => {
  test('should work with single plugboard pair', () => {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [['A', 'B']]);
    
    const encrypted = enigma1.process('A');
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe('A');
  });

  test('should work with multiple plugboard pairs', () => {
    const plugPairs = [['A', 'B'], ['C', 'D'], ['E', 'F']];
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugPairs);
    
    const plaintext = 'ABCDEF';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(plaintext);
  });
});

describe('Complex Scenarios', () => {
  test('should handle long messages', () => {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const plaintext = 'THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG';
    const encrypted = enigma1.process(plaintext);
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe(plaintext);
  });

  test('should handle mixed case input by converting to uppercase', () => {
    const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    
    const encrypted = enigma1.process('Hello World');
    const decrypted = enigma2.process(encrypted);
    
    expect(decrypted).toBe('HELLO WORLD');
  });
}); 