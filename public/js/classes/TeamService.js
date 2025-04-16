/**
 * TeamService class handles API communication for teams
 */
export class TeamService {
    /**
     * Creates a new TeamService instance
     * @param {string} baseUrl - Base URL for the API
     */
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * Fetches all teams from the server
     * @returns {Promise<Array>} Array of team objects
     * @throws {Error} If the request fails
     */
    async getAllTeams() {
        try {
            const response = await fetch(`${this.baseUrl}/teams`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    }

    /**
     * Saves a new team to the server
     * @param {Object} teamData - Team data to save
     * @returns {Promise<Object>} Saved team data
     * @throws {Error} If the request fails
     */
    async saveTeam(teamData) {
        try {
            const response = await fetch(`${this.baseUrl}/team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving team:', error);
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