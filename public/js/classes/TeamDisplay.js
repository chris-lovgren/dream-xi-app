import { BaseComponent } from './BaseComponent.js';
import { Renderable } from './interfaces.js';

/**
 * TeamDisplay class handles rendering teams in the UI
 * Extends BaseComponent and implements Renderable interface
 */
export class TeamDisplay extends BaseComponent {
    /**
     * Creates a new TeamDisplay instance
     * @param {HTMLElement} container - Container element for displaying teams
     */
    constructor(container) {
        super();
        if (!container) {
            throw new Error('Container element is required');
        }
        this.setState({
            container,
            teams: [],
            isLoading: false,
            error: null
        });
        this.log('TeamDisplay instance created');
    }

    /**
     * Renders the teams in the UI
     * @param {Array<Object>} teams - Array of team objects to display
     */
    render(teams) {
        try {
            this.setState({ teams, isLoading: false, error: null });
            const { container } = this.getState();
            
            if (!teams || teams.length === 0) {
                container.innerHTML = '<p class="no-teams">No teams available</p>';
                return;
            }

            container.innerHTML = teams.map(team => this.createTeamCard(team)).join('');
            this.trigger('rendered', { teams });
        } catch (error) {
            this.handleError(error, 'Rendering teams');
        }
    }

    /**
     * Creates HTML for a team card
     * @param {Object} team - Team data
     * @returns {string} HTML string for team card
     */
    createTeamCard(team) {
        return `
            <div class="team-card">
                <h3>${team.submitterName}'s Team</h3>
                <div class="team-details">
                    <p><strong>Goalkeeper:</strong> ${team.goalkeeper}</p>
                    <p><strong>Defenders:</strong> ${team.defenders.join(', ')}</p>
                    <p><strong>Midfielders:</strong> ${team.midfielders.join(', ')}</p>
                    <p><strong>Forwards:</strong> ${team.forwards.join(', ')}</p>
                    <p class="timestamp">Created: ${new Date(team.createdAt).toLocaleString()}</p>
                </div>
            </div>
        `;
    }

    /**
     * Shows loading state in the UI
     */
    showLoading() {
        const { container } = this.getState();
        this.setState({ isLoading: true });
        container.innerHTML = '<div class="loading">Loading teams...</div>';
    }

    /**
     * Shows error message in the UI
     * @param {string} message - Error message to display
     */
    showError(message) {
        const { container } = this.getState();
        this.setState({ error: message, isLoading: false });
        container.innerHTML = `<div class="error">${message}</div>`;
    }

    /**
     * Clears the display
     */
    clear() {
        const { container } = this.getState();
        this.setState({ teams: [], error: null });
        container.innerHTML = '';
    }

    /**
     * Lifecycle method called before component is destroyed
     */
    beforeDestroy() {
        this.clear();
        this.trigger('beforeDestroy');
    }
} 