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

    // Handle form submission
    teamForm.addEventListener('submit', async (event) => {
        // Prevent the default form submission
        event.preventDefault();

        try {
            // Show loading state on the submit button
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            // Collect all the form data
            const teamData = {
                submitterName: document.getElementById('submitterName').value.trim(),
                goalkeeper: document.getElementById('goalkeeper').value.trim(),
                defenders: collectPlayers('defender'),
                midfielders: collectPlayers('midfielder'),
                forwards: collectPlayers('forward')
            };

            // Validate the team composition
            const errors = [];

            // Check if submitter name is provided
            if (!teamData.submitterName) {
                errors.push('Please enter your name');
            }

            // Check if goalkeeper is provided
            if (!teamData.goalkeeper) {
                errors.push('Please select a goalkeeper');
            }

            // Check number of defenders (3-5 required)
            if (teamData.defenders.length < 3) {
                errors.push('You must select at least 3 defenders');
            } else if (teamData.defenders.length > 5) {
                errors.push('You cannot select more than 5 defenders');
            }

            // Check number of midfielders (3-5 required)
            if (teamData.midfielders.length < 3) {
                errors.push('You must select at least 3 midfielders');
            } else if (teamData.midfielders.length > 5) {
                errors.push('You cannot select more than 5 midfielders');
            }

            // Check number of forwards (1-3 required)
            if (teamData.forwards.length < 1) {
                errors.push('You must select at least 1 forward');
            } else if (teamData.forwards.length > 3) {
                errors.push('You cannot select more than 3 forwards');
            }

            // If there are any validation errors, throw them
            if (errors.length > 0) {
                throw new Error(errors.join('\n'));
            }

            // Send the team data to the server
            const response = await fetch('/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });

            // Handle the server response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save team');
            }

            // Show success message and reset the form
            showMessage('Team saved successfully!', 'success');
            teamForm.reset();

            // Refresh the displayed teams list
            await fetchAndDisplayTeams();

        } catch (error) {
            // Show error message to the user
            showMessage(error.message || 'Failed to save team', 'error');
            console.error('Error saving team:', error);
        } finally {
            // Reset the submit button state
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });

    // Load and display saved teams when the page loads
    fetchAndDisplayTeams();
});
  