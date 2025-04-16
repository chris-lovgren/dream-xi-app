/**
 * TeamService - Handles all communication with the server for team-related operations
 * This class makes it easy to:
 * 1. Get all saved teams
 * 2. Save a new team
 * 3. Handle errors from the server
 */
export class TeamService {
    /**
     * Creates a new TeamService instance
     */
    constructor() {
        // Base URL for API endpoints
        this.baseUrl = '/';
    }

    /**
     * Fetches all saved teams from the server
     * @returns {Promise<Array>} Array of team objects
     * @throws {Error} If the server request fails
     */
    async getAllTeams() {
        try {
            const response = await fetch(`${this.baseUrl}teams`);
            if (!response.ok) {
                throw new Error('Failed to fetch teams');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    }

    /**
     * Saves a new team to the server
     * @param {Object} teamData - The team data to save
     * @param {string} teamData.submitterName - Name of the person submitting the team
     * @param {string} teamData.goalkeeper - Name of the goalkeeper
     * @param {Array<string>} teamData.defenders - Array of defender names
     * @param {Array<string>} teamData.midfielders - Array of midfielder names
     * @param {Array<string>} teamData.forwards - Array of forward names
     * @returns {Promise<Object>} The saved team data
     * @throws {Error} If the server request fails
     */
    async saveTeam(teamData) {
        try {
            const response = await fetch(`${this.baseUrl}team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save team');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving team:', error);
            throw error;
        }
    }
} 