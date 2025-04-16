import { Team } from './Team.js';

/**
 * TeamForm class handles form validation and submission
 */
export class TeamForm {
    /**
     * Creates a new TeamForm instance
     * @param {HTMLElement} form - The form element
     * @param {TeamService} teamService - Instance of TeamService
     * @param {TeamDisplay} teamDisplay - Instance of TeamDisplay
     */
    constructor(form, teamService, teamDisplay) {
        this.form = form;
        this.teamService = teamService;
        this.teamDisplay = teamDisplay;
        this.initialize();
    }

    /**
     * Initializes the form with event listeners
     */
    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    /**
     * Collects player data from the form
     * @returns {Object} Team data object
     */
    collectTeamData() {
        return {
            submitter: this.form.querySelector('#submitterName').value.trim(),
            goalkeeper: this.form.querySelector('#goalkeeper').value.trim(),
            defenders: this.collectPlayers('defender'),
            midfielders: this.collectPlayers('midfielder'),
            forwards: this.collectPlayers('forward')
        };
    }

    /**
     * Collects players from a specific position group
     * @param {string} position - Position group name
     * @returns {Array} Array of player names
     */
    collectPlayers(position) {
        const players = [];
        const inputs = this.form.querySelectorAll(`input[name="${position}"]`);
        inputs.forEach(input => {
            const value = input.value.trim();
            if (value) players.push(value);
        });
        return players;
    }

    /**
     * Validates the team data
     * @param {Object} teamData - Team data to validate
     * @returns {Object} Validation result { isValid: boolean, message: string }
     */
    validateTeamData(teamData) {
        if (!teamData.submitter) {
            return { isValid: false, message: 'Please enter your name' };
        }

        if (!teamData.goalkeeper) {
            return { isValid: false, message: 'Please enter a goalkeeper' };
        }

        if (teamData.defenders.length < 3) {
            return { isValid: false, message: 'Please enter at least 3 defenders' };
        }

        if (teamData.midfielders.length < 3) {
            return { isValid: false, message: 'Please enter at least 3 midfielders' };
        }

        if (teamData.forwards.length < 1) {
            return { isValid: false, message: 'Please enter at least 1 forward' };
        }

        return { isValid: true, message: '' };
    }

    /**
     * Handles form submission
     * @param {Event} event - Form submit event
     */
    async handleSubmit(event) {
        event.preventDefault();

        try {
            // Show loading state
            this.teamDisplay.setLoading(true);

            // Collect and validate team data
            const teamData = this.collectTeamData();
            const validation = this.validateTeamData(teamData);

            if (!validation.isValid) {
                this.teamDisplay.showMessage(validation.message, 'error');
                return;
            }

            // Save team
            await this.teamService.saveTeam(teamData);
            
            // Show success message
            this.teamDisplay.showMessage('Team saved successfully!', 'success');
            
            // Reset form
            this.form.reset();
            
            // Refresh teams display
            const teams = await this.teamService.getAllTeams();
            this.teamDisplay.displayTeams(teams);

        } catch (error) {
            this.teamDisplay.showMessage(`Error: ${error.message}`, 'error');
        } finally {
            this.teamDisplay.setLoading(false);
        }
    }
} 