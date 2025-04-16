import { BaseComponent } from './BaseComponent.js';
import { Team } from './Team.js';

/**
 * FormManager - Handles form interactions and validation
 * Extends BaseComponent to get common functionality
 */
export class FormManager extends BaseComponent {
    /**
     * Creates a new FormManager instance
     * @param {HTMLElement} form - The form element
     * @param {TeamService} teamService - The team service instance
     * @param {TeamDisplay} teamDisplay - The team display instance
     */
    constructor(form, teamService, teamDisplay) {
        super();
        this.form = form;
        this.teamService = teamService;
        this.teamDisplay = teamDisplay;
        this.submitButton = this.form.querySelector('button[type="submit"]');
        
        this.initialize();
        this.log('FormManager initialized');
    }

    /**
     * Initializes the form manager
     */
    initialize() {
        try {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.log('Form event listeners initialized');
        } catch (error) {
            this.handleError(error, 'Initializing form manager');
        }
    }

    /**
     * Handles form submission
     * @param {Event} event - The submit event
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        try {
            this.log('Form submission started');
            this.teamDisplay.setLoading(this.submitButton, true);

            // Collect form data
            const formData = this.collectFormData();
            
            // Create and validate team
            const team = new Team(formData);
            const validation = team.validate();
            
            if (!validation.isValid) {
                this.teamDisplay.showMessage(validation.message, 'error');
                return;
            }

            // Save team
            await this.teamService.saveTeam(team.toJSON());
            
            // Refresh teams display
            const teams = await this.teamService.getAllTeams();
            this.teamDisplay.displayTeams(teams);
            
            // Show success message and reset form
            this.teamDisplay.showMessage('Team saved successfully!', 'success');
            this.form.reset();
            
            this.log('Form submission completed successfully');
        } catch (error) {
            this.handleError(error, 'Submitting form');
            this.teamDisplay.showMessage('Failed to save team. Please try again.', 'error');
        } finally {
            this.teamDisplay.setLoading(this.submitButton, false);
        }
    }

    /**
     * Collects data from the form
     * @returns {Object} The collected form data
     */
    collectFormData() {
        try {
            const data = {
                submitterName: this.form.querySelector('#submitterName').value.trim(),
                goalkeeper: this.form.querySelector('#goalkeeper').value.trim(),
                defenders: Array.from(this.form.querySelectorAll('.defender'))
                    .map(input => input.value.trim())
                    .filter(name => name),
                midfielders: Array.from(this.form.querySelectorAll('.midfielder'))
                    .map(input => input.value.trim())
                    .filter(name => name),
                forwards: Array.from(this.form.querySelectorAll('.forward'))
                    .map(input => input.value.trim())
                    .filter(name => name)
            };
            
            this.log('Form data collected');
            return data;
        } catch (error) {
            this.handleError(error, 'Collecting form data');
            throw error;
        }
    }

    /**
     * Cleans up resources when form manager is destroyed
     */
    destroy() {
        try {
            this.form.removeEventListener('submit', this.handleSubmit);
            super.destroy();
            this.log('FormManager destroyed');
        } catch (error) {
            this.handleError(error, 'Destroying form manager');
        }
    }
} 