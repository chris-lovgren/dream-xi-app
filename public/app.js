import { TeamService } from './js/services/TeamService.js';
import { TeamDisplay } from './js/classes/TeamDisplay.js';

// Initialize services and display
const teamService = new TeamService();
const teamDisplay = new TeamDisplay(document.getElementById('teamsList'));

// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', () => {
    // Get references to important elements in the HTML
    const teamForm = document.getElementById('teamForm');
    const messageDiv = document.getElementById('message');
    const teamsListDiv = document.getElementById('teamsList');
    const submitButton = teamForm.querySelector('button[type="submit"]');

    /**
     * Collects all player names from input fields of a specific position
     * @param {string} className - The CSS class name for the position (e.g., 'defender', 'midfielder')
     * @returns {string[]} Array of player names (empty strings are filtered out)
     */
    function collectPlayers(className) {
        // Find all input fields with the specified class
        const inputs = teamForm.querySelectorAll(`input.${className}`);
        // Convert inputs to an array and get their values
        // Filter out any empty strings (optional players not filled in)
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(value => value !== '');
    }

    /**
     * Shows a message to the user (success or error)
     * @param {string} text - The message to display
     * @param {string} type - The type of message ('success' or 'error')
     */
    function showMessage(text, type) {
        // Set the message text and styling
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';

        // Hide the message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    /**
     * Creates an HTML element to display a saved team
     * @param {Object} team - The team data object
     * @returns {HTMLElement} A div element containing the team information
     */
    function createTeamElement(team) {
        // Create the main container for the team
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-card';

        // Add the team creator's name
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
     * Fetches all saved teams from the server and displays them
     * Shows newest teams first (reverse chronological order)
     */
    async function fetchAndDisplayTeams() {
        try {
            // Fetch teams from the server
            const response = await fetch('/teams');
            if (!response.ok) {
                throw new Error('Failed to fetch teams');
            }

            const teams = await response.json();

            // Clear the current list of teams
            teamsListDiv.innerHTML = '';

            // Display teams in reverse order (newest first)
            teams.reverse().forEach(team => {
                const teamElement = createTeamElement(team);
                teamsListDiv.appendChild(teamElement);
            });
        } catch (error) {
            console.error('Error fetching teams:', error);
            showMessage('Failed to load teams. Please try again later.', 'error');
        }
    }

    // Load and display saved teams when the page loads
    teamService.getAllTeams()
        .then(teams => teamDisplay.displayTeams(teams))
        .catch(error => {
            console.error('Error loading teams:', error);
            teamDisplay.showMessage('Error loading teams. Please try again later.', 'error');
        });

    // Handle form submission
    teamForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Set loading state
        teamDisplay.setLoading(submitButton, true);

        try {
            // Collect form data
            const teamData = {
                submitterName: document.getElementById('submitterName').value,
                goalkeeper: document.getElementById('goalkeeper').value,
                defenders: Array.from(document.getElementsByClassName('defender'))
                    .map(input => input.value)
                    .filter(name => name.trim() !== ''),
                midfielders: Array.from(document.getElementsByClassName('midfielder'))
                    .map(input => input.value)
                    .filter(name => name.trim() !== ''),
                forwards: Array.from(document.getElementsByClassName('forward'))
                    .map(input => input.value)
                    .filter(name => name.trim() !== '')
            };

            // Validate team composition
            if (teamData.defenders.length < 3 || teamData.defenders.length > 5) {
                throw new Error('You must select between 3 and 5 defenders');
            }
            if (teamData.midfielders.length < 3 || teamData.midfielders.length > 5) {
                throw new Error('You must select between 3 and 5 midfielders');
            }
            if (teamData.forwards.length < 1 || teamData.forwards.length > 3) {
                throw new Error('You must select between 1 and 3 forwards');
            }

            // Save the team
            await teamService.saveTeam(teamData);
            
            // Show success message
            teamDisplay.showMessage('Team saved successfully!', 'success');
            
            // Refresh the teams list
            const teams = await teamService.getAllTeams();
            teamDisplay.displayTeams(teams);
            
            // Reset the form
            teamForm.reset();
        } catch (error) {
            console.error('Error saving team:', error);
            teamDisplay.showMessage(error.message || 'Failed to save team. Please try again.', 'error');
        } finally {
            // Reset loading state
            teamDisplay.setLoading(submitButton, false);
        }
    });
});
  