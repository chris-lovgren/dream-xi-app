document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dream-team-form');
    const messageElement = document.getElementById('message');
    const teamsContainer = document.getElementById('saved-teams-container'); // Get the container for teams

    // Function to collect players from a position group
    const collectPlayers = (prefix, count) => {
        const players = [];
        for (let i = 1; i <= count; i++) {
            const input = form.querySelector(`input[name="${prefix}${i}"]`);
            if (input && input.value.trim()) {
                players.push(input.value.trim());
            }
        }
        return players;
    };

    // Function to fetch and display teams
    const fetchAndDisplayTeams = async () => {
        try {
            const res = await fetch('/teams');
            if (!res.ok) {
                // Try to get error message from response body
                let errorMsg = `HTTP error! status: ${res.status}`;
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (parseError) {
                    // Ignore if response body is not JSON or empty
                }
                throw new Error(errorMsg);
            }
            const teams = await res.json();

            teamsContainer.innerHTML = ''; // Clear previous content or "Loading..." message

            if (!Array.isArray(teams)) {
                console.error("Received non-array data from /teams endpoint:", teams);
                throw new Error("Invalid data format received from server.");
            }

            if (teams.length === 0) {
                teamsContainer.innerHTML = '<p>No teams saved yet.</p>';
                return;
            }

            // Display teams in reverse chronological order (newest first)
            teams.slice().reverse().forEach(team => {
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team-card'); // Add a class for styling

                // Basic function to sanitize text content
                const sanitize = (str) => {
                    const temp = document.createElement('div');
                    temp.textContent = str;
                    return temp.innerHTML;
                };

                const submitterName = document.createElement('h3');
                // Sanitize and display submitter name
                submitterName.textContent = `Team by: ${sanitize(team.submitterName || 'Anonymous')}`;

                const goalkeeper = document.createElement('p');
                goalkeeper.innerHTML = `<strong>Goalkeeper:</strong> ${sanitize(team.goalkeeper || 'N/A')}`;

                const defenders = document.createElement('p');
                // Sanitize each player name before joining
                defenders.innerHTML = `<strong>Defenders:</strong> ${team.defenders?.map(sanitize).join(', ') || 'N/A'}`;

                const midfielders = document.createElement('p');
                midfielders.innerHTML = `<strong>Midfielders:</strong> ${team.midfielders?.map(sanitize).join(', ') || 'N/A'}`;

                const forwards = document.createElement('p');
                forwards.innerHTML = `<strong>Forwards:</strong> ${team.forwards?.map(sanitize).join(', ') || 'N/A'}`;

                teamDiv.appendChild(submitterName);
                teamDiv.appendChild(goalkeeper);
                teamDiv.appendChild(defenders);
                teamDiv.appendChild(midfielders);
                teamDiv.appendChild(forwards);

                teamsContainer.appendChild(teamDiv);
            });

        } catch (error) {
            console.error('Error fetching teams:', error);
            teamsContainer.innerHTML = `<p style="color: red;">Could not load saved teams. ${error.message}</p>`;
        }
    };

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageElement.textContent = ''; // Clear previous message

        const team = {
            submitterName: form.querySelector('input[name="submitterName"]').value.trim(),
            goalkeeper: form.querySelector('input[name="goalkeeper"]').value.trim(),
            defenders: collectPlayers('defender', 5),
            midfielders: collectPlayers('midfielder', 5),
            forwards: collectPlayers('forward', 3)
        };

        // Validation
        if (!team.submitterName || !team.goalkeeper) {
            messageElement.textContent = 'Please enter your name and a goalkeeper.';
            messageElement.style.color = 'red';
            return;
        }

        if (team.defenders.length < 3) {
            messageElement.textContent = 'Please enter at least 3 defenders.';
            messageElement.style.color = 'red';
            return;
        }

        if (team.midfielders.length < 3) {
            messageElement.textContent = 'Please enter at least 3 midfielders.';
            messageElement.style.color = 'red';
            return;
        }

        if (team.forwards.length < 1) {
            messageElement.textContent = 'Please enter at least 1 forward.';
            messageElement.style.color = 'red';
            return;
        }

        try {
            const res = await fetch('/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(team)
            });

            // Always try to parse the response, even for errors
            let data = {};
            try {
                 data = await res.json();
            } catch(e) {
                // Handle cases where response is not JSON (e.g., plain text error from server)
                console.error("Could not parse response JSON:", e);
                data.message = "Received non-JSON response from server."
            }

            messageElement.textContent = data.message || (res.ok ? 'Success!' : 'An unknown error occurred.');

            if (res.ok) { // Check status code 200-299
                messageElement.style.color = 'green';
                form.reset(); // Clear the form
                fetchAndDisplayTeams(); // Refresh the list after successful save
            } else {
                messageElement.style.color = 'red';
                console.error('Failed to save team:', data);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            messageElement.textContent = 'An error occurred while submitting the team. Check console for details.';
            messageElement.style.color = 'red';
        }
    });

    // Initial load of teams when the page loads
    fetchAndDisplayTeams();
});
  