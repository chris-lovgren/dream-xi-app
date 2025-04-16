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
     * @param {string} data.name - Team name
     * @param {string} data.formation - Team formation
     * @param {Object} data.players - Team players
     * @param {string} data.players.goalkeeper - Goalkeeper name
     * @param {Array} data.players.defenders - Array of defender names
     * @param {Array} data.players.midfielders - Array of midfielder names
     * @param {Array} data.players.forwards - Array of forward names
     */
    constructor(data) {
        super();
        this.setState({
            name: data.name,
            formation: data.formation,
            players: {
                goalkeeper: data.players?.goalkeeper || '',
                defenders: data.players?.defenders || [],
                midfielders: data.players?.midfielders || [],
                forwards: data.players?.forwards || []
            },
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
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

        // Validate team name
        if (!state.name?.trim()) {
            errors.push('Team name is required');
        } else if (state.name.length > 50) {
            errors.push('Team name cannot exceed 50 characters');
        }

        // Validate formation
        const validFormations = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'];
        if (!validFormations.includes(state.formation)) {
            errors.push('Invalid formation');
        }

        // Validate goalkeeper
        if (!state.players.goalkeeper?.trim()) {
            errors.push('Goalkeeper is required');
        }

        // Validate defenders
        const defenderCount = parseInt(state.formation.split('-')[0]);
        if (!Array.isArray(state.players.defenders) || state.players.defenders.length !== defenderCount) {
            errors.push(`Must have exactly ${defenderCount} defenders`);
        }

        // Validate midfielders
        const midfielderCount = parseInt(state.formation.split('-')[1]);
        if (!Array.isArray(state.players.midfielders) || state.players.midfielders.length !== midfielderCount) {
            errors.push(`Must have exactly ${midfielderCount} midfielders`);
        }

        // Validate forwards
        const forwardCount = parseInt(state.formation.split('-')[2]);
        if (!Array.isArray(state.players.forwards) || state.players.forwards.length !== forwardCount) {
            errors.push(`Must have exactly ${forwardCount} forwards`);
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
            name: state.name,
            formation: state.formation,
            players: {
                goalkeeper: state.players.goalkeeper,
                defenders: state.players.defenders,
                midfielders: state.players.midfielders,
                forwards: state.players.forwards
            },
            createdAt: state.createdAt,
            updatedAt: state.updatedAt
        };
    }

    /**
     * Gets total number of players
     * @returns {number} Total players
     */
    getTotalPlayers() {
        const state = this.getState();
        return 1 + // goalkeeper
               state.players.defenders.length +
               state.players.midfielders.length +
               state.players.forwards.length;
    }

    /**
     * Gets formatted string of all players
     * @returns {string} Formatted player list
     */
    getFormattedPlayers() {
        const state = this.getState();
        return `GK: ${state.players.goalkeeper}\n` +
               `DEF: ${state.players.defenders.join(', ')}\n` +
               `MID: ${state.players.midfielders.join(', ')}\n` +
               `FWD: ${state.players.forwards.join(', ')}`;
    }

    /**
     * Updates team data
     * @param {Object} updates - New team data
     */
    update(updates) {
        const currentState = this.getState();
        this.setState({
            ...currentState,
            ...updates,
            updatedAt: new Date().toISOString()
        });
        this.validate();
    }

    /**
     * Checks if a player exists in the team
     * @param {string} playerName - Player name to check
     * @returns {boolean} True if player exists
     */
    hasPlayer(playerName) {
        const state = this.getState();
        return state.players.goalkeeper === playerName ||
               state.players.defenders.includes(playerName) ||
               state.players.midfielders.includes(playerName) ||
               state.players.forwards.includes(playerName);
    }

    /**
     * Gets all players in the team
     * @returns {Object} All players by position
     */
    getAllPlayers() {
        return this.getState().players;
    }

    /**
     * Cleanup before component destruction
     */
    beforeDestroy() {
        this.setState({
            name: '',
            formation: '',
            players: {
                goalkeeper: '',
                defenders: [],
                midfielders: [],
                forwards: []
            },
            isValid: false,
            validationErrors: []
        });
    }
} 