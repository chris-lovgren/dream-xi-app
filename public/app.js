document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('teamForm');
    const messageElement = document.getElementById('message');
    const teamsContainer = document.getElementById('teamsList');

    // Function to collect players from a position group
    const collectPlayers = (positionGroup) => {
        const inputs = positionGroup.querySelectorAll('input[type="text"]');
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(name => name);
    };

    // Function to fetch and display teams
    const fetchAndDisplayTeams = async () => {
        try {
            const res = await fetch('/teams');
            if (!res.ok) {
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

            teamsContainer.innerHTML = ''; // Clear previous content

            if (!Array.isArray(teams)) {
                console.error("Received non-array data from /teams endpoint:", teams);
                throw new Error("Invalid data format received from server.");
            }

            if (teams.length === 0) {
                teamsContainer.innerHTML = '<p>No teams saved yet. Be the first to create one!</p>';
                return;
            }

            // Display teams in reverse chronological order (newest first)
            teams.reverse().forEach(team => {
                const teamDiv = document.createElement('div');
                teamDiv.classList.add('team');

                const submitterName = document.createElement('h3');
                submitterName.textContent = `${team.submitterName}'s Team`;

                const goalkeeper = document.createElement('p');
                goalkeeper.innerHTML = `<strong>Goalkeeper:</strong> ${team.goalkeeper}`;

                const defenders = document.createElement('p');
                defenders.innerHTML = `<strong>Defenders:</strong> ${team.defenders.join(', ')}`;

                const midfielders = document.createElement('p');
                midfielders.innerHTML = `<strong>Midfielders:</strong> ${team.midfielders.join(', ')}`;

                const forwards = document.createElement('p');
                forwards.innerHTML = `<strong>Forwards:</strong> ${team.forwards.join(', ')}`;

                teamDiv.appendChild(submitterName);
                teamDiv.appendChild(goalkeeper);
                teamDiv.appendChild(defenders);
                teamDiv.appendChild(midfielders);
                teamDiv.appendChild(forwards);

                teamsContainer.appendChild(teamDiv);
            });

        } catch (error) {
            console.error('Error fetching teams:', error);
            teamsContainer.innerHTML = `<p class="error">Error loading teams: ${error.message}</p>`;
        }
    };

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        messageElement.textContent = 'Saving team...';
        messageElement.className = 'message';

        try {
            const team = {
                submitterName: document.getElementById('submitterName').value.trim(),
                goalkeeper: document.getElementById('goalkeeper').value.trim(),
                defenders: collectPlayers(document.getElementById('defendersGroup')),
                midfielders: collectPlayers(document.getElementById('midfieldersGroup')),
                forwards: collectPlayers(document.getElementById('forwardsGroup'))
            };

            // Validation
            if (!team.submitterName || !team.goalkeeper) {
                throw new Error('Please fill in your name and goalkeeper');
            }

            if (team.defenders.length < 3 || team.defenders.length > 5) {
                throw new Error('You must select between 3 and 5 defenders');
            }

            if (team.midfielders.length < 3 || team.midfielders.length > 5) {
                throw new Error('You must select between 3 and 5 midfielders');
            }

            if (team.forwards.length < 1 || team.forwards.length > 3) {
                throw new Error('You must select between 1 and 3 forwards');
            }

            const res = await fetch('/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(team)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to save team');
            }

            messageElement.textContent = 'Team saved successfully!';
            messageElement.className = 'message success';
            form.reset();
            await fetchAndDisplayTeams();

        } catch (error) {
            console.error('Error:', error);
            messageElement.textContent = `Error: ${error.message}`;
            messageElement.className = 'message error';
        }
    });

    // Initial load of teams
    fetchAndDisplayTeams();
});
  