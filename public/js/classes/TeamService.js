import { BaseComponent } from './BaseComponent.js';
import { Team } from './Team.js';

/**
 * TeamService class handles communication with the backend API
 * Extends BaseComponent to get common functionality
 */
export class TeamService extends BaseComponent {
    #baseUrl = 'https://dream-xi-app.onrender.com';
    
    constructor() {
        super();
        this.setState({
            teams: [],
            isLoading: false,
            error: null
        });
        
        this.log('TeamService initialized');
    }

    /**
     * Fetches all teams from the backend
     * @returns {Promise<Array>} Array of Team instances
     */
    async getAllTeams() {
        try {
            this.setState({ isLoading: true, error: null });
            this.log('Fetching all teams');

            const response = await fetch(`${this.#baseUrl}/api/teams`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const teams = data.map(teamData => new Team(teamData));
            
            this.setState({ teams, isLoading: false });
            this.trigger('teamsLoaded', teams);
            
            return teams;
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
            this.handleError(error, 'Fetching teams');
            throw error;
        }
    }

    /**
     * Fetches teams by formation
     * @param {string} formation - Formation to search for
     * @returns {Promise<Array>} Array of Team instances
     */
    async getTeamsByFormation(formation) {
        try {
            this.setState({ isLoading: true, error: null });
            this.log(`Fetching teams with formation: ${formation}`);

            const response = await fetch(`${this.#baseUrl}/api/teams/formation/${formation}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const teams = data.map(teamData => new Team(teamData));
            
            this.setState({ isLoading: false });
            this.trigger('teamsLoaded', teams);
            
            return teams;
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
            this.handleError(error, 'Fetching teams by formation');
            throw error;
        }
    }

    /**
     * Fetches teams containing a specific player
     * @param {string} playerName - Player name to search for
     * @returns {Promise<Array>} Array of Team instances
     */
    async getTeamsByPlayer(playerName) {
        try {
            this.setState({ isLoading: true, error: null });
            this.log(`Fetching teams with player: ${playerName}`);

            const response = await fetch(`${this.#baseUrl}/api/teams/player/${encodeURIComponent(playerName)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const teams = data.map(teamData => new Team(teamData));
            
            this.setState({ isLoading: false });
            this.trigger('teamsLoaded', teams);
            
            return teams;
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
            this.handleError(error, 'Fetching teams by player');
            throw error;
        }
    }

    /**
     * Saves a team to the backend
     * @param {Team} team - Team instance to save
     * @returns {Promise<Object>} Response from the server
     */
    async saveTeam(team) {
        try {
            if (!(team instanceof Team)) {
                throw new Error('Invalid team object');
            }

            const validation = team.validate();
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            this.setState({ isLoading: true, error: null });
            this.log('Saving team');

            const response = await fetch(`${this.#baseUrl}/api/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(team.toJSON())
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.setState({ isLoading: false });
            this.trigger('teamSaved', team);
            
            return result;
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
            this.handleError(error, 'Saving team');
            throw error;
        }
    }

    /**
     * Updates an existing team
     * @param {string} id - Team ID
     * @param {Team} team - Updated team data
     * @returns {Promise<Object>} Updated team
     */
    async updateTeam(id, team) {
        try {
            if (!(team instanceof Team)) {
                throw new Error('Invalid team object');
            }

            this.setState({ isLoading: true, error: null });
            this.log(`Updating team: ${id}`);

            const response = await fetch(`${this.#baseUrl}/api/teams/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(team.toJSON())
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.setState({ isLoading: false });
            this.trigger('teamUpdated', result);
            
            return result;
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
            this.handleError(error, 'Updating team');
            throw error;
        }
    }

    /**
     * Deletes a team
     * @param {string} id - Team ID
     * @returns {Promise<Object>} Deletion result
     */
    async deleteTeam(id) {
        try {
            this.setState({ isLoading: true, error: null });
            this.log(`Deleting team: ${id}`);

            const response = await fetch(`${this.#baseUrl}/api/teams/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message ?? `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.setState({ isLoading: false });
            this.trigger('teamDeleted', id);
            
            return result;
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
            this.handleError(error, 'Deleting team');
            throw error;
        }
    }

    /**
     * Gets the current loading state
     * @returns {boolean} True if loading
     */
    get isLoading() {
        return this.getState().isLoading;
    }

    /**
     * Gets the current error state
     * @returns {string|null} Error message or null
     */
    get error() {
        return this.getState().error;
    }

    /**
     * Gets the cached teams
     * @returns {Array} Array of Team instances
     */
    get cachedTeams() {
        return this.getState().teams;
    }

    /**
     * Clears the current error state
     */
    clearError() {
        this.setState({ error: null });
    }

    /**
     * Cleanup before component destruction
     */
    beforeDestroy() {
        this.clearError();
        this.setState({ teams: [], isLoading: false });
    }
} 