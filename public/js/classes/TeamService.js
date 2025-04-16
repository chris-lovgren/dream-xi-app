import { BaseComponent } from './BaseComponent.js';
import { Team } from './Team.js';

/**
 * TeamService class handles communication with the backend API
 * Extends BaseComponent to get common functionality
 */
export class TeamService extends BaseComponent {
    constructor() {
        super();
        this.setState({
            baseUrl: 'https://dream-xi-app.onrender.com',
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

            const response = await fetch(`${this.getState().baseUrl}/teams`);
            
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

            const response = await fetch(`${this.getState().baseUrl}/team`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(team.toJSON())
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
     * Gets the current loading state
     * @returns {boolean} True if loading
     */
    isLoading() {
        return this.getState().isLoading;
    }

    /**
     * Gets the current error state
     * @returns {string|null} Current error message or null
     */
    getError() {
        return this.getState().error;
    }

    /**
     * Gets all cached teams
     * @returns {Array<Team>} Array of Team instances
     */
    getCachedTeams() {
        return [...this.getState().teams];
    }

    /**
     * Clears the error state
     */
    clearError() {
        this.setState({ error: null });
    }

    /**
     * Lifecycle method called before component is destroyed
     */
    beforeDestroy() {
        this.trigger('beforeDestroy');
    }
} 