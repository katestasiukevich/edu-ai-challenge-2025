# Enigma Machine Bug Fix Report

## Bug Description

The original Enigma machine implementation had a critical bug in the `encryptChar()` method where the **plugboard substitution was only applied once** at the beginning of the encryption process, but not at the end.

### Root Cause

In a real Enigma machine, the electrical signal passes through the plugboard **twice**:
1. **First pass**: Before entering the rotors (input → plugboard → rotors)
2. **Second pass**: After returning from the reflector through the rotors (rotors → plugboard → output)

The original code was missing the second plugboard application:

```javascript
// BUGGY CODE - Missing final plugboard swap
encryptChar(c) {
  if (!alphabet.includes(c)) return c;
  this.stepRotors();
  c = plugboardSwap(c, this.plugboardPairs);  // ✓ First plugboard swap
  for (let i = this.rotors.length - 1; i >= 0; i--) {
    c = this.rotors[i].forward(c);
  }
  c = REFLECTOR[alphabet.indexOf(c)];
  for (let i = 0; i < this.rotors.length; i++) {
    c = this.rotors[i].backward(c);
  }
  return c;  // ✗ Missing second plugboard swap
}
```

### Impact

This bug caused **incorrect encryption/decryption behavior**, particularly when plugboard pairs were used:
- Encrypting 'A' with an A↔B plugboard setting would decrypt to 'B' instead of 'A'
- The reciprocal property of the Enigma machine was broken
- Messages could not be properly decrypted

### Demonstration

Before the fix:
```
Input: 'A' with A↔B plugboard
Encrypted: 'I'  
Decrypted: 'B' ❌ (should be 'A')
```

## Fix Implementation

### Solution

Added the missing second plugboard swap at the end of the `encryptChar()` method:

```javascript
// FIXED CODE - Both plugboard swaps present
encryptChar(c) {
  if (!alphabet.includes(c)) return c;
  this.stepRotors();
  c = plugboardSwap(c, this.plugboardPairs);     // ✓ First plugboard swap
  for (let i = this.rotors.length - 1; i >= 0; i--) {
    c = this.rotors[i].forward(c);
  }
  c = REFLECTOR[alphabet.indexOf(c)];
  for (let i = 0; i < this.rotors.length; i++) {
    c = this.rotors[i].backward(c);
  }
  c = plugboardSwap(c, this.plugboardPairs);     // ✓ Second plugboard swap ADDED
  return c;
}
```

### Verification

After the fix:
```
Input: 'A' with A↔B plugboard
Encrypted: 'I'
Decrypted: 'A' ✅ (correct!)
```

## Testing

### Unit Tests Created
- **Rotor Class Tests**: Initialization, stepping, notch detection
- **Basic Functionality Tests**: Encryption/decryption, character handling
- **Plugboard Tests**: Single and multiple plugboard pairs
- **Complex Scenarios**: Long messages, mixed case input

### Test Coverage
- **Statement Coverage**: 75%
- **Line Coverage**: 73.58%
- **Branch Coverage**: 62.5%
- **Function Coverage**: 68.42%

All test coverage metrics exceed the required 60% threshold.

### Test Results
- **Total Tests**: 10
- **Passing Tests**: 10 (100%)
- **Failed Tests**: 0

## Files Modified/Created

1. **enigma.js** - Fixed the missing plugboard swap bug
2. **enigma.test.js** - Comprehensive unit tests
3. **test_report.txt** - Test coverage report
4. **package.json** - Added Jest configuration
5. **fix.md** - This bug report

## Conclusion

The fix was minimal but critical - adding a single line of code to apply the plugboard substitution at the end of the encryption process. This restored the correct Enigma machine behavior and ensured that encryption and decryption are properly reciprocal operations.

The comprehensive test suite now verifies that the Enigma machine works correctly across various scenarios, ensuring the bug won't reoccur in future modifications. 