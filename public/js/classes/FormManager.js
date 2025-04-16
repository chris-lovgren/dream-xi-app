/**
 * FormManager - Handles form submission and validation
 * This class manages:
 * 1. Form data collection
 * 2. Input validation
 * 3. Form submission
 * 4. Error handling
 */
export class FormManager {
    /**
     * Creates a new FormManager instance
     * @param {HTMLFormElement} form - The form element to manage
     * @param {TeamService} teamService - The service for team operations
     * @param {TeamDisplay} teamDisplay - The display manager for teams
     */
    constructor(form, teamService, teamDisplay) {
        this.form = form;
        this.teamService = teamService;
        this.teamDisplay = teamDisplay;
        this.submitButton = form.querySelector('button[type="submit"]');
        
        // Bind event handlers
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    /**
     * Collects form data and returns it as an object
     * @returns {Object} The collected form data
     */
    collectFormData() {
        return {
            submitterName: this.form.querySelector('#submitterName').value,
            goalkeeper: this.form.querySelector('#goalkeeper').value,
            defenders: Array.from(this.form.querySelectorAll('.defender'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            midfielders: Array.from(this.form.querySelectorAll('.midfielder'))
                .map(input => input.value)
                .filter(value => value.trim() !== ''),
            forwards: Array.from(this.form.querySelectorAll('.forward'))
                .map(input => input.value)
                .filter(value => value.trim() !== '')
        };
    }

    /**
     * Validates the form data
     * @param {Object} data - The form data to validate
     * @returns {Array} Array of error messages, empty if valid
     */
    validateFormData(data) {
        const errors = [];

        // Validate submitter name
        if (!data.submitterName.trim()) {
            errors.push('Please enter your name');
        }

        // Validate goalkeeper
        if (!data.goalkeeper.trim()) {
            errors.push('Please select a goalkeeper');
        }

        // Validate defenders (3-5 required)
        if (data.defenders.length < 3) {
            errors.push('Please select at least 3 defenders');
        } else if (data.defenders.length > 5) {
            errors.push('Maximum 5 defenders allowed');
        }

        // Validate midfielders (3-5 required)
        if (data.midfielders.length < 3) {
            errors.push('Please select at least 3 midfielders');
        } else if (data.midfielders.length > 5) {
            errors.push('Maximum 5 midfielders allowed');
        }

        // Validate forwards (1-3 required)
        if (data.forwards.length < 1) {
            errors.push('Please select at least 1 forward');
        } else if (data.forwards.length > 3) {
            errors.push('Maximum 3 forwards allowed');
        }

        return errors;
    }

    /**
     * Handles form submission
     * @param {Event} event - The form submission event
     */
    async handleSubmit(event) {
        event.preventDefault();

        // Show loading state
        this.teamDisplay.setLoading(this.submitButton, true);

        try {
            // Collect and validate form data
            const formData = this.collectFormData();
            const errors = this.validateFormData(formData);

            if (errors.length > 0) {
                this.teamDisplay.showMessage(errors.join('\n'), 'error');
                return;
            }

            // Save the team
            await this.teamService.saveTeam(formData);
            
            // Show success message
            this.teamDisplay.showMessage('Team saved successfully!', 'success');
            
            // Reset form
            this.form.reset();
            
            // Refresh teams display
            const teams = await this.teamService.getAllTeams();
            this.teamDisplay.displayTeams(teams);

        } catch (error) {
            this.teamDisplay.showMessage('Error saving team: ' + error.message, 'error');
        } finally {
            // Hide loading state
            this.teamDisplay.setLoading(this.submitButton, false);
        }
    }
} 