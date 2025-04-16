import { BaseComponent } from './BaseComponent.js';

/**
 * Team class handles team data and validation
 * Extends BaseComponent to get common functionality
 */
export class Team extends BaseComponent {
    /**
     * Creates a new team instance
     * @param {Object} data - Team data
     * @param {string} data.submitterName - Name of the person submitting the team
     * @param {string} data.goalkeeper - Goalkeeper name
     * @param {Array} data.defenders - Array of defender names
     * @param {Array} data.midfielders - Array of midfielder names
     * @param {Array} data.forwards - Array of forward names
     */
    constructor(data) {
        super();
        this.submitterName = data.submitterName;
        this.goalkeeper = data.goalkeeper;
        this.defenders = data.defenders;
        this.midfielders = data.midfielders;
        this.forwards = data.forwards;
        this.createdAt = new Date().toISOString();
        
        this.log('Team instance created');
    }

    /**
     * Validates the team data
     * @returns {Object} Validation result with isValid and message
     */
    validate() {
        try {
            if (!this.submitterName?.trim()) {
                return { isValid: false, message: 'Please enter your name' };
            }

            if (!this.goalkeeper?.trim()) {
                return { isValid: false, message: 'Please enter a goalkeeper' };
            }

            if (!Array.isArray(this.defenders) || this.defenders.length < 3 || this.defenders.length > 5) {
                return { isValid: false, message: 'Please enter 3-5 defenders' };
            }

            if (!Array.isArray(this.midfielders) || this.midfielders.length < 3 || this.midfielders.length > 5) {
                return { isValid: false, message: 'Please enter 3-5 midfielders' };
            }

            if (!Array.isArray(this.forwards) || this.forwards.length < 1 || this.forwards.length > 3) {
                return { isValid: false, message: 'Please enter 1-3 forwards' };
            }

            this.log('Team validation successful');
            return { isValid: true, message: 'Team is valid' };
        } catch (error) {
            this.handleError(error, 'Team validation');
            return { isValid: false, message: 'An error occurred during validation' };
        }
    }

    /**
     * Converts the team to a plain object
     * @returns {Object} Team data as a plain object
     */
    toJSON() {
        return {
            submitterName: this.submitterName,
            goalkeeper: this.goalkeeper,
            defenders: this.defenders,
            midfielders: this.midfielders,
            forwards: this.forwards,
            createdAt: this.createdAt
        };
    }

    /**
     * Gets the total number of players in the team
     * @returns {number} Total number of players
     */
    getTotalPlayers() {
        return 1 + // goalkeeper
               this.defenders.length +
               this.midfielders.length +
               this.forwards.length;
    }

    /**
     * Gets a formatted string of all players
     * @returns {string} Formatted list of players
     */
    getFormattedPlayers() {
        return `
            Goalkeeper: ${this.goalkeeper}
            Defenders: ${this.defenders.join(', ')}
            Midfielders: ${this.midfielders.join(', ')}
            Forwards: ${this.forwards.join(', ')}
        `.trim();
    }
} 