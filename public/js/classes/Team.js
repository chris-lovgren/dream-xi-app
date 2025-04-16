/**
 * Team class handles team data and validation
 */
export class Team {
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
        this.submitterName = data.submitterName;
        this.goalkeeper = data.goalkeeper;
        this.defenders = data.defenders;
        this.midfielders = data.midfielders;
        this.forwards = data.forwards;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Validates the team data
     * @returns {Object} Validation result with isValid and message
     */
    validate() {
        if (!this.submitterName) {
            return { isValid: false, message: 'Please enter your name' };
        }

        if (!this.goalkeeper) {
            return { isValid: false, message: 'Please enter a goalkeeper' };
        }

        if (!this.defenders || this.defenders.length < 4) {
            return { isValid: false, message: 'Please enter at least 4 defenders' };
        }

        if (!this.midfielders || this.midfielders.length < 4) {
            return { isValid: false, message: 'Please enter at least 4 midfielders' };
        }

        if (!this.forwards || this.forwards.length < 2) {
            return { isValid: false, message: 'Please enter at least 2 forwards' };
        }

        return { isValid: true, message: 'Team is valid' };
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
} 