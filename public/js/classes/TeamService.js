import { BaseComponent } from './BaseComponent.js';

/**
 * TeamService - Handles communication with the backend API
 * Extends BaseComponent to get common functionality
 */
export class TeamService extends BaseComponent {
    /**
     * Creates a new TeamService instance
     * @param {string} baseUrl - The base URL for the API
     */
    constructor(baseUrl = '') {
        super();
        this.baseUrl = baseUrl;
        this.log('TeamService initialized');
    }

    /**
     * Fetches all teams from the server
     * @returns {Promise<Array>} Array of teams
     * @throws {Error} If the request fails
     */
    async getAllTeams() {
        try {
            this.log('Fetching all teams');
            const response = await fetch(`${this.baseUrl}/teams`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const teams = await response.json();
            const result = Array.isArray(teams) ? teams : [];
            this.log(`Successfully fetched ${result.length} teams`);
            return result;
        } catch (error) {
            this.handleError(error, 'Fetching teams');
            throw error;
        }
    }

    /**
     * Saves a team to the server
     * @param {Object} team - The team data to save
     * @returns {Promise<Object>} The saved team data
     * @throws {Error} If the request fails
     */
    async saveTeam(team) {
        try {
            this.log('Saving team');
            const response = await fetch(`${this.baseUrl}/team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(team)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            this.log('Team saved successfully');
            return result;
        } catch (error) {
            this.handleError(error, 'Saving team');
            throw error;
        }
    }

    /**
     * Checks if the server is healthy
     * @returns {Promise<boolean>} True if server is healthy
     * @throws {Error} If the request fails
     */
    async checkHealth() {
        try {
            this.log('Checking server health');
            const response = await fetch(`${this.baseUrl}/health`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.log('Server is healthy');
            return true;
        } catch (error) {
            this.handleError(error, 'Checking server health');
            throw error;
        }
    }

    /**
     * Gets a team by its ID
     * @param {string} id - The team ID
     * @returns {Promise<Object>} The team data
     * @throws {Error} If the request fails
     */
    async getTeamById(id) {
        try {
            this.log(`Fetching team with ID: ${id}`);
            const response = await fetch(`${this.baseUrl}/teams/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const team = await response.json();
            this.log('Team fetched successfully');
            return team;
        } catch (error) {
            this.handleError(error, 'Fetching team by ID');
            throw error;
        }
    }
} 