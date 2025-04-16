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
     * @returns {Object} Validation result with isValid and message
     */
    validate() {
        try {
            const errors = [];
            const state = this.getState();

            if (!state.submitterName?.trim()) {
                errors.push('Please enter your name');
            }

            if (!state.goalkeeper?.trim()) {
                errors.push('Please enter a goalkeeper');
            }

            if (!Array.isArray(state.defenders) || state.defenders.length < 3 || state.defenders.length > 5) {
                errors.push('Please enter 3-5 defenders');
            }

            if (!Array.isArray(state.midfielders) || state.midfielders.length < 3 || state.midfielders.length > 5) {
                errors.push('Please enter 3-5 midfielders');
            }

            if (!Array.isArray(state.forwards) || state.forwards.length < 1 || state.forwards.length > 3) {
                errors.push('Please enter 1-3 forwards');
            }

            const isValid = errors.length === 0;
            this.setState({ isValid, validationErrors: errors });

            if (isValid) {
                this.log('Team validation successful');
                this.trigger('validated', { isValid, errors: [] });
            } else {
                this.log('Team validation failed', 'warn');
                this.trigger('validationError', { isValid, errors });
            }

            return { isValid, errors };
        } catch (error) {
            this.handleError(error, 'Team validation');
            return { isValid: false, errors: ['An error occurred during validation'] };
        }
    }

    /**
     * Converts the team to a plain object
     * @returns {Object} Team data as a plain object
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
     * Gets the total number of players in the team
     * @returns {number} Total number of players
     */
    getTotalPlayers() {
        const state = this.getState();
        return 1 + // goalkeeper
               state.defenders.length +
               state.midfielders.length +
               state.forwards.length;
    }

    /**
     * Gets a formatted string of all players
     * @returns {string} Formatted list of players
     */
    getFormattedPlayers() {
        const state = this.getState();
        return `
            Goalkeeper: ${state.goalkeeper}
            Defenders: ${state.defenders.join(', ')}
            Midfielders: ${state.midfielders.join(', ')}
            Forwards: ${state.forwards.join(', ')}
        `.trim();
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