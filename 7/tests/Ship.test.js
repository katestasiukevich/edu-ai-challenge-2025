import { Ship } from '../src/Ship.js';

describe('Ship', () => {
  let ship;
  const locations = ['00', '01', '02'];

  beforeEach(() => {
    ship = new Ship(locations);
  });

  describe('constructor', () => {
    it('should create a ship with given locations', () => {
      expect(ship.getLocations()).toEqual(locations);
      expect(ship.getHits()).toEqual([false, false, false]);
    });

    it('should create a copy of locations array', () => {
      const originalLocations = ['33', '34'];
      const testShip = new Ship(originalLocations);
      originalLocations.push('35');
      expect(testShip.getLocations()).toEqual(['33', '34']);
    });
  });

  describe('hit', () => {
    it('should register a hit at a valid location', () => {
      const result = ship.hit('01');
      expect(result).toBe(true);
      expect(ship.getHits()[1]).toBe(true);
    });

    it('should not register a hit at an invalid location', () => {
      const result = ship.hit('99');
      expect(result).toBe(false);
      expect(ship.getHits()).toEqual([false, false, false]);
    });

    it('should not register a hit at an already hit location', () => {
      ship.hit('01');
      const result = ship.hit('01');
      expect(result).toBe(false);
      expect(ship.getHits()[1]).toBe(true);
    });

    it('should handle multiple hits correctly', () => {
      ship.hit('00');
      ship.hit('02');
      expect(ship.getHits()).toEqual([true, false, true]);
    });
  });

  describe('isSunk', () => {
    it('should return false when ship is not hit', () => {
      expect(ship.isSunk()).toBe(false);
    });

    it('should return false when partially hit', () => {
      ship.hit('00');
      ship.hit('01');
      expect(ship.isSunk()).toBe(false);
    });

    it('should return true when all locations are hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('occupies', () => {
    it('should return true for valid ship locations', () => {
      expect(ship.occupies('00')).toBe(true);
      expect(ship.occupies('01')).toBe(true);
      expect(ship.occupies('02')).toBe(true);
    });

    it('should return false for invalid locations', () => {
      expect(ship.occupies('03')).toBe(false);
      expect(ship.occupies('99')).toBe(false);
      expect(ship.occupies('10')).toBe(false);
    });
  });

  describe('getLocations', () => {
    it('should return a copy of locations', () => {
      const returnedLocations = ship.getLocations();
      returnedLocations.push('03');
      expect(ship.getLocations()).toEqual(locations);
    });
  });

  describe('getHits', () => {
    it('should return a copy of hits array', () => {
      ship.hit('00');
      const returnedHits = ship.getHits();
      returnedHits[1] = true;
      expect(ship.getHits()).toEqual([true, false, false]);
    });
  });

  describe('edge cases', () => {
    it('should handle single-location ship', () => {
      const singleShip = new Ship(['55']);
      expect(singleShip.isSunk()).toBe(false);
      singleShip.hit('55');
      expect(singleShip.isSunk()).toBe(true);
    });

    it('should handle empty locations array', () => {
      const emptyShip = new Ship([]);
      expect(emptyShip.isSunk()).toBe(true); // Vacuously true
      expect(emptyShip.hit('00')).toBe(false);
    });
  });
}); 