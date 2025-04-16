/**
 * TeamService - Handles communication with the backend API
 * This class manages:
 * 1. Fetching teams from the server
 * 2. Saving teams to the server
 * 3. Error handling for API requests
 */
export class TeamService {
    /**
     * Creates a new TeamService instance
     * @param {string} baseUrl - The base URL for the API
     */
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Fetches all teams from the server
     * @returns {Promise<Array>} Array of teams
     * @throws {Error} If the request fails
     */
    async getAllTeams() {
        try {
            const response = await fetch(`${this.baseUrl}/teams`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const teams = await response.json();
            return Array.isArray(teams) ? teams : [];
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw new Error('Failed to fetch teams');
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
            
            return await response.json();
        } catch (error) {
            console.error('Error saving team:', error);
            throw new Error('Failed to save team');
        }
    }

    /**
     * Checks if the server is healthy
     * @returns {Promise<boolean>} True if server is healthy
     * @throws {Error} If the request fails
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error('Error checking server health:', error);
            throw error;
        }
    }
} 