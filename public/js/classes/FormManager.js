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
        const formData = new FormData(this.form);
        return {
            submitterName: formData.get('submitterName'),
            goalkeeper: formData.get('goalkeeper'),
            defenders: [
                formData.get('defender1'),
                formData.get('defender2'),
                formData.get('defender3'),
                formData.get('defender4')
            ],
            midfielders: [
                formData.get('midfielder1'),
                formData.get('midfielder2'),
                formData.get('midfielder3'),
                formData.get('midfielder4')
            ],
            forwards: [
                formData.get('forward1'),
                formData.get('forward2')
            ]
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

        // Validate defenders
        data.defenders.forEach((defender, index) => {
            if (!defender.trim()) {
                errors.push(`Please select defender ${index + 1}`);
            }
        });

        // Validate midfielders
        data.midfielders.forEach((midfielder, index) => {
            if (!midfielder.trim()) {
                errors.push(`Please select midfielder ${index + 1}`);
            }
        });

        // Validate forwards
        data.forwards.forEach((forward, index) => {
            if (!forward.trim()) {
                errors.push(`Please select forward ${index + 1}`);
            }
        });

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