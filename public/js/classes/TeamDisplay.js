/**
 * TeamDisplay class handles rendering teams in the UI
 */
export class TeamDisplay {
    /**
     * Creates a new TeamDisplay instance
     * @param {HTMLElement} container - Container element for displaying teams
     */
    constructor(container) {
        this.container = container;
    }

    /**
     * Creates a team element for display
     * @param {Object} team - Team data to display
     * @returns {HTMLElement} Team element
     */
    createTeamElement(team) {
        const teamElement = document.createElement('div');
        teamElement.className = 'team-card';
        teamElement.innerHTML = `
            <h3>${team.submitter}'s Team</h3>
            <div class="team-details">
                <div class="position-group">
                    <h4>Goalkeeper</h4>
                    <p>${team.goalkeeper}</p>
                </div>
                <div class="position-group">
                    <h4>Defenders</h4>
                    <ul>
                        ${team.defenders.map(defender => `<li>${defender}</li>`).join('')}
                    </ul>
                </div>
                <div class="position-group">
                    <h4>Midfielders</h4>
                    <ul>
                        ${team.midfielders.map(midfielder => `<li>${midfielder}</li>`).join('')}
                    </ul>
                </div>
                <div class="position-group">
                    <h4>Forwards</h4>
                    <ul>
                        ${team.forwards.map(forward => `<li>${forward}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="team-meta">
                <small>Created: ${new Date(team.createdAt).toLocaleString()}</small>
            </div>
        `;
        return teamElement;
    }

    /**
     * Displays a list of teams
     * @param {Array} teams - Array of team objects to display
     */
    displayTeams(teams) {
        // Clear existing teams
        this.container.innerHTML = '';
        
        if (teams.length === 0) {
            this.container.innerHTML = '<p class="no-teams">No teams have been submitted yet.</p>';
            return;
        }

        // Display teams in reverse chronological order
        teams.reverse().forEach(team => {
            const teamElement = this.createTeamElement(team);
            this.container.appendChild(teamElement);
        });
    }

    /**
     * Shows a message to the user
     * @param {string} message - Message to display
     * @param {string} type - Message type ('success', 'error', or 'info')
     */
    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        // Remove any existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Add new message
        document.body.insertBefore(messageElement, document.body.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    /**
     * Shows a loading state
     * @param {boolean} isLoading - Whether to show or hide loading state
     */
    setLoading(isLoading) {
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            if (isLoading) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
            } else {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        }
    }
} 