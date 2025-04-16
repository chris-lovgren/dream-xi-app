import { BaseComponent } from './BaseComponent.js';

/**
 * TeamDisplay - Handles displaying teams in the UI
 * Extends BaseComponent to get common functionality
 */
export class TeamDisplay extends BaseComponent {
    /**
     * Creates a new TeamDisplay instance
     * @param {HTMLElement} container - The container element for displaying teams
     */
    constructor(container) {
        super();
        this.container = container;
        this.log('TeamDisplay initialized');
    }

    /**
     * Creates a team element for display
     * @param {Object} team - The team data
     * @returns {HTMLElement} The created team element
     */
    createTeamElement(team) {
        const teamElement = document.createElement('div');
        teamElement.className = 'team-card';
        teamElement.innerHTML = `
            <h3>${team.submitterName}'s Team</h3>
            <div class="team-details">
                <strong>Goalkeeper:</strong> ${team.goalkeeper}
                <strong>Defenders:</strong> ${team.defenders.join(', ')}
                <strong>Midfielders:</strong> ${team.midfielders.join(', ')}
                <strong>Forwards:</strong> ${team.forwards.join(', ')}
                <small>Created: ${new Date(team.createdAt).toLocaleString()}</small>
            </div>
        `;
        return teamElement;
    }

    /**
     * Displays teams in the container
     * @param {Array} teams - Array of team objects
     */
    displayTeams(teams) {
        try {
            this.log(`Displaying ${teams.length} teams`);
            this.container.innerHTML = '';
            
            if (teams.length === 0) {
                this.showMessage('No teams have been submitted yet.', 'info');
                return;
            }

            // Display teams in reverse chronological order
            teams.reverse().forEach(team => {
                const teamElement = this.createTeamElement(team);
                this.container.appendChild(teamElement);
            });
        } catch (error) {
            this.handleError(error, 'Displaying teams');
        }
    }

    /**
     * Shows a message to the user
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success, error, info)
     */
    showMessage(message, type = 'info') {
        try {
            this.log(`Showing ${type} message: ${message}`);
            const messageElement = document.createElement('div');
            messageElement.className = `message ${type}`;
            messageElement.textContent = message;
            
            // Remove any existing messages
            const existingMessage = this.container.querySelector('.message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            this.container.insertBefore(messageElement, this.container.firstChild);
            
            // Auto-remove message after 5 seconds
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        } catch (error) {
            this.handleError(error, 'Showing message');
        }
    }

    /**
     * Sets the loading state of a submit button
     * @param {HTMLElement} button - The submit button
     * @param {boolean} isLoading - Whether the button should be in loading state
     */
    setLoading(button, isLoading) {
        try {
            if (isLoading) {
                button.classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        } catch (error) {
            this.handleError(error, 'Setting loading state');
        }
    }
} 