/**
 * TeamDisplay - Manages how teams are displayed in the UI
 * This class handles:
 * 1. Creating team cards
 * 2. Showing/hiding loading states
 * 3. Displaying messages to the user
 */
export class TeamDisplay {
    /**
     * Creates a new TeamDisplay instance
     * @param {HTMLElement} container - The HTML element where teams will be displayed
     */
    constructor(container) {
        this.container = container;
    }

    /**
     * Creates an HTML element for a team
     * @param {Object} team - The team data
     * @returns {HTMLElement} The team card element
     */
    createTeamElement(team) {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-card';
        
        // Add team creator's name
        const nameHeading = document.createElement('h3');
        nameHeading.textContent = `${team.submitterName}'s Team`;
        teamDiv.appendChild(nameHeading);

        // Create sections for each position group
        const positions = [
            { title: 'Goalkeeper', players: [team.goalkeeper] },
            { title: 'Defenders', players: team.defenders },
            { title: 'Midfielders', players: team.midfielders },
            { title: 'Forwards', players: team.forwards }
        ];

        // Add each position group to the team card
        positions.forEach(({ title, players }) => {
            const section = document.createElement('div');
            section.innerHTML = `
                <strong>${title}:</strong>
                <ul class="player-list">
                    ${players.map(player => `<li>${player}</li>`).join('')}
                </ul>
            `;
            teamDiv.appendChild(section);
        });

        return teamDiv;
    }

    /**
     * Displays a list of teams in the container
     * @param {Array} teams - Array of team objects to display
     */
    displayTeams(teams) {
        // Clear the container
        this.container.innerHTML = '';

        if (teams.length === 0) {
            this.showMessage('No teams have been submitted yet.', 'info');
            return;
        }

        // Display teams in reverse order (newest first)
        teams.reverse().forEach(team => {
            const teamElement = this.createTeamElement(team);
            this.container.appendChild(teamElement);
        });
    }

    /**
     * Shows a message to the user
     * @param {string} text - The message to display
     * @param {string} type - The type of message ('success', 'error', or 'info')
     */
    showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        
        // Add the message to the container
        this.container.insertBefore(messageDiv, this.container.firstChild);
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    /**
     * Sets the loading state of a button
     * @param {HTMLButtonElement} button - The button to update
     * @param {boolean} isLoading - Whether the button should show loading state
     */
    setLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }
} 