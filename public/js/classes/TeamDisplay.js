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
        const formation = team.formation.split('-').join('-');
        const totalPlayers = team.getTotalPlayers();
        
        return `
            <div class="team-card" data-team-id="${team._id}">
                <div class="team-header">
                    <h3>${team.name}</h3>
                    <span class="formation-badge">${formation}</span>
                </div>
                <div class="team-details">
                    <div class="position-group">
                        <h4>Goalkeeper</h4>
                        <p>${team.players.goalkeeper}</p>
                    </div>
                    <div class="position-group">
                        <h4>Defenders (${team.players.defenders.length})</h4>
                        <ul>
                            ${team.players.defenders.map(player => `<li>${player}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="position-group">
                        <h4>Midfielders (${team.players.midfielders.length})</h4>
                        <ul>
                            ${team.players.midfielders.map(player => `<li>${player}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="position-group">
                        <h4>Forwards (${team.players.forwards.length})</h4>
                        <ul>
                            ${team.players.forwards.map(player => `<li>${player}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="team-footer">
                    <span class="total-players">Total Players: ${totalPlayers}</span>
                    <span class="timestamp">Created: ${new Date(team.createdAt).toLocaleString()}</span>
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
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading teams...</p>
            </div>
        `;
    }

    /**
     * Shows error message in the UI
     * @param {string} message - Error message to display
     */
    showError(message) {
        const { container } = this.getState();
        this.setState({ error: message, isLoading: false });
        container.innerHTML = `
            <div class="error">
                <p>${message}</p>
                <button class="retry-button">Try Again</button>
            </div>
        `;
        
        const retryButton = container.querySelector('.retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', () => {
                this.trigger('retry');
            });
        }
    }

    showSuccess(message) {
        const { container } = this.getState();
        const successElement = document.createElement('div');
        successElement.className = 'success';
        successElement.textContent = message;
        container.insertBefore(successElement, container.firstChild);
        
        setTimeout(() => {
            successElement.remove();
        }, 3000);
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
        this.setState({
            container: null,
            teams: [],
            isLoading: false,
            error: null
        });
        this.trigger('beforeDestroy');
    }
} 