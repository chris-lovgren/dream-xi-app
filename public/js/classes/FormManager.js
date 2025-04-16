import { BaseComponent } from './BaseComponent.js';
import { Team } from './Team.js';

/**
 * FormManager class handles form interactions and validation
 * Extends BaseComponent to get common functionality
 */
export class FormManager extends BaseComponent {
    /**
     * Creates a new FormManager instance
     * @param {HTMLElement} form - The form element to manage
     * @param {TeamService} teamService - The service for saving teams
     * @param {TeamDisplay} teamDisplay - The display component for showing teams
     */
    constructor(form, teamService, teamDisplay) {
        super();
        if (!form || !teamService || !teamDisplay) {
            throw new Error('Form, TeamService, and TeamDisplay are required');
        }

        this.setState({
            form,
            teamService,
            teamDisplay,
            isLoading: false,
            error: null
        });

        this.initializeForm();
        this.log('FormManager initialized');
    }

    /**
     * Initializes the form with event listeners
     */
    initializeForm() {
        const form = this.getState().form;
        form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Add input validation
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', this.validateInput.bind(this));
        });
    }

    /**
     * Handles form submission
     * @param {Event} event - The submit event
     */
    async handleSubmit(event) {
        event.preventDefault();
        try {
            this.setState({ isLoading: true, error: null });
            this.log('Handling form submission');

            const formData = this.getFormData();
            const team = new Team(formData);
            
            const validation = team.validate();
            if (!validation.isValid) {
                this.showValidationErrors(validation.errors);
                return;
            }

            await this.getState().teamService.saveTeam(team);
            this.getState().teamDisplay.showSuccess('Team saved successfully!');
            this.resetForm();
            
            // Refresh the teams list
            const teams = await this.getState().teamService.getAllTeams();
            this.getState().teamDisplay.displayTeams(teams);
            
            this.trigger('teamSaved', team);
        } catch (error) {
            this.setState({ error: error.message });
            this.handleError(error, 'Saving team');
            this.getState().teamDisplay.showError('Failed to save team. Please try again.');
        } finally {
            this.setState({ isLoading: false });
        }
    }

    /**
     * Gets form data and converts it to a team object
     * @returns {Object} Team data object
     */
    getFormData() {
        const form = this.getState().form;
        return {
            submitterName: form.querySelector('#submitterName').value.trim(),
            goalkeeper: form.querySelector('#goalkeeper').value.trim(),
            defenders: Array.from(form.querySelectorAll('.defender'))
                .map(input => input.value.trim())
                .filter(name => name),
            midfielders: Array.from(form.querySelectorAll('.midfielder'))
                .map(input => input.value.trim())
                .filter(name => name),
            forwards: Array.from(form.querySelectorAll('.forward'))
                .map(input => input.value.trim())
                .filter(name => name)
        };
    }

    /**
     * Validates a single input field
     * @param {Event} event - The input event
     */
    validateInput(event) {
        const input = event.target;
        const value = input.value.trim();
        
        if (input.required && !value) {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    }

    /**
     * Shows validation errors to the user
     * @param {Array} errors - Array of error messages
     */
    showValidationErrors(errors) {
        this.setState({ error: errors.join(', ') });
        this.getState().teamDisplay.showError(errors.join('<br>'));
    }

    /**
     * Resets the form to its initial state
     */
    resetForm() {
        const form = this.getState().form;
        form.reset();
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('invalid');
        });
    }

    /**
     * Lifecycle method called before component is destroyed
     */
    beforeDestroy() {
        const form = this.getState().form;
        form.removeEventListener('submit', this.handleSubmit);
        form.querySelectorAll('input').forEach(input => {
            input.removeEventListener('input', this.validateInput);
        });
        this.trigger('beforeDestroy');
    }
} 