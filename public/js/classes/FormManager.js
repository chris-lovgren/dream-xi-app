import { BaseComponent } from './BaseComponent.js';
import { Team } from './Team.js';
import { Validatable } from './interfaces.js';

/**
 * FormManager class handles form interactions and validation
 * Extends BaseComponent and implements Validatable interface
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
            error: null,
            isValid: false,
            validationErrors: []
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
     * Validates the form data
     * @returns {Object} Validation result with isValid and errors
     */
    validate() {
        try {
            const formData = new FormData(this.getState().form);
            const errors = [];
            
            // Validate submitter name
            const submitterName = formData.get('submitterName');
            if (!submitterName || submitterName.trim() === '') {
                errors.push('Submitter name is required');
            }

            // Validate goalkeeper
            const goalkeeper = formData.get('goalkeeper');
            if (!goalkeeper || goalkeeper.trim() === '') {
                errors.push('Goalkeeper is required');
            }

            // Validate defenders
            const defenders = formData.getAll('defenders');
            if (defenders.length < 3 || defenders.length > 5) {
                errors.push('You must select between 3 and 5 defenders');
            }

            // Validate midfielders
            const midfielders = formData.getAll('midfielders');
            if (midfielders.length < 3 || midfielders.length > 5) {
                errors.push('You must select between 3 and 5 midfielders');
            }

            // Validate forwards
            const forwards = formData.getAll('forwards');
            if (forwards.length < 1 || forwards.length > 3) {
                errors.push('You must select between 1 and 3 forwards');
            }

            const isValid = errors.length === 0;
            this.setState({ isValid, validationErrors: errors });
            
            return {
                isValid,
                errors: errors.length > 0 ? errors : null
            };
        } catch (error) {
            this.handleError(error, 'Validating form');
            return {
                isValid: false,
                errors: ['An error occurred during validation']
            };
        }
    }

    /**
     * Gets the form data as an object
     * @returns {Object} Form data
     */
    getFormData() {
        const formData = new FormData(this.getState().form);
        return {
            submitterName: formData.get('submitterName'),
            goalkeeper: formData.get('goalkeeper'),
            defenders: formData.getAll('defenders'),
            midfielders: formData.getAll('midfielders'),
            forwards: formData.getAll('forwards')
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
     * Shows validation errors in the UI
     * @param {Array<string>} errors - Array of error messages
     */
    showErrors(errors) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-messages';
        errorContainer.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        
        const form = this.getState().form;
        const existingErrors = form.querySelector('.error-messages');
        if (existingErrors) {
            existingErrors.remove();
        }
        form.insertBefore(errorContainer, form.firstChild);
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
        this.resetForm();
        this.trigger('beforeDestroy');
    }
} 