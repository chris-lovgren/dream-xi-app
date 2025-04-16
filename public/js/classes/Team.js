import { BaseComponent } from './BaseComponent.js';
import { Validatable, Updatable } from './interfaces.js';

/**
 * Team class handles team data and validation
 * Extends BaseComponent and implements Validatable and Updatable interfaces
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
        this.setState({
            submitterName: data.submitterName,
            goalkeeper: data.goalkeeper,
            defenders: data.defenders,
            midfielders: data.midfielders,
            forwards: data.forwards,
            createdAt: new Date().toISOString(),
            isValid: false,
            validationErrors: []
        });
        
        this.log('Team instance created');
    }

    /**
     * Validates the team data
     * @returns {{isValid: boolean, errors: Array<string>}} Validation result
     */
    validate() {
        const errors = [];
        const state = this.getState();

        // Validate submitter name
        if (!state.submitterName?.trim()) {
            errors.push('Submitter name is required');
        }

        // Validate goalkeeper
        if (!state.goalkeeper?.trim()) {
            errors.push('Goalkeeper is required');
        }

        // Validate defenders (3-5)
        if (!Array.isArray(state.defenders) || state.defenders.length < 3 || state.defenders.length > 5) {
            errors.push('Must have between 3 and 5 defenders');
        }

        // Validate midfielders (3-5)
        if (!Array.isArray(state.midfielders) || state.midfielders.length < 3 || state.midfielders.length > 5) {
            errors.push('Must have between 3 and 5 midfielders');
        }

        // Validate forwards (1-3)
        if (!Array.isArray(state.forwards) || state.forwards.length < 1 || state.forwards.length > 3) {
            errors.push('Must have between 1 and 3 forwards');
        }

        // Update validation state
        this.setState({
            isValid: errors.length === 0,
            validationErrors: errors
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Converts team to plain object
     * @returns {Object} Team data
     */
    toJSON() {
        const state = this.getState();
        return {
            submitterName: state.submitterName,
            goalkeeper: state.goalkeeper,
            defenders: state.defenders,
            midfielders: state.midfielders,
            forwards: state.forwards,
            createdAt: state.createdAt
        };
    }

    /**
     * Gets total number of players
     * @returns {number} Total players
     */
    getTotalPlayers() {
        const state = this.getState();
        return 1 + // goalkeeper
               state.defenders.length +
               state.midfielders.length +
               state.forwards.length;
    }

    /**
     * Gets formatted string of all players
     * @returns {string} Formatted players string
     */
    getFormattedPlayers() {
        const state = this.getState();
        return `Goalkeeper: ${state.goalkeeper}
Defenders: ${state.defenders.join(', ')}
Midfielders: ${state.midfielders.join(', ')}
Forwards: ${state.forwards.join(', ')}`;
    }

    /**
     * Updates team data
     * @param {Object} updates - Partial team data to update
     */
    update(updates) {
        try {
            this.setState(updates);
            this.validate();
            this.trigger('updated', this.toJSON());
        } catch (error) {
            this.handleError(error, 'Updating team');
        }
    }

    /**
     * Lifecycle method called before component is destroyed
     */
    beforeDestroy() {
        this.trigger('beforeDestroy', this.toJSON());
    }
} 