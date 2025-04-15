document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('teamForm');
    const messageElement = document.getElementById('message');
    const teamsContainer = document.getElementById('teamsList');
    const submitButton = form.querySelector('button[type="submit"]');

    // Loading state management
    const setLoading = (isLoading) => {
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Saving...' : 'Save Team';
        if (isLoading) {
            submitButton.classList.add('loading');
        } else {
            submitButton.classList.remove('loading');
        }
    };

    // Function to show messages with different types
    const showMessage = (message, type = 'info') => {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        }
    };

    // Function to collect players from a position group
    const collectPlayers = (positionGroupId) => {
        const inputs = document.querySelectorAll(`#${positionGroupId} input[type="text"]`);
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(name => name !== '');
    };

    // Function to validate form data
    const validateForm = (team) => {
        const errors = [];

        if (!team.submitterName) {
            errors.push('Please enter your name');
        }

        if (!team.goalkeeper) {
            errors.push('Please select a goalkeeper');
        }

        if (team.defenders.length < 3 || team.defenders.length > 5) {
            errors.push('You must select between 3 and 5 defenders');
        }

        if (team.midfielders.length < 3 || team.midfielders.length > 5) {
            errors.push('You must select between 3 and 5 midfielders');
        }

        if (team.forwards.length < 1 || team.forwards.length > 3) {
            errors.push('You must select between 1 and 3 forwards');
        }

        return errors;
    };

    // Function to fetch and display teams
    const fetchAndDisplayTeams = async () => {
        try {
            teamsContainer.innerHTML = '<div class="loading">Loading teams...</div>';
            
            const res = await fetch('/teams');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const teams = await res.json();

            if (!Array.isArray(teams)) {
                throw new Error('Invalid data format received from server');
            }

            teamsContainer.innerHTML = '';

            if (teams.length === 0) {
                teamsContainer.innerHTML = '<p class="no-teams">No teams saved yet. Be the first to create one!</p>';
                return;
            }

            // Display teams in reverse chronological order
            teams.reverse().forEach(team => {
                const teamCard = document.createElement('div');
                teamCard.className = 'team-card';
                teamCard.innerHTML = `
                    <h3>${team.submitterName}'s Team</h3>
                    <div class="team-details">
                        <p><strong>Goalkeeper:</strong> ${team.goalkeeper}</p>
                        <p><strong>Defenders:</strong> ${team.defenders.join(', ')}</p>
                        <p><strong>Midfielders:</strong> ${team.midfielders.join(', ')}</p>
                        <p><strong>Forwards:</strong> ${team.forwards.join(', ')}</p>
                    </div>
                `;
                teamsContainer.appendChild(teamCard);
            });

        } catch (error) {
            console.error('Error fetching teams:', error);
            teamsContainer.innerHTML = '<p class="error">Failed to load teams. Please try again later.</p>';
        }
    };

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);
        showMessage('Saving team...', 'info');

        try {
            const team = {
                submitterName: document.getElementById('submitterName').value.trim(),
                goalkeeper: document.getElementById('goalkeeper').value.trim(),
                defenders: collectPlayers('defendersGroup'),
                midfielders: collectPlayers('midfieldersGroup'),
                forwards: collectPlayers('forwardsGroup')
            };

            // Validate form data
            const errors = validateForm(team);
            if (errors.length > 0) {
                throw new Error(errors.join('\n'));
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

            showMessage('Team saved successfully!', 'success');
            form.reset();
            await fetchAndDisplayTeams();

        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message, 'error');
        } finally {
            setLoading(false);
        }
    });

    // Initial load of teams
    fetchAndDisplayTeams();
});
  