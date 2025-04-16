import { BaseComponent } from './BaseComponent.js';

/**
 * TeamDisplay class handles rendering teams in the UI
 * Extends BaseComponent to get common functionality
 */
export class TeamDisplay extends BaseComponent {
    /**
     * Creates a new TeamDisplay instance
     * @param {HTMLElement} container - The container element to render teams in
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

        this.log('TeamDisplay initialized');
    }

    /**
     * Displays a list of teams in the container
     * @param {Array} teams - Array of Team instances to display
     */
    displayTeams(teams) {
        try {
            this.setState({ teams, isLoading: false, error: null });
            this.log(`Displaying ${teams.length} teams`);

            const container = this.getState().container;
            container.innerHTML = '';

            if (teams.length === 0) {
                container.innerHTML = '<p class="no-teams">No teams saved yet</p>';
                return;
            }

            teams.forEach(team => {
                const teamCard = this.createTeamCard(team);
                container.appendChild(teamCard);
            });

            this.trigger('teamsDisplayed', teams);
        } catch (error) {
            this.setState({ error: error.message });
            this.handleError(error, 'Displaying teams');
        }
    }

    /**
     * Creates a team card element
     * @param {Team} team - Team instance to create card for
     * @returns {HTMLElement} Team card element
     */
    createTeamCard(team) {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML = `
            <h3>${team.getState().submitterName}'s Team</h3>
            <div class="team-details">
                <div class="position">
                    <strong>Goalkeeper:</strong>
                    <span>${team.getState().goalkeeper}</span>
                </div>
                <div class="position">
                    <strong>Defenders:</strong>
                    <ul>
                        ${team.getState().defenders.map(defender => `<li>${defender}</li>`).join('')}
                    </ul>
                </div>
                <div class="position">
                    <strong>Midfielders:</strong>
                    <ul>
                        ${team.getState().midfielders.map(midfielder => `<li>${midfielder}</li>`).join('')}
                    </ul>
                </div>
                <div class="position">
                    <strong>Forwards:</strong>
                    <ul>
                        ${team.getState().forwards.map(forward => `<li>${forward}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        return card;
    }

    /**
     * Shows a loading state in the container
     */
    showLoading() {
        this.setState({ isLoading: true });
        const container = this.getState().container;
        container.innerHTML = '<div class="loading">Loading teams...</div>';
    }

    /**
     * Shows an error message in the container
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.setState({ error: message, isLoading: false });
        const container = this.getState().container;
        container.innerHTML = `<div class="error">${message}</div>`;
    }

    /**
     * Shows a success message in the container
     * @param {string} message - Success message to display
     */
    showSuccess(message) {
        const container = this.getState().container;
        const messageElement = document.createElement('div');
        messageElement.className = 'success';
        messageElement.textContent = message;
        container.insertBefore(messageElement, container.firstChild);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    /**
     * Clears the container
     */
    clear() {
        this.setState({ teams: [], error: null });
        this.getState().container.innerHTML = '';
    }

    /**
     * Lifecycle method called before component is destroyed
     */
    beforeDestroy() {
        this.clear();
        this.trigger('beforeDestroy');
    }
} 