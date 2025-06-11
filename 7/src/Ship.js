/**
 * Represents a ship in the Sea Battle game
 */
export class Ship {
  constructor(locations) {
    this.locations = [...locations]; // Array of coordinate strings like ['00', '01', '02']
    this.hits = new Array(locations.length).fill(false);
  }

  /**
   * Attempt to hit the ship at a specific location
   * @param {string} location - Coordinate string like '34'
   * @returns {boolean} - True if hit, false if miss
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index >= 0 && !this.hits[index]) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  /**
   * Check if the ship is completely sunk
   * @returns {boolean} - True if all parts are hit
   */
  isSunk() {
    return this.hits.every(hit => hit);
  }

  /**
   * Check if a location is part of this ship
   * @param {string} location - Coordinate string
   * @returns {boolean} - True if location is part of ship
   */
  occupies(location) {
    return this.locations.includes(location);
  }

  /**
   * Get all locations of this ship
   * @returns {string[]} - Array of coordinate strings
   */
  getLocations() {
    return [...this.locations];
  }

  /**
   * Get hit status for each location
   * @returns {boolean[]} - Array of hit statuses
   */
  getHits() {
    return [...this.hits];
  }
} 