/**
 * Main application file for Dream XI
 * This file initializes the application and sets up the core components
 */

// Import the required classes
import { TeamService } from './js/classes/TeamService.js';
import { TeamDisplay } from './js/classes/TeamDisplay.js';
import { FormManager } from './js/classes/FormManager.js';

// Wait for the DOM to be fully loaded before initializing the application
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the TeamService for API communication
        const teamService = new TeamService();
        
        // Initialize the TeamDisplay for rendering teams in the UI
        const teamDisplay = new TeamDisplay(document.getElementById('teamsList'));
        
        // Initialize the FormManager to handle form interactions
        const formManager = new FormManager(
            document.getElementById('teamForm'),
            teamService,
            teamDisplay
        );

        // Load and display any existing teams when the page loads
        teamService.getAllTeams()
            .then(teams => teamDisplay.displayTeams(teams))
            .catch(error => {
                console.error('Error loading teams:', error);
                teamDisplay.showMessage('Failed to load teams. Please try again later.', 'error');
            });

        // Clean up when the page is unloaded
        window.addEventListener('unload', () => {
            formManager.destroy();
        });
    } catch (error) {
        console.error('Error initializing application:', error);
        const messageElement = document.createElement('div');
        messageElement.className = 'message error';
        messageElement.textContent = 'Failed to initialize application. Please refresh the page.';
        document.body.insertBefore(messageElement, document.body.firstChild);
    }
});
  