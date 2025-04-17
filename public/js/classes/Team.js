import { BaseComponent } from './BaseComponent.js';
import { Validatable, Updatable } from './interfaces.js';

/**
 * Team class handles team data and validation
 * Extends BaseComponent and implements Validatable and Updatable interfaces
 */
export class Team extends BaseComponent {
    #validFormations = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'];
    
    constructor(data = {}) {
        super();
        this.setState({
            name: data.name ?? '',
            formation: data.formation ?? '',
            players: {
                goalkeeper: data.players?.goalkeeper ?? '',
                defenders: data.players?.defenders ?? [],
                midfielders: data.players?.midfielders ?? [],
                forwards: data.players?.forwards ?? []
            },
            createdAt: data.createdAt ?? new Date().toISOString(),
            updatedAt: data.updatedAt ?? new Date().toISOString(),
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
        const { name, formation, players } = this.getState();

        // Validate team name
        if (!name?.trim()) {
            errors.push('Team name is required');
        } else if (name.length > 50) {
            errors.push('Team name cannot exceed 50 characters');
        }

        // Validate formation
        if (!this.#validFormations.includes(formation)) {
            errors.push(`Invalid formation. Must be one of: ${this.#validFormations.join(', ')}`);
        }

        // Validate goalkeeper
        if (!players.goalkeeper?.trim()) {
            errors.push('Goalkeeper is required');
        }

        // Validate defenders
        const defenderCount = parseInt(formation.split('-')[0]);
        if (!Array.isArray(players.defenders) || players.defenders.length !== defenderCount) {
            errors.push(`Must have exactly ${defenderCount} defenders`);
        }

        // Validate midfielders
        const midfielderCount = parseInt(formation.split('-')[1]);
        if (!Array.isArray(players.midfielders) || players.midfielders.length !== midfielderCount) {
            errors.push(`Must have exactly ${midfielderCount} midfielders`);
        }

        // Validate forwards
        const forwardCount = parseInt(formation.split('-')[2]);
        if (!Array.isArray(players.forwards) || players.forwards.length !== forwardCount) {
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
        const { name, formation, players, createdAt, updatedAt } = this.getState();
        return { name, formation, players, createdAt, updatedAt };
    }

    /**
     * Gets total number of players
     * @returns {number} Total players
     */
    get totalPlayers() {
        const { players } = this.getState();
        return 1 + // goalkeeper
               players.defenders.length +
               players.midfielders.length +
               players.forwards.length;
    }

    /**
     * Gets formatted string of all players
     * @returns {string} Formatted player list
     */
    get formattedPlayers() {
        const { players } = this.getState();
        return `GK: ${players.goalkeeper}\n` +
               `DEF: ${players.defenders.join(', ')}\n` +
               `MID: ${players.midfielders.join(', ')}\n` +
               `FWD: ${players.forwards.join(', ')}`;
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
        const { players } = this.getState();
        return players.goalkeeper === playerName ||
               players.defenders.includes(playerName) ||
               players.midfielders.includes(playerName) ||
               players.forwards.includes(playerName);
    }

    /**
     * Gets all players in the team
     * @returns {Object} All players by position
     */
    get allPlayers() {
        return this.getState().players;
    }

    /**
     * Gets the team's formation
     * @returns {string} Team formation
     */
    get formation() {
        return this.getState().formation;
    }

    /**
     * Gets the team's name
     * @returns {string} Team name
     */
    get name() {
        return this.getState().name;
    }

    /**
     * Gets the team's creation date
     * @returns {string} Creation date
     */
    get createdAt() {
        return this.getState().createdAt;
    }

    /**
     * Gets the team's last update date
     * @returns {string} Last update date
     */
    get updatedAt() {
        return this.getState().updatedAt;
    }

    /**
     * Gets the team's validation status
     * @returns {boolean} True if team is valid
     */
    get isValid() {
        return this.getState().isValid;
    }

    /**
     * Gets the team's validation errors
     * @returns {Array<string>} Validation errors
     */
    get validationErrors() {
        return this.getState().validationErrors;
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